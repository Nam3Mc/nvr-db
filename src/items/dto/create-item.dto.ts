import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { MeasurementUnit } from '../../generated/prisma/enums';

export class CreateItemDto {
    @ApiProperty({
        example: 'Insecticide Pro 500',
        description: 'Inventory item name.',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'LOT-2026-001',
        description: 'Product lot number.',
    })
    @IsString()
    @IsNotEmpty()
    lot: string;

    @ApiProperty({
        example: 'Bayer',
        description: 'Product provider or supplier.',
    })
    @IsString()
    @IsNotEmpty()
    provider: string;

    @ApiPropertyOptional({
        example: 'SER-998877',
        description: 'Product serial number if available.',
    })
    @IsOptional()
    @IsString()
    serial?: string;

    @ApiPropertyOptional({
        example: 'REG-INVIMA-2026-001',
        description: 'Product registration number.',
    })
    @IsOptional()
    @IsString()
    registrationNumber?: string;

    @ApiPropertyOptional({
        example: '2027-12-31',
        description: 'Product expiration date.',
    })
    @IsOptional()
    @IsDateString()
    expirationDate?: string;

    @ApiProperty({
        enum: MeasurementUnit,
        example: MeasurementUnit.UNIT,
        description: 'Measurement unit used for this item.',
    })
    @IsEnum(MeasurementUnit)
    measurementUnit: MeasurementUnit;

    @ApiProperty({
        example: 25,
        description: 'Available item quantity.',
    })
    @IsNumber()
    @Min(0)
    quantity: number;

    @ApiProperty({
        example: 45000,
        description: 'Item price.',
    })
    @IsNumber()
    @Min(0)
    price: number;
}