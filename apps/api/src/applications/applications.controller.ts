import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { ApplicationsService } from './applications.service';
import type { CreateApplicationInput } from './applications.types';

@Controller('applications')
@UseGuards(AuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  list(@Req() request: AuthenticatedRequest) {
    return this.applicationsService.list(request.user.sub);
  }

  @Post()
  create(
    @Body() input: CreateApplicationInput,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.applicationsService.create(input, request.user.sub);
  }
}
