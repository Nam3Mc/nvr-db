import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsUUID, Min } from 'class-validator';
import { ApplicationMethod, MeasurementUnit } from 'src/generated/prisma/enums';

export class CreateServiceItemDto {

    @ApiProperty({
        example: 'd6c5f7d9-768b-4e19-a1f3-dff8d82c6f91',
        description: 'Inventory item ID used in the service',
    })
    @IsUUID()
    itemId: string;

    @ApiProperty({
        enum: MeasurementUnit,
        example: MeasurementUnit.LITER,
        description: 'Measurement unit used for the dosage',
    })
    @IsEnum(MeasurementUnit)
    measurementUnit: MeasurementUnit;

    @ApiProperty({
        example: 2.5,
        description: 'Dosage used in the service',
    })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    dosage: number;

    @ApiProperty({
        enum: ApplicationMethod,
        example: ApplicationMethod.SPRAYING,
        description: 'Application method used for this item',
    })
    @IsEnum(ApplicationMethod)
    applicationMethod: ApplicationMethod;
}