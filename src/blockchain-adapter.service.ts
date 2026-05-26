import { Injectable } from '@nestjs/common';
import { JsonRpcProvider, Contract } from 'ethers';

@Injectable()
export class BlockchainAdapterService {
  private provider: JsonRpcProvider;
  private contract: Contract;

  constructor() {
    const rpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
    this.provider = new JsonRpcProvider(rpcUrl);

    const contractAddress = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
    const abi = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address account) view returns (uint256)"
    ];

    this.contract = new Contract(contractAddress, abi, this.provider);
  }

  async getTokenInfo() {
    const name = await this.contract.name();
    const symbol = await this.contract.symbol();
    const totalSupply = await this.contract.totalSupply();

    return {
      name,
      symbol,
      totalSupply: totalSupply.toString()
    };
  }
}