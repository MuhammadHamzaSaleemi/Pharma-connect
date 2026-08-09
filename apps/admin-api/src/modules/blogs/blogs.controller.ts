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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BlogsService } from './blogs.service';
import { blogImageMulterOptions } from './config/blog-image.multer-options';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogQueryDto } from './dto/blog-query.dto';
import { BlogResponseDto } from './dto/blog-response.dto';

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
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { ...BLOG_FORM_DATA_SCHEMA, required: ['title', 'content'] } })
  @UseInterceptors(FileInterceptor('featuredImage', blogImageMulterOptions))
  @ResponseMessage('Blog created successfully')
  create(@Body() dto: CreateBlogDto, @UploadedFile() featuredImage?: Express.Multer.File) {
    return this.blogsService.create(dto, featuredImage);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List blogs with search, filtering, sorting, and pagination' })
  @ApiPaginatedResponse(BlogResponseDto)
  @ResponseMessage('Blogs retrieved successfully')
  findAll(@Query() query: BlogQueryDto) {
    return this.blogsService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a blog by id' })
  @ResponseMessage('Blog retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Partially update a blog' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: BLOG_FORM_DATA_SCHEMA })
  @UseInterceptors(FileInterceptor('featuredImage', blogImageMulterOptions))
  @ResponseMessage('Blog updated successfully')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @UploadedFile() featuredImage?: Express.Multer.File,
  ) {
    return this.blogsService.update(id, dto, featuredImage);
  }

  @Delete(':id')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a blog' })
  @ResponseMessage('Blog deleted successfully')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
