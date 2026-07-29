import { Module } from '@nestjs/common';
import { EditorialController } from './editorial.controller';
import { EditorialService } from './editorial.service';
import { ScoringService } from './scoring.service';
import { DossierAiService } from './dossier-ai.service';

@Module({
  controllers: [EditorialController],
  providers: [EditorialService, ScoringService, DossierAiService],
  exports: [ScoringService, DossierAiService],
})
export class EditorialModule {}
