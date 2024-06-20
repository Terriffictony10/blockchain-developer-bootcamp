const { ethers } = require('hardhat');
const { expect } = require("chai");

const tokens = (n)=> {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
	let token
	let accounts
	let deployer

	beforeEach(async () => {
		const Token = await ethers.getContractFactory('Token')
		token = await Token.deploy("TonyToken", "TTK", "1000000")
		
		accounts = await ethers.getSigners();
		deployer = accounts[0]		
	})

	describe("Deployment", () => {
		const name = "TonyToken"
		const symbol = "TTK"
		const decimals = "18"
		const totalSupply = tokens("1000000")

	it('Has the correct name', async () => {
	expect(await token.name()).to.equal(name)

	})
	it('Has the correct symbol', async () => {
		expect(await token.symbol()).to.equal(symbol)

	})
	it('Has the correct decimals', async () => {
		expect(await token.decimals()).to.equal(decimals)

	})
	it('Has the correct totalSupply', async () => {
		expect(await token.totalSupply()).to.equal(totalSupply)

	})
	it('assigns total supply to deployer', async () => {
		expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)

	})
	})
})

