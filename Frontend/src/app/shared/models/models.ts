export * from './api.models';

import {
  CarDto,
  ItemDto,
  MaintenanceRecordDto,
  CreateCarDto,
  CreateItemDto,
  CreateMaintenanceRecordDto,
} from './api.models';

export type Car = CarDto;
export type Item = ItemDto;
export type MaintenanceEvent = MaintenanceRecordDto;
export type CreateCar = CreateCarDto;
export type CreateItem = CreateItemDto;
export type CreateMaintenanceEvent = CreateMaintenanceRecordDto;
