import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { PhotoType } from 'src/generated/prisma/enums';

export class UploadServicePhotoDto {

    @ApiProperty({
        enum: PhotoType,
        example: PhotoType.BEFORE,
        description: 'Photo type: BEFORE or AFTER',
    })
    @IsEnum(PhotoType)
    type: PhotoType;
}