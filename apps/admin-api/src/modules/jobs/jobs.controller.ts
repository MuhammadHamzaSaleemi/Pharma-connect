import {
  BadRequestException,
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobQueryDto } from './dto/job-query.dto';
import { JobResponseDto } from './dto/job-response.dto';
import { BulkUploadResultDto } from './dto/bulk-upload-result.dto';
import { JobStatsDto } from './dto/job-stats.dto';

const EXCEL_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

@ApiTags('Jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new job posting' })
  @ResponseMessage('Job created successfully')
  create(@CurrentUser() actor: AuthenticatedUser, @Body() dto: CreateJobDto) {
    return this.jobsService.create(actor, dto);
  }

  @Post('bulk-upload')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Bulk create jobs from an Excel (.xlsx) file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
      required: ['file'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        if (!EXCEL_MIME_TYPES.includes(file.mimetype)) {
          callback(
            new BadRequestException('Unsupported file type. Upload an Excel (.xlsx) file.'),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  @ResponseMessage('Jobs bulk upload processed')
  bulkUpload(
    @CurrentUser() actor: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BulkUploadResultDto> {
    if (!file) {
      throw new BadRequestException('An Excel file is required');
    }
    return this.jobsService.bulkCreate(actor, file.buffer);
  }

  @Get('manage/stats')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Dashboard job counters, scoped like the dashboard job list' })
  @ApiOkResponse({ type: JobStatsDto })
  @ResponseMessage('Job stats retrieved successfully')
  getStats(@CurrentUser() actor: AuthenticatedUser): Promise<JobStatsDto> {
    return this.jobsService.getStats(actor);
  }

  // Declared before `:id` so "manage" isn't captured as a job id.
  @Get('manage')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @ApiOperation({
    summary: 'Dashboard job list: every job, drafts and closed ones included',
  })
  @ApiPaginatedResponse(JobResponseDto)
  @ResponseMessage('Jobs retrieved successfully')
  findManageable(@CurrentUser() actor: AuthenticatedUser, @Query() query: JobQueryDto) {
    return this.jobsService.findAll(query, actor);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List jobs with search, filtering, sorting, and pagination' })
  @ApiPaginatedResponse(JobResponseDto)
  @ResponseMessage('Jobs retrieved successfully')
  findAll(@Query() query: JobQueryDto) {
    return this.jobsService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a job by id' })
  @ResponseMessage('Job retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Partially update a job' })
  @ResponseMessage('Job updated successfully')
  update(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobsService.update(actor, id, dto);
  }

  @Delete(':id')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a job' })
  @ResponseMessage('Job deleted successfully')
  remove(@CurrentUser() actor: AuthenticatedUser, @Param('id') id: string) {
    return this.jobsService.remove(actor, id);
  }
}
