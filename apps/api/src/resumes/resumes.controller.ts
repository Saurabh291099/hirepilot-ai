import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('resumes')
export class ResumesController {
  @Post()
  @UseInterceptors(FileInterceptor('resume'))
  upload(
    @UploadedFile()
    file?: {
      originalname?: string;
      mimetype?: string;
      size?: number;
    },
  ) {
    if (!file)
      throw new BadRequestException('A PDF or DOCX resume is required.');
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.mimetype ?? ''))
      throw new BadRequestException('Only PDF and DOCX resumes are supported.');
    return {
      id: crypto.randomUUID(),
      filename: file.originalname,
      status: 'PROCESSING',
      message: 'Resume received. AI profile extraction is queued.',
    };
  }
}
