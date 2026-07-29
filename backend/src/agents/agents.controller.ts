import { Controller, Get, Post, Body } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { SubmitAgentDto } from './dto/submit-agent.dto';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  async findAll() {
    return this.agentsService.findAll();
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
