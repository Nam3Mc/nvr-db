import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateServiceDto } from "./create-service.dto";
import { CreateActivityDto } from "src/activities/dto/create-activity.dto";
import { IsArray, IsDateString, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateServiceItemDto } from "src/service-items/dto/create-service-item.dto";
import { CreateServicePestDto } from "src/service-pests/dto/create-service-pest.dto";
import { CreateServicePhotoDto } from "src/service-photos/dto/create-service-photo.dto";

export class CompleteServiceDto extends PartialType(CreateServiceDto) {

    @ApiPropertyOptional({ type: [CreateActivityDto], description: 'List of activities executed' })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateActivityDto)
    activies?: CreateActivityDto[];

    @ApiPropertyOptional({ type: [CreateServiceItemDto], description: 'Products/Items used in the service' })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateServiceItemDto)
    items?: CreateServiceItemDto[];

    @ApiPropertyOptional({ type: [CreateServicePestDto], description: 'Pests detected and targets' })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateServicePestDto)
    pests?: CreateServicePestDto[];

    @ApiPropertyOptional({ type: [CreateServicePhotoDto], description: 'Evidential photos (Before/After)' })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateServicePhotoDto)
    photos?: CreateServicePhotoDto[];

    @ApiProperty({ example: '2026-06-28T14:15:00.000Z' })
    @IsDateString()
    startedAt: string;

    @ApiProperty({ example: '2026-06-28T16:30:00.000Z' })
    @IsDateString()
    completedAt: string;

}