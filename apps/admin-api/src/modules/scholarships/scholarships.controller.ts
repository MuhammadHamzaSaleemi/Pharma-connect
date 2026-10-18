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
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ScholarshipsService } from './scholarships.service';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { ScholarshipQueryDto } from './dto/scholarship-query.dto';
import { ScholarshipResponseDto } from './dto/scholarship-response.dto';
import { ScholarshipStatsDto } from './dto/scholarship-stats.dto';

@ApiTags('Scholarships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('scholarships')
export class ScholarshipsController {
  constructor(private readonly scholarshipsService: ScholarshipsService) {}

  @Post()
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN, UserRoleEnum.EXECUTIVE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new scholarship' })
  @ResponseMessage('Scholarship created successfully')
  create(@Body() dto: CreateScholarshipDto) {
    return this.scholarshipsService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'List active scholarships with search, filtering, sorting, and pagination',
  })
  @ApiPaginatedResponse(ScholarshipResponseDto)
  @ResponseMessage('Scholarships retrieved successfully')
  findAll(@Query() query: ScholarshipQueryDto) {
    return this.scholarshipsService.findAll(query);
  }

  // Declared before `:id` so "manage" isn't captured as a scholarship id.
  @Get('manage')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN, UserRoleEnum.EXECUTIVE)
  @ApiOperation({ summary: 'Dashboard scholarship list, including drafts and expired ones' })
  @ApiPaginatedResponse(ScholarshipResponseDto)
  @ResponseMessage('Scholarships retrieved successfully')
  findManageable(@Query() query: ScholarshipQueryDto) {
    return this.scholarshipsService.findAll(query, true);
  }

  // Declared before `:id` so "stats" isn't captured as a scholarship id.
  @Get('stats')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN, UserRoleEnum.EXECUTIVE)
  @ApiOperation({ summary: 'Dashboard scholarship counters' })
  @ApiOkResponse({ type: ScholarshipStatsDto })
  @ResponseMessage('Scholarship stats retrieved successfully')
  getStats(): Promise<ScholarshipStatsDto> {
    return this.scholarshipsService.getStats();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get an active scholarship by id' })
  @ResponseMessage('Scholarship retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.scholarshipsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN, UserRoleEnum.EXECUTIVE)
  @ApiOperation({ summary: 'Partially update a scholarship' })
  @ResponseMessage('Scholarship updated successfully')
  update(@Param('id') id: string, @Body() dto: UpdateScholarshipDto) {
    return this.scholarshipsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN, UserRoleEnum.EXECUTIVE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a scholarship' })
  @ResponseMessage('Scholarship deleted successfully')
  remove(@Param('id') id: string) {
    return this.scholarshipsService.remove(id);
  }
}
