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
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsService } from './items.service';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UpdateItemDto } from './dto/update-item.dto';

@ApiTags('Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(UserRole.ADMIN)
@Controller('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @Post()
    @ApiOperation({
        summary: 'Create a new item',
        description: 'Creates a new inventory item. Only ADMIN users can access this route.',
    })
    @ApiCreatedResponse({
        description: 'Item created successfully.',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing, invalid, or expired token.',
    })
    @ApiForbiddenResponse({
        description: 'The authenticated user does not have ADMIN permissions.',
    })
    create(@Body() createItemDto: CreateItemDto) {
        return this.itemsService.create(createItemDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all items',
        description: 'Returns all inventory items, including active and inactive items.',
    })
    @ApiOkResponse({
        description: 'Items returned successfully.',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing, invalid, or expired token.',
    })
    @ApiForbiddenResponse({
        description: 'The authenticated user does not have ADMIN permissions.',
    })
    findAll() {
        return this.itemsService.findAll();
    }

    @Get('active')
    @ApiOperation({
        summary: 'Get active items',
        description: 'Returns only active inventory items.',
    })
    @ApiOkResponse({
        description: 'Active items returned successfully.',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing, invalid, or expired token.',
    })
    @ApiForbiddenResponse({
        description: 'The authenticated user does not have ADMIN permissions.',
    })
    findActive() {
        return this.itemsService.findActive();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get one item by id',
        description: 'Returns a single inventory item by UUID.',
    })
    @ApiParam({
        name: 'id',
        description: 'Item UUID.',
        example: '0d6b8b5c-02a3-4e0f-b0c9-2f8d99f8d7a1',
    })
    @ApiOkResponse({
        description: 'Item found successfully.',
    })
    @ApiNotFoundResponse({
        description: 'Item not found.',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing, invalid, or expired token.',
    })
    @ApiForbiddenResponse({
        description: 'The authenticated user does not have ADMIN permissions.',
    })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.itemsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update one item by id',
        description: 'Updates an inventory item by UUID.',
    })
    @ApiParam({
        name: 'id',
        description: 'Item UUID.',
        example: '0d6b8b5c-02a3-4e0f-b0c9-2f8d99f8d7a1',
    })
    @ApiOkResponse({
        description: 'Item updated successfully.',
    })
    @ApiNotFoundResponse({
        description: 'Item not found.',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing, invalid, or expired token.',
    })
    @ApiForbiddenResponse({
        description: 'The authenticated user does not have ADMIN permissions.',
    })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateItemDto: UpdateItemDto,
    ) {
        return this.itemsService.update(id, updateItemDto);
    }

    @Patch(':id/deactivate')
    @ApiOperation({
        summary: 'Deactivate one item by id',
        description: 'Soft-deactivates an inventory item without deleting historical service usage.',
    })
    @ApiParam({
        name: 'id',
        description: 'Item UUID.',
        example: '0d6b8b5c-02a3-4e0f-b0c9-2f8d99f8d7a1',
    })
    @ApiOkResponse({
        description: 'Item deactivated successfully.',
    })
    @ApiNotFoundResponse({
        description: 'Item not found.',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing, invalid, or expired token.',
    })
    @ApiForbiddenResponse({
        description: 'The authenticated user does not have ADMIN permissions.',
    })
    deactivate(@Param('id', ParseUUIDPipe) id: string) {
        return this.itemsService.deactivate(id);
    }

    @Patch(':id/activate')
    @ApiOperation({
        summary: 'Activate one item by id',
        description: 'Reactivates a previously deactivated inventory item.',
    })
    @ApiParam({
        name: 'id',
        description: 'Item UUID.',
        example: '0d6b8b5c-02a3-4e0f-b0c9-2f8d99f8d7a1',
    })
    @ApiOkResponse({
        description: 'Item activated successfully.',
    })
    @ApiNotFoundResponse({
        description: 'Item not found.',
    })
    @ApiUnauthorizedResponse({
        description: 'Missing, invalid, or expired token.',
    })
    @ApiForbiddenResponse({
        description: 'The authenticated user does not have ADMIN permissions.',
    })
    activate(@Param('id', ParseUUIDPipe) id: string) {
        return this.itemsService.activate(id);
    }
}