import {
  Controller,
  FileTypeValidator,
  HttpStatus,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProcessService } from './process.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/process')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async processData(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'csv' })],
      }),
    )
    file: Express.Multer.File,
    @Res() response: Response,
  ) {
    const result = this.processService.process({
      fileName: file.originalname.replace('csv', ''),
      bufferedFileContent: file.buffer,
    });

    if (!result.isOk) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: result.message,
      });
    }

    return response.status(HttpStatus.OK).json(result);
  }
}
