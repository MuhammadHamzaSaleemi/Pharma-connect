import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobQueryDto } from './dto/job-query.dto';
import { JobResponseDto } from './dto/job-response.dto';

@ApiTags('Jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new job posting' })
  @ResponseMessage('Job created successfully')
  create(@Body() dto: CreateJobDto) {
    return this.jobsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List jobs with search, filtering, sorting, and pagination' })
  @ApiPaginatedResponse(JobResponseDto)
  @ResponseMessage('Jobs retrieved successfully')
  findAll(@Query() query: JobQueryDto) {
    return this.jobsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a job by id' })
  @ResponseMessage('Job retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a job' })
  @ResponseMessage('Job updated successfully')
  update(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a job' })
  @ResponseMessage('Job deleted successfully')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
}
