import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import {BigNumber, Contract} from "ethers";
import {Address} from "cluster";
import {PBLOToken, WBNB, PancakeRouter, PancakeFactory, IUniswapV2Pair, PancakePair} from "../typechain";

export interface Signers {
	tokenCreator: SignerWithAddress;
	pancakeSwapCreator: SignerWithAddress;
	peter: SignerWithAddress;
	christopher: SignerWithAddress;
	khan: SignerWithAddress;
	phil: SignerWithAddress;
	aman: SignerWithAddress;
	marketing: SignerWithAddress;
	charity: SignerWithAddress;
	burn: SignerWithAddress;
	tokenContract: PBLOToken;
}

export interface Contracts {
	tokenContract: PBLOToken;
	wbnb: WBNB;
	pancakeRouter: PancakeRouter;
	pancakeFactory: PancakeFactory;
	lpPair: Contract;
}

export interface SignerDetail {
	tokenBalance: BigNumber;
	allowances: SignerDetailAllowances;
}

export type SignerDetailAllowances = {
	[P in keyof Signers]: BigNumber;
}

export type SignerDetails = {
	[P in keyof Signers]: SignerDetail;
};
