import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiExtraModels, getSchemaPath, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { QueryItemDto } from './dtos/query-item.dto';
import { ItemSerializer } from './serializers/item.serializer';
import { PageDto } from '../../common/dtos/page.dto';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${extname(file.originalname)}`);
  },
});

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'The item has been successfully created.', type: ItemSerializer })
  @UseInterceptors(FileInterceptor('photo', { storage }))
  create(
    @Body() createItemDto: CreateItemDto,
    @UploadedFile() photo?: Express.Multer.File,
  ): Promise<ItemSerializer> {
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
  findAll(@Query() query: QueryItemDto): Promise<PageDto<ItemSerializer>> {
    return this.itemsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an item by ID' })
  @ApiResponse({ status: 200, description: 'The item.', type: ItemSerializer })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ItemSerializer> {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an item' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'The item has been successfully updated.', type: ItemSerializer })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @UseInterceptors(FileInterceptor('photo', { storage }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFile() photo?: Express.Multer.File,
  ): Promise<ItemSerializer> {
    return this.itemsService.update(id, updateItemDto, photo?.filename);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an item' })
  @ApiResponse({ status: 204, description: 'The item has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.itemsService.remove(id);
  }
}
