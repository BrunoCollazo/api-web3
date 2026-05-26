import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JsonRpcProvider, Wallet, parseEther, Contract } from 'ethers';

@Injectable()
export class BlockchainAdapterService {
  private provider: JsonRpcProvider;
  private wallet: Wallet;
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

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('La clave privada no está configurada en el .env');
    }
    this.wallet = new Wallet(privateKey, this.provider);
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

  async transferEth(toAddress: string, amountStr: string) {
    try {
      const amountInWei = parseEther(amountStr);

      const tx = await this.wallet.sendTransaction({
        to: toAddress,
        value: amountInWei,
      });
      
      console.log(`Transacción transmitida a la Mempool.`);
      console.log(`TxHash: ${tx.hash}`);
      console.log(`Esperando a que los validadores minen el bloque...`);

      const receipt = await tx.wait();
      
      if (!receipt) {
        throw new InternalServerErrorException('No se pudo obtener el recibo de la transacción de la blockchain');
      }
      
      console.log(`¡Bloque minado! Status final: ${receipt.status}`);

      return {
        txHash: tx.hash,
        status: receipt.status === 1 ? 'Exitosa' : 'Fallida',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
      
    } catch (error) {
      console.error('Error al realizar la transferencia:', error);
      throw new InternalServerErrorException('Fallo al procesar la transferencia en la blockchain');
    }
  }
}