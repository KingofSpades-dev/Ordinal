import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { SubmitAgentDto } from './dto/submit-agent.dto';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  async findAll(@Query('walletAddress') walletAddress?: string) {
    return this.agentsService.findAll(walletAddress);
  }

  @Get('public-rankings')
  async getPublicRankings() {
    return this.agentsService.getPublicRankings();
  }

  @Get(':slug/identity')
  async getAgentIdentity(@Param('slug') slug: string) {
    return this.agentsService.getAgentIdentity(slug);
  }

  @Post('submit')
  async submit(@Body() dto: SubmitAgentDto) {
    return this.agentsService.submitAgent(dto);
  }

  @Post('rating')
  async submitRating(@Body() dto: CreateRatingDto) {
    return this.agentsService.submitRating(dto);
  }
}
