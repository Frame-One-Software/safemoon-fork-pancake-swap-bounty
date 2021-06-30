import {SignerDetails} from "../types";
import getDetailsOfSigners from "./utils/getDetailsOfSigners";
import {parseEther} from "ethers/lib/utils";
import {easyTransfer} from "./utils/easyTransfers";
import {excludeFromFee, excludeFromReward, includeInFee, includeInReward} from "./utils/easyExcludeAndInclude";

export default function RegularUseFunctionTests() {

	const transferAmount = parseEther("100");

	/**
	 * transfer tokens for some transactions
	 */
	beforeEach(async function () {
		// give signers some tokens
		await this.contracts.tokenContract.connect(this.signers.tokenCreator).transfer(this.signers.peter.address, parseEther("1000"));
		await this.contracts.tokenContract.connect(this.signers.tokenCreator).transfer(this.signers.khan.address, parseEther("1000"));
	})

	describe("Check transfers", async function () {

		/**
		 * Do the transfer afterward, saves writing this every time
		 */
		afterEach(async function () {
			await easyTransfer.bind(this)("peter", "khan", transferAmount);
		})

		describe("Check transfers with exclusions from fees", async function () {

			it("From (fee): included | To (fee): included", async function () {
				await includeInFee.bind(this)(this.signers.peter.address);
				await includeInFee.bind(this)(this.signers.khan.address);
			})

			it("From (fee): included | To (fee): excluded", async function () {
				await includeInFee.bind(this)(this.signers.peter.address);
				await excludeFromFee.bind(this)(this.signers.khan.address);
			})

			it("From (fee): excluded | To (fee): included", async function () {
				await excludeFromFee.bind(this)(this.signers.peter.address);
				await includeInFee.bind(this)(this.signers.khan.address);
			})

			it("From (fee): excluded | To (fee): excluded", async function () {
				await excludeFromFee.bind(this)(this.signers.peter.address);
				await excludeFromFee.bind(this)(this.signers.khan.address);
			})
		})

		describe("Check transfers with exclusions from reward", async function () {

			it("From (reward): included | To (reward): included", async function () {
				await includeInReward.bind(this)(this.signers.peter.address);
				await includeInReward.bind(this)(this.signers.khan.address);
			})

			it("From (reward): included | To (reward): excluded", async function () {
				await includeInReward.bind(this)(this.signers.peter.address);
				await excludeFromReward.bind(this)(this.signers.khan.address);
			})

			it("From (reward): excluded | To (reward): included", async function () {
				await excludeFromReward.bind(this)(this.signers.peter.address);
				await includeInReward.bind(this)(this.signers.khan.address);
			})

			it("From (reward): excluded | To (reward): excluded", async function () {
				await excludeFromReward.bind(this)(this.signers.peter.address);
				await excludeFromReward.bind(this)(this.signers.khan.address);
			})
		})

		describe("Check transfers with exclusions from rewards and fees", async function () {

			it("From (fee): included | From (reward): included | to (fee): included | To (reward): included", async function () {
				await includeInFee.bind(this)(this.signers.peter.address);
				await includeInReward.bind(this)(this.signers.peter.address);
				await includeInFee.bind(this)(this.signers.khan.address);
				await includeInReward.bind(this)(this.signers.khan.address);
			})

			it("From (fee): included | From (reward): included | to (fee): included | To (reward): included", async function () {
				await includeInFee.bind(this)(this.signers.peter.address);
				await includeInReward.bind(this)(this.signers.peter.address);
				await includeInFee.bind(this)(this.signers.khan.address);
				await includeInReward.bind(this)(this.signers.khan.address);
			})

			it("From (fee): included | From (reward): included | to (fee): included | To (reward): included", async function () {
				await includeInFee.bind(this)(this.signers.peter.address);
				await includeInReward.bind(this)(this.signers.peter.address);
				await includeInFee.bind(this)(this.signers.khan.address);
				await includeInReward.bind(this)(this.signers.khan.address);
			})

			it("From (fee): included | From (reward): included | to (fee): included | To (reward): included", async function () {
				await includeInFee.bind(this)(this.signers.peter.address);
				await includeInReward.bind(this)(this.signers.peter.address);
				await includeInFee.bind(this)(this.signers.khan.address);
				await includeInReward.bind(this)(this.signers.khan.address);
			})

			it("From (fee): included | From (reward): included | to (fee): included | To (reward): included", async function () {
				await includeInFee.bind(this)(this.signers.peter.address);
				await includeInReward.bind(this)(this.signers.peter.address);
				await includeInFee.bind(this)(this.signers.khan.address);
				await includeInReward.bind(this)(this.signers.khan.address);
			})

			it("From (fee): included | From (reward): included | to (fee): included | To (reward): included", async function () {
				await includeInFee.bind(this)(this.signers.peter.address);
				await includeInReward.bind(this)(this.signers.peter.address);
				await includeInFee.bind(this)(this.signers.khan.address);
				await includeInReward.bind(this)(this.signers.khan.address);
			})

			it("From (fee): included | From (reward): included | to (fee): included | To (reward): included", async function () {
				await includeInFee.bind(this)(this.signers.peter.address);
				await includeInReward.bind(this)(this.signers.peter.address);
				await includeInFee.bind(this)(this.signers.khan.address);
				await includeInReward.bind(this)(this.signers.khan.address);
			})
		})
	})

	describe("Check allowances", async function () {
		// TODO
	})

	describe("Check Deliver", async function () {
		// TODO
	})
}