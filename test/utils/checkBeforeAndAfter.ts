import {Contracts, SignerDetails, Signers} from "../../types";
import chai from "chai";
import {BigNumber} from "ethers";

const expect = chai.expect;
const assert = chai.assert;

interface CheckRequirements {
	fromKey: keyof Signers;
	toKey: keyof Signers;
	amount: BigNumber;
	detailsBefore: SignerDetails;
	detailsAfter: SignerDetails;
	totalSupplyBefore: BigNumber;
	totalSupplyAfter: BigNumber;
}


/**
 * This is a  util to pass in the details before and after and it will check
 * the appropriate taxes and liquidity were taken account for.
 */
async function checkBeforeAndAfter(this: { signers: Signers, contracts: Contracts }, checkRequirements: CheckRequirements) {

	// extract input variables
	const {
		fromKey,
		toKey,
		amount,
		detailsBefore,
		detailsAfter,
		totalSupplyBefore,
		totalSupplyAfter,
	} = checkRequirements;

	// get necessary addresses
	const fromAddress = this.signers[fromKey].address;
	const toAddress = this.signers[toKey].address;

	// get necessary balances
	const fromBalanceBefore = detailsBefore[fromKey].tokenBalance;
	const toBalanceBefore = detailsBefore[toKey].tokenBalance;
	const marketingBalanceBefore = detailsBefore.marketing.tokenBalance;
	const charityBalanceBefore = detailsBefore.charity.tokenBalance;
	const fromBalanceAfter = detailsAfter[fromKey].tokenBalance;
	const toBalanceAfter = detailsAfter[toKey].tokenBalance;
	const marketingBalanceAfter = detailsAfter.marketing.tokenBalance;
	const charityBalanceAfter = detailsAfter.charity.tokenBalance;

	// get all appropriate rates, variables, and exclusions
	// NOTE: not sure why Promise.all(), does not work here, if you can fix, please do
	const [
		taxFeePercent,
		liquidityFeePercent,
		burnFeePercent,
		charityFeePercent,
		marketingFeePercent,
		fromAddressExcludedFromFee,
		toAddressExcludedFromFee,
		fromAddressExcludedFromReward,
		toAddressExcludedFromReward,
		charityExcludedFromReward,
		marketingExcludedFromReward,
	] = [
		await this.contracts.tokenContract._taxFee(),
		await this.contracts.tokenContract._liquidityFee(),
		await this.contracts.tokenContract._burnFee(),
		await this.contracts.tokenContract._charityFee(),
		await this.contracts.tokenContract._marketingFee(),
		await this.contracts.tokenContract.isExcludedFromFee(fromAddress),
		await this.contracts.tokenContract.isExcludedFromFee(toAddress),
		await this.contracts.tokenContract.isExcludedFromReward(fromAddress),
		await this.contracts.tokenContract.isExcludedFromReward(toAddress),
		await this.contracts.tokenContract.isExcludedFromReward(this.signers.charity.address.toString()),
		await this.contracts.tokenContract.isExcludedFromReward(this.signers.marketing.address.toString())
	];

	// check and see if this function had fees
	if (fromAddressExcludedFromFee || toAddressExcludedFromFee) {
		// there should be no taxes on the transaction, thus like a regular transaction
		expect(toBalanceAfter).to.be.equal(toBalanceBefore.add(amount));
		expect(fromBalanceAfter).to.be.equal(fromBalanceBefore.sub(amount));
		return;
	}

	// calculate fees
	const charityFee = amount.mul(charityFeePercent as BigNumber).div(BigNumber.from(100));
	const marketingFee = amount.mul(marketingFeePercent as BigNumber).div(BigNumber.from(100));
	const burnFee = amount.mul(burnFeePercent as BigNumber).div(BigNumber.from(100));
	const liquidityFee = amount.mul(liquidityFeePercent as BigNumber).div(BigNumber.from(100));
	const taxFee = amount.mul(taxFeePercent as BigNumber).div(BigNumber.from(100));

	// calculate actual amount transferred
	const actualAmount = amount.sub(charityFee).sub(marketingFee).sub(burnFee).sub(liquidityFee).sub(taxFee);

	// get necessary percentage of totalSupply
	const precision = 100000000000000000;
	const fromPercentage = fromBalanceAfter.mul(precision).div(totalSupplyAfter);
	const toPercentage = toBalanceAfter.mul(precision).div(totalSupplyAfter);
	const charityPercentage = charityBalanceAfter.mul(precision).div(totalSupplyAfter);
	const marketingPercentage = marketingBalanceAfter.mul(precision).div(totalSupplyAfter);

	// calculate potential rewards (below conditions will decide if these are used)
	const fromReward = fromPercentage.mul(taxFee).div(precision);
	const toReward = toPercentage.mul(taxFee).div(precision);
	const charityReward = charityPercentage.mul(taxFee).div(precision);
	const marketingReward = marketingPercentage.mul(taxFee).div(precision);

	// check the from balance
	const fromExpectedBalanceWithoutReward = fromBalanceBefore.sub(actualAmount)
	if (fromAddressExcludedFromReward) {
		// this should be just the like a regular transaction, since no tokens back on reward
		expect(fromBalanceAfter).to.be.equal(fromExpectedBalanceWithoutReward);
	} else {
		// this is the amount plus the reward
		expect(fromBalanceAfter).to.be.equal(fromExpectedBalanceWithoutReward.add(fromReward));
	}

	// check the to balance
	const toExpectedBalanceWithoutReward = fromBalanceBefore.add(actualAmount)
	if (toAddressExcludedFromReward) {
		// this should be just the like a regular transaction, since no tokens back on reward
		expect(fromBalanceAfter).to.be.equal(toExpectedBalanceWithoutReward);
	} else {
		// this is the amount plus the reward
		expect(toBalanceAfter).to.be.equal(toExpectedBalanceWithoutReward.add(toReward));
	}

	// check charity wallet
	const charityExpectedBalanceWithoutReward = charityBalanceBefore.add(charityFee);
	if (charityExcludedFromReward) {
		// take a straight fee
		expect(charityBalanceAfter).to.be.equal(charityExpectedBalanceWithoutReward);
	} else {
		expect(charityBalanceAfter).to.be.equal(charityExpectedBalanceWithoutReward.add(charityReward));
	}

	// check the marketing wallet
	const marketingExpectedBalanceWithoutReward = marketingBalanceBefore.add(marketingFee);
	if (marketingExcludedFromReward) {
		// take a straight fee
		expect(marketingBalanceAfter).to.be.equal(marketingBalanceBefore.add(marketingFee));
	} else {
		expect(marketingBalanceAfter).to.be.equal(marketingExpectedBalanceWithoutReward.add(charityReward));
	}

	// check the liquidity
	// TODO

	// check the burn
	// TODO
}

export {checkBeforeAndAfter};