import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dtos/create-car.dto';
import { UpdateCarDto } from './dtos/update-car.dto';
import { QueryCarDto } from './dtos/query-car.dto';
import { CarSerializer } from './serializers/car.serializer';
import { PageDto } from '../../common/dtos/page.dto';

@ApiTags('Cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new car' })
  @ApiResponse({ status: 201, description: 'The car has been successfully created.', type: CarSerializer })
  create(@Body() createCarDto: CreateCarDto): Promise<CarSerializer> {
    return this.carsService.create(createCarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cars with pagination' })
  @ApiExtraModels(PageDto, CarSerializer)
  @ApiResponse({
    status: 200,
    description: 'List of cars.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PageDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(CarSerializer) },
            },
          },
        },
      ],
    },
  })
  findAll(@Query() query: QueryCarDto): Promise<PageDto<CarSerializer>> {
    return this.carsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a car by ID' })
  @ApiResponse({ status: 200, description: 'The car.', type: CarSerializer })
  @ApiResponse({ status: 404, description: 'Car not found.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CarSerializer> {
    return this.carsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a car' })
  @ApiResponse({ status: 200, description: 'The car has been successfully updated.', type: CarSerializer })
  @ApiResponse({ status: 404, description: 'Car not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCarDto: UpdateCarDto): Promise<CarSerializer> {
    return this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a car' })
  @ApiResponse({ status: 204, description: 'The car has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Car not found.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.carsService.remove(id);
  }
}
