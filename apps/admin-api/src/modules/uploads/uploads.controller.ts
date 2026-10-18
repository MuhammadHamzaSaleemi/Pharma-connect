import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { imageUploadOptions } from '../../common/uploads/image-upload.options';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Images referenced by URL from other records (scholarship images, avatars). Any signed-in
// dashboard user may upload; every account is a dashboard account.
@ApiTags('Uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly configService: ConfigService) {}

  @Post('image')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload an image and get back its public URL' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
      required: ['file'],
    },
  })
  @UseInterceptors(FileInterceptor('file', imageUploadOptions('images')))
  @ResponseMessage('Image uploaded successfully')
  uploadImage(@UploadedFile() file?: Express.Multer.File): { url: string } {
    if (!file) {
      throw new BadRequestException('An image file is required');
    }
    const appUrl = this.configService.get<string>('appUrl') ?? 'http://localhost:5000';
    return { url: `${appUrl}/uploads/images/${file.filename}` };
  }
}
