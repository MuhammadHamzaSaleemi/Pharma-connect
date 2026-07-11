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
import { ScholarshipsService } from './scholarships.service';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { ScholarshipQueryDto } from './dto/scholarship-query.dto';
import { ScholarshipResponseDto } from './dto/scholarship-response.dto';

@ApiTags('Scholarships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scholarships')
export class ScholarshipsController {
  constructor(private readonly scholarshipsService: ScholarshipsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new scholarship' })
  @ResponseMessage('Scholarship created successfully')
  create(@Body() dto: CreateScholarshipDto) {
    return this.scholarshipsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List scholarships with search, filtering, sorting, and pagination' })
  @ApiPaginatedResponse(ScholarshipResponseDto)
  @ResponseMessage('Scholarships retrieved successfully')
  findAll(@Query() query: ScholarshipQueryDto) {
    return this.scholarshipsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a scholarship by id' })
  @ResponseMessage('Scholarship retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.scholarshipsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a scholarship' })
  @ResponseMessage('Scholarship updated successfully')
  update(@Param('id') id: string, @Body() dto: UpdateScholarshipDto) {
    return this.scholarshipsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a scholarship' })
  @ResponseMessage('Scholarship deleted successfully')
  remove(@Param('id') id: string) {
    return this.scholarshipsService.remove(id);
  }
}
