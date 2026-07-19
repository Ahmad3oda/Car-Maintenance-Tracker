import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { MaintenanceRecordsService } from './maintenance-records.service';
import { CreateMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';
import { UpdateMaintenanceRecordDto } from './dtos/update-maintenance-record.dto';
import { QueryMaintenanceRecordDto } from './dtos/query-maintenance-record.dto';
import { MaintenanceRecordSerializer } from './serializers/maintenance-record.serializer';
import { PageDto } from '../../common/dtos/page.dto';

@ApiTags('Maintenance Records')
@Controller('maintenance-records')
export class MaintenanceRecordsController {
  constructor(private readonly recordsService: MaintenanceRecordsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new maintenance record' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.', type: MaintenanceRecordSerializer })
  create(@Body() createDto: CreateMaintenanceRecordDto): Promise<MaintenanceRecordSerializer> {
    return this.recordsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all maintenance records with pagination' })
  @ApiExtraModels(PageDto, MaintenanceRecordSerializer)
  @ApiResponse({
    status: 200,
    description: 'List of maintenance records.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PageDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(MaintenanceRecordSerializer) },
            },
          },
        },
      ],
    },
  })
  findAll(@Query() query: QueryMaintenanceRecordDto): Promise<PageDto<MaintenanceRecordSerializer>> {
    return this.recordsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a maintenance record by ID' })
  @ApiResponse({ status: 200, description: 'The record.', type: MaintenanceRecordSerializer })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<MaintenanceRecordSerializer> {
    return this.recordsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a maintenance record' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: MaintenanceRecordSerializer })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMaintenanceRecordDto,
  ): Promise<MaintenanceRecordSerializer> {
    return this.recordsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a maintenance record' })
  @ApiResponse({ status: 204, description: 'The record has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.recordsService.remove(id);
  }
}
