import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { ApplicationMethod, MeasurementUnit } from 'src/generated/prisma/enums';

export class UpdateServiceItemDto {
    @ApiPropertyOptional({
        example: 'd6c5f7d9-768b-4e19-a1f3-dff8d82c6f91',
        description: 'Updated inventory item ID',
    })
    @IsOptional()
    @IsUUID()
    itemId?: string;

    @ApiPropertyOptional({
        enum: MeasurementUnit,
        example: MeasurementUnit.LITER,
        description: 'Updated measurement unit',
    })
    @IsOptional()
    @IsEnum(MeasurementUnit)
    measurementUnit?: MeasurementUnit;

    @ApiPropertyOptional({
        example: 3.25,
        description: 'Updated dosage used in the service',
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    dosage?: number;

    @ApiPropertyOptional({
        enum: ApplicationMethod,
        example: ApplicationMethod.FOGGING,
        description: 'Updated application method',
    })
    @IsOptional()
    @IsEnum(ApplicationMethod)
    applicationMethod?: ApplicationMethod;
}