import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { PhotoType } from 'src/generated/prisma/enums';

export class UploadServicePhotoDto {
    @ApiProperty({
        example: 'b8f21b0c-91ec-4f17-b92f-0cb3b3f01311',
        description: 'Service ID where the uploaded photo belongs',
    })
    @IsUUID()
    serviceId: string;

    @ApiProperty({
        enum: PhotoType,
        example: PhotoType.BEFORE,
        description: 'Photo type: BEFORE or AFTER',
    })
    @IsEnum(PhotoType)
    type: PhotoType;
}