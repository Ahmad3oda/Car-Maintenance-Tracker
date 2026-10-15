import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFiles,
  UseInterceptors,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
  getSchemaPath,
  ApiConsumes,
} from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { QueryItemDto } from './dtos/query-item.dto';
import { QueryUpcomingItemDto } from './dtos/query-upcoming-item.dto';
import { ItemSerializer } from './serializers/item.serializer';
import { UpcomingItemSerializer } from './serializers/upcoming-item.serializer';
import { PageDto } from '../../common/dtos/page.dto';
import { createImageUploadOptions } from '../../common/utils/multer.util';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth-user';

@ApiBearerAuth()
@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created.',
    type: ItemSerializer,
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'photoPath', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
      ],
      createImageUploadOptions('items'),
    ),
  )
  @SerializeOptions({ type: ItemSerializer })
  create(
    @CurrentUser() user: AuthUser,
    @Body() createItemDto: CreateItemDto,
    @UploadedFiles()
    files?: {
      photoPath?: Express.Multer.File[];
      photo?: Express.Multer.File[];
    },
  ): Promise<ItemSerializer> {
    const photo = files?.photoPath?.[0] || files?.photo?.[0];
    return this.itemsService.create(user.id, createItemDto, photo?.filename);
  }

  @Get()
  @ApiOperation({ summary: 'Get all items with pagination' })
  @ApiExtraModels(PageDto, ItemSerializer)
  @ApiResponse({
    status: 200,
    description: 'List of items.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PageDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ItemSerializer) },
            },
          },
        },
      ],
    },
  })
  @SerializeOptions({ type: PageDto<ItemSerializer> })
  findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: QueryItemDto,
  ): Promise<PageDto<ItemSerializer>> {
    return this.itemsService.findAll(user.id, query);
  }

  @Get('upcoming')
  @ApiOperation({
    summary: 'Get maintenance items by urgency status',
    description:
      'Statuses: OVERDUE (past due km or date), DUE_SOON (within 1,000 km or 30 days), UPCOMING (future within 3,000 km or 90 days), HEALTHY (schedule with nothing approaching).',
  })
  @ApiExtraModels(PageDto, UpcomingItemSerializer)
  @ApiResponse({
    status: 200,
    description: 'List of upcoming and overdue maintenance items.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PageDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(UpcomingItemSerializer) },
            },
          },
        },
      ],
    },
  })
  @SerializeOptions({ type: PageDto<UpcomingItemSerializer> })
  getUpcoming(
    @CurrentUser() user: AuthUser,
    @Query() query: QueryUpcomingItemDto,
  ): Promise<PageDto<UpcomingItemSerializer>> {
    return this.itemsService.getUpcoming(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an item by ID' })
  @ApiResponse({ status: 200, description: 'The item.', type: ItemSerializer })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @SerializeOptions({ type: ItemSerializer })
  findOne(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ItemSerializer> {
    return this.itemsService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an item' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully updated.',
    type: ItemSerializer,
  })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'photoPath', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
      ],
      createImageUploadOptions('items'),
    ),
  )
  @SerializeOptions({ type: ItemSerializer })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFiles()
    files?: {
      photoPath?: Express.Multer.File[];
      photo?: Express.Multer.File[];
    },
  ): Promise<ItemSerializer> {
    const photo = files?.photoPath?.[0] || files?.photo?.[0];
    return this.itemsService.update(
      user.id,
      id,
      updateItemDto,
      photo?.filename,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an item' })
  @ApiResponse({
    status: 204,
    description: 'The item has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.itemsService.remove(user.id, id);
  }
}
