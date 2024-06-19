const { ethers } = require('hardhat');
const { expect } = require("chai");

const tokens = (n)=> {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
	let token

	beforeEach(async () => {
		const Token = await ethers.getContractFactory('Token')
		token = await Token.deploy()
	})

	it('Has the correct name', async () => {
		expect(await token.name()).to.equal("TonyToken")

	})
	it('Has the correct symbol', async () => {
		expect(await token.symbol()).to.equal("TTK")

	})
	it('Has the correct decimals', async () => {
		expect(await token.decimals()).to.equal("18")

	})
	it('Has the correct totalSupply', async () => {
		expect(await token.totalSupply()).to.equal(tokens('1000000'))

	})
})

