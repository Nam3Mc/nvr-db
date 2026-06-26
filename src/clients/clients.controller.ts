import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../generated/prisma/enums';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientsService } from './clients.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RoleGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(UserRole.ADMIN)
@Controller('clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Post()
    @ApiOperation({
        summary: 'Create a new client',
        description: 'Creates a new client. Only ADMIN users can access this route.',
    })
    @ApiCreatedResponse({
        description: 'Client created successfully.',
    })
    @ApiConflictResponse({
        description: 'A client with this email or tax ID already exists.',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing, invalid, or expired token.',
    })
    @ApiForbiddenResponse({
        description: 'The authenticated user does not have ADMIN permissions.',
    })
    create(@Body() createClientDto: CreateClientDto) {
        return this.clientsService.create(createClientDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all clients',
        description:
            'Returns all clients, including active and inactive clients. Only ADMIN users can access this ro  ute.',
    })
    @ApiOkResponse({
        description: 'Clients returned successfully.',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing, invalid, or expired token.',
    })
    @ApiForbiddenResponse({
        description: 'The authenticated user does not have ADMIN permissions.',
    })
    findAll() {
        return this.clientsService.findAll();
    }

    @Get('active')
    @ApiOperation({
        summary: 'Get active clients',
        description:
            'Returns only active clients. This is useful for forms, selects, and service scheduling.',
    })
    @ApiOkResponse({
        description: 'Active clients returned successfully.',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing, invalid, or expired token.',
    })
    @ApiForbiddenResponse({
        description: 'The authenticated user does not have ADMIN permissions.',
    })
    findActive() {
        return this.clientsService.findActive();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get one client by id',
        description: 'Returns a single client by UUID.',
    })
    @ApiParam({
        name: 'id',
        description: 'Client UUID.',
        example: '0d6b8b5c-02a3-4e0f-b0c9-2f8d99f8d7a1',
    })
    @ApiOkResponse({
        description: 'Client found successfully.',
    })
    @ApiNotFoundResponse({
        description: 'Client not found.',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing, invalid, or expired token.',
    })
    @ApiForbiddenResponse({
        description: 'The authenticated user does not have ADMIN permissions.',
    })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.clientsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update one client by id',
        description: 'Updates client data by UUID.',
    })
    @ApiParam({
        name: 'id',
        description: 'Client UUID.',
        example: '0d6b8b5c-02a3-4e0f-b0c9-2f8d99f8d7a1',
    })
    @ApiOkResponse({
        description: 'Client updated successfully.',
    })
    @ApiNotFoundResponse({
        description: 'Client not found.',
    })
    @ApiConflictResponse({
        description: 'A client with this email or tax ID already exists.',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing, invalid, or expired token.',
    })
    @ApiForbiddenResponse({
        description: 'The authenticated user does not have ADMIN permissions.',
    })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateClientDto: UpdateClientDto,
        ) {
        return this.clientsService.update(id, updateClientDto);
    }

    @Patch(':id/deactivate')
    @ApiOperation({
        summary: 'Deactivate one client by id',
        description:
            'Soft-deactivates a client without deleting historical services, certificates, or reports.',
    })
    @ApiParam({
        name: 'id',
        description: 'Client UUID.',
        example: '0d6b8b5c-02a3-4e0f-b0c9-2f8d99f8d7a1',
    })
    @ApiOkResponse({
        description: 'Client deactivated successfully.',
    })
    @ApiNotFoundResponse({
        description: 'Client not found.',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing, invalid, or expired token.',
    })
    @ApiForbiddenResponse({
        description: 'The authenticated user does not have ADMIN permissions.',
    })
    deactivate(@Param('id', ParseUUIDPipe) id: string) {
        return this.clientsService.deactivate(id);
    }

    @Patch(':id/activate')
    @ApiOperation({
        summary: 'Activate one client by id',
        description: 'Reactivates a previously deactivated client.',
    })
    @ApiParam({
        name: 'id',
        description: 'Client UUID.',
        example: '0d6b8b5c-02a3-4e0f-b0c9-2f8d99f8d7a1',
    })
    @ApiOkResponse({
        description: 'Client activated successfully.',
    })
    @ApiNotFoundResponse({
        description: 'Client not found.',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing, invalid, or expired token.',
    })
    @ApiForbiddenResponse({
        description: 'The authenticated user does not have ADMIN permissions.',
    })
    activate(@Param('id', ParseUUIDPipe) id: string) {
        return this.clientsService.activate(id);
    }
}