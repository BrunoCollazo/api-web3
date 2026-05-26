import { Module } from '@nestjs/common';
import { BlockchainController } from './blockchain.controller';
import { BlockchainAdapterService } from './blockchain-adapter.service';

@Module({
  controllers: [BlockchainController],
  providers: [BlockchainAdapterService],
})
export class BlockchainModule {}