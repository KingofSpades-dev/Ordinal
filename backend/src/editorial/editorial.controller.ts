import { Controller, Get, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { EditorialService } from './editorial.service';
import { DossierAiService } from './dossier-ai.service';
import { CreateDossierDto, AwardKeyDto, RevokeKeyDto } from './dto/editorial.dto';

@Controller('editorial')
export class EditorialController {
  constructor(
    private readonly editorialService: EditorialService,
    private readonly dossierAiService: DossierAiService,
  ) {}

  @Get('stats')
  async getStats() {
    return this.editorialService.getStats();
  }

  private getEditorId(headers: Record<string, string>): string {
    const editorId = headers['x-editor-id'] || 'editor-default-id';
    return editorId;
  }

  @Post('dossier')
  async saveDossier(@Headers() headers: any, @Body() dto: CreateDossierDto) {
    const editorId = this.getEditorId(headers);
    return this.editorialService.createOrUpdateDossier(editorId, dto);
  }

  @Post('dossier/generate-ai')
  async generateAi(@Body('agentId') agentId: string) {
    if (!agentId) throw new BadRequestException('agentId is required');
    const content = await this.dossierAiService.generateAiDossier(agentId);
    return { content };
  }

  @Post('publish')
  async publish(@Headers() headers: any, @Body('agentId') agentId: string) {
    if (!agentId) throw new BadRequestException('agentId is required');
    const editorId = this.getEditorId(headers);
    return this.editorialService.publishDossier(editorId, agentId);
  }

  @Post('keys/award')
  async award(@Headers() headers: any, @Body() dto: AwardKeyDto) {
    const editorId = this.getEditorId(headers);
    return this.editorialService.awardKeys(editorId, dto);
  }

  @Post('keys/revoke')
  async revoke(@Headers() headers: any, @Body() dto: RevokeKeyDto) {
    const editorId = this.getEditorId(headers);
    return this.editorialService.revokeKeys(editorId, dto);
  }
}
