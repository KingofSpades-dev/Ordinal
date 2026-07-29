import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AgentsController } from './agents.controller';
import { BadgeController } from './badge.controller';
import { AgentsService } from './agents.service';
import { IngestService } from './ingest.service';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'verify' },
      { name: 'ingest' },
    ),
  ],
  controllers: [AgentsController, BadgeController],
  providers: [AgentsService, IngestService],
  exports: [IngestService],
})
export class AgentsModule {}
