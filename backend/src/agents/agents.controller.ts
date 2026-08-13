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

  @Get(':slug/erc8004')
  async getErc8004Identity(@Param('slug') slug: string) {
    return this.agentsService.getErc8004Identity(slug);
  }

  @Post(':slug/x402-wash-filter')
  async runWashFilter(@Param('slug') slug: string, @Body('transactions') transactions: any[]) {
    return this.agentsService.runWashFilter(slug, transactions || []);
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
