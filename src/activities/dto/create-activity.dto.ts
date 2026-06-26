import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';
import { ActivityType, TankLocation } from 'src/generated/prisma/enums';

export class CreateActivityDto {

    @ApiProperty({
        enum: ActivityType,
        example: ActivityType.DISINFECTION,
        description: 'Type of activity performed during the service',
    })
    @IsEnum(ActivityType)
    type: ActivityType;

    @ApiPropertyOptional({
        example: 1000,
        description: 'Tank capacity in liters, mainly used for tank cleaning activities',
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    tankCapacityLiters?: number;

    @ApiPropertyOptional({
        example: 'Concrete tank with internal coating',
        description: 'Tank structure type, mainly used for tank cleaning activities',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    tankStructureType?: string;

    @ApiPropertyOptional({
        enum: TankLocation,
        example: TankLocation.ELEVATED,
        description: 'Tank location, mainly used for tank cleaning activities',
    })
    @IsOptional()
    @IsEnum(TankLocation)
    tankLocation?: TankLocation;

    @ApiPropertyOptional({
        example: 'Activity completed without issues. Area was inspected before and after the treatment.',
        description: 'Additional notes about the activity',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    notes?: string;
}