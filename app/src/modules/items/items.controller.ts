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
  SerializeOptions,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryItemDto } from './dto/query-item.dto';
import { ItemSerializer } from './serializers/item.serializer';
import { GetItemsSerializer } from './serializers/get-items.serializer';
import { SingleItemSerializer } from './serializers/single-item.serializer';
import { MessageSerializer } from 'src/serializers/message.serializer';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${extname(file.originalname)}`);
  },
});

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @SerializeOptions({ type: ItemSerializer })
  @UseInterceptors(FileInterceptor('photo', { storage }))
  create(
    @Body() dto: CreateItemDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.itemsService.create(dto, photo?.filename);
  }

  @Get()
  @SerializeOptions({ type: GetItemsSerializer })
  findAll(@Query() query: QueryItemDto) {
    return this.itemsService.findAll(query);
  }

  @Get(':id')
  @SerializeOptions({ type: SingleItemSerializer })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  @SerializeOptions({ type: SingleItemSerializer })
  @UseInterceptors(FileInterceptor('photo', { storage }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.itemsService.update(id, dto, photo?.filename);
  }

  @Delete(':id')
  @SerializeOptions({ type: MessageSerializer })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.remove(id);
  }
}
