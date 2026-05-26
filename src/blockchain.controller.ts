import { Controller, Get } from '@nestjs/common';
import { BlockchainAdapterService } from './blockchain-adapter.service';

@Controller('api')
export class BlockchainController {
  
  constructor(private readonly blockchainService: BlockchainAdapterService) {}

  @Get('token-info')
  async getTokenInfo() {
    return await this.blockchainService.getTokenInfo();
  }
}