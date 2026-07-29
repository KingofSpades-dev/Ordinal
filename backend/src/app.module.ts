import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { AgentsModule } from './agents/agents.module';
import { EditorialModule } from './editorial/editorial.module';
import { IngestService } from './agents/ingest.service';
import { VerifyProcessor } from './queue/verify.processor';
import { IngestProcessor } from './queue/ingest.processor';

@Module({
  imports: [
    PrismaModule,
    AgentsModule,
    EditorialModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      { name: 'verify' },
      { name: 'ingest' },
    ),
  ],
  providers: [
    VerifyProcessor,
    IngestProcessor,
    IngestService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
