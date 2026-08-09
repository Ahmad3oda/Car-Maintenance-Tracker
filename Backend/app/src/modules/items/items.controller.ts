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
import { ItemSerializer } from './serializers/item.serializer';
import { PageDto } from '../../common/dtos/page.dto';
import { createMulterStorage } from '../../common/utils/multer.util';

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
      { storage: createMulterStorage('items') },
    ),
  )
  @SerializeOptions({ type: ItemSerializer })
  create(
    @Body() createItemDto: CreateItemDto,
    @UploadedFiles()
    files?: {
      photoPath?: Express.Multer.File[];
      photo?: Express.Multer.File[];
    },
  ): Promise<ItemSerializer> {
    const photo = files?.photoPath?.[0] || files?.photo?.[0];
    return this.itemsService.create(createItemDto, photo?.filename);
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
  findAll(@Query() query: QueryItemDto): Promise<PageDto<ItemSerializer>> {
    return this.itemsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an item by ID' })
  @ApiResponse({ status: 200, description: 'The item.', type: ItemSerializer })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @SerializeOptions({ type: ItemSerializer })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ItemSerializer> {
    return this.itemsService.findOne(id);
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
      { storage: createMulterStorage('items') },
    ),
  )
  @SerializeOptions({ type: ItemSerializer })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFiles()
    files?: {
      photoPath?: Express.Multer.File[];
      photo?: Express.Multer.File[];
    },
  ): Promise<ItemSerializer> {
    const photo = files?.photoPath?.[0] || files?.photo?.[0];
    return this.itemsService.update(id, updateItemDto, photo?.filename);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an item' })
  @ApiResponse({
    status: 204,
    description: 'The item has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.itemsService.remove(id);
  }
}
