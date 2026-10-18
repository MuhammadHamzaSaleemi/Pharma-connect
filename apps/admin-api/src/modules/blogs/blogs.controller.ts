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
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BlogsService } from './blogs.service';
import { imageUploadOptions } from '../../common/uploads/image-upload.options';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogQueryDto } from './dto/blog-query.dto';
import { BlogResponseDto } from './dto/blog-response.dto';
import { BlogStatsDto } from './dto/blog-stats.dto';

const BLOG_FORM_DATA_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
    excerpt: { type: 'string' },
    featuredImage: { type: 'string', format: 'binary' },
    category: { type: 'string' },
    tags: { type: 'string', example: 'pharmacovigilance,compliance' },
    status: { type: 'string', enum: ['DRAFT', 'PUBLISHED'] },
    isFeatured: { type: 'boolean' },
    seoTitle: { type: 'string' },
    seoDescription: { type: 'string' },
    publishedAt: { type: 'string', format: 'date' },
  },
};

@ApiTags('Blogs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN, UserRoleEnum.EXECUTIVE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { ...BLOG_FORM_DATA_SCHEMA, required: ['title', 'content'] } })
  @UseInterceptors(FileInterceptor('featuredImage', imageUploadOptions('blogs')))
  @ResponseMessage('Blog created successfully')
  create(@Body() dto: CreateBlogDto, @UploadedFile() featuredImage?: Express.Multer.File) {
    return this.blogsService.create(dto, featuredImage);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List published blogs with search, filtering, sorting, and pagination' })
  @ApiPaginatedResponse(BlogResponseDto)
  @ResponseMessage('Blogs retrieved successfully')
  findAll(@Query() query: BlogQueryDto) {
    return this.blogsService.findAll(query);
  }

  // Declared before `:id` so "manage" isn't captured as a blog id.
  @Get('manage')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN, UserRoleEnum.EXECUTIVE)
  @ApiOperation({ summary: 'Dashboard blog list, including drafts' })
  @ApiPaginatedResponse(BlogResponseDto)
  @ResponseMessage('Blogs retrieved successfully')
  findManageable(@Query() query: BlogQueryDto) {
    return this.blogsService.findAll(query, true);
  }

  // Declared before `:id` so "stats" isn't captured as a blog id.
  @Get('stats')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN, UserRoleEnum.EXECUTIVE)
  @ApiOperation({ summary: 'Dashboard blog counters' })
  @ApiOkResponse({ type: BlogStatsDto })
  @ResponseMessage('Blog stats retrieved successfully')
  getStats(): Promise<BlogStatsDto> {
    return this.blogsService.getStats();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a published blog by id or slug' })
  @ResponseMessage('Blog retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN, UserRoleEnum.EXECUTIVE)
  @ApiOperation({ summary: 'Partially update a blog' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: BLOG_FORM_DATA_SCHEMA })
  @UseInterceptors(FileInterceptor('featuredImage', imageUploadOptions('blogs')))
  @ResponseMessage('Blog updated successfully')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @UploadedFile() featuredImage?: Express.Multer.File,
  ) {
    return this.blogsService.update(id, dto, featuredImage);
  }

  @Delete(':id')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN, UserRoleEnum.EXECUTIVE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a blog' })
  @ResponseMessage('Blog deleted successfully')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
