import { Body, Controller, Post } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
    constructor(
        private readonly servicesService: ServicesService,
    ) {}

    @Post()
    create(@Body() createServiceDto: CreateServiceDto) {
        return this.servicesService.create(createServiceDto);

    }
}
