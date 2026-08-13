import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AgentsController } from './agents.controller';
import { BadgeController } from './badge.controller';
import { AgentsService } from './agents.service';
import { IngestService } from './ingest.service';
import { X402WashFilterService } from './x402-wash-filter.service';
import { Erc8004ResolverService } from './erc8004-resolver.service';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'verify' },
      { name: 'ingest' },
    ),
  ],
  controllers: [AgentsController, BadgeController],
  providers: [AgentsService, IngestService, X402WashFilterService, Erc8004ResolverService],
  exports: [IngestService, X402WashFilterService, Erc8004ResolverService],
})
export class AgentsModule {}
