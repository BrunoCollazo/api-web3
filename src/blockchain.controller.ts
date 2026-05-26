import { Controller, Get, Post, Body } from '@nestjs/common';
import { BlockchainAdapterService } from './blockchain-adapter.service';

@Controller('api')
export class BlockchainController {
  
  constructor(private readonly blockchainService: BlockchainAdapterService) {}

  @Get('token-info')
  async getTokenInfo() {
    return await this.blockchainService.getTokenInfo();
  }

  @Post('transfer')
  async transferEth(@Body('to') toAddress: string) {
    const amountToSend = '0.001'; 
    
    return await this.blockchainService.transferEth(toAddress, amountToSend);
  }
}