import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './repositories/blogs.repository';
import { BlogTransformer } from './transformers/blog.transformer';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository, BlogTransformer],
})
export class BlogsModule {}
