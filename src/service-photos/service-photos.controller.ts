import { Controller, HttpCode, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, ParseUUIDPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ServicePhotosService } from './service-photos.service';
import { ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('ServicePhotos')
@Controller('service-photos')
export class ServicePhotosController {
    constructor(
        private readonly servicePhotosService: ServicePhotosService,
    ) {}

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                photos: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    }
                }
            }
        }
    })
    @UseInterceptors(FilesInterceptor('photos', 10))
    uploadBrforePhotos(
        @Param('id', ParseUUIDPipe) id: string,
        @UploadedFile() files: Express.Multer.File[]) {
        return this.servicePhotosService.uploadBeforePhotos(id, files);
    }

}
