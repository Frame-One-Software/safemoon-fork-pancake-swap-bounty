import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import chai from "chai";
import {Contracts, Signers} from "../../types";

const expect = chai.expect;

async function isExcludedFromFee(this: { signers: Signers, contracts: Contracts }, address: string) {
	return this.contracts.tokenContract.isExcludedFromFee(address);
}

async function excludeFromFee(this: { signers: Signers, contracts: Contracts }, address: string) {
	await this.contracts.tokenContract.connect(this.signers.tokenCreator).excludeFromFee(address);
	const excluded = await isExcludedFromFee.bind(this)(address);
	expect(excluded).to.be.false;
}

async function includeInFee(this: { signers: Signers, contracts: Contracts }, address: string) {
	await this.contracts.tokenContract.connect(this.signers.tokenCreator).includeInFee(address);
	const excluded = await isExcludedFromFee.bind(this)(address);
	expect(excluded).to.be.true;
}

async function isExcludedFromReward(this: { signers: Signers, contracts: Contracts }, address: string) {
	return this.contracts.tokenContract.isExcludedFromReward(address);
}

async function excludeFromReward(this: { signers: Signers, contracts: Contracts }, address: string) {
	await this.contracts.tokenContract.connect(this.signers.tokenCreator).excludeFromReward(address);
	const excluded = await isExcludedFromReward.bind(this)(address);
	expect(excluded).to.be.false;
}

async function includeInReward(this: { signers: Signers, contracts: Contracts }, address: string) {
	await this.contracts.tokenContract.connect(this.signers.tokenCreator).includeInReward(address);
	const excluded = await isExcludedFromReward.bind(this)(address);
	expect(excluded).to.be.true;
}

export {
	isExcludedFromFee,
	excludeFromFee,
	includeInFee,
	isExcludedFromReward,
	excludeFromReward,
	includeInReward
}