import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUrl } from 'class-validator';
import { PhotoType } from 'src/generated/prisma/enums';

export class CreateServicePhotoDto {

    @ApiProperty({
        example: 'https://res.cloudinary.com/demo/image/upload/service-photo.jpg',
        description: 'Photo URL',
    })
    @IsUrl()
    url: string;

    @ApiProperty({
        enum: PhotoType,
        example: PhotoType.BEFORE,
        description: 'Photo type: BEFORE or AFTER',
    })
    @IsEnum(PhotoType)
    type: PhotoType;
}