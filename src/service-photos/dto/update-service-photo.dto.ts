import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUrl } from 'class-validator';
import { PhotoType } from 'src/generated/prisma/enums';

export class UpdateServicePhotoDto {
    @ApiPropertyOptional({
        example: 'https://res.cloudinary.com/demo/image/upload/updated-service-photo.jpg',
        description: 'Updated photo URL',
    })
    @IsOptional()
    @IsUrl()
    url?: string;

    @ApiPropertyOptional({
        enum: PhotoType,
        example: PhotoType.AFTER,
        description: 'Updated photo type',
    })
    @IsOptional()
    @IsEnum(PhotoType)
    type?: PhotoType;
}