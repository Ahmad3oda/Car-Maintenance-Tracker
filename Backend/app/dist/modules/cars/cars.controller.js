"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cars_service_1 = require("./cars.service");
const create_car_dto_1 = require("./dtos/create-car.dto");
const update_car_dto_1 = require("./dtos/update-car.dto");
const query_car_dto_1 = require("./dtos/query-car.dto");
const car_serializer_1 = require("./serializers/car.serializer");
const page_dto_1 = require("../../common/dtos/page.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_util_1 = require("../../common/utils/multer.util");
let CarsController = class CarsController {
    carsService;
    constructor(carsService) {
        this.carsService = carsService;
    }
    create(createCarDto, photo) {
        return this.carsService.create(createCarDto, photo);
    }
    findAll(query) {
        return this.carsService.findAll(query);
    }
    findOne(id) {
        return this.carsService.findOne(id);
    }
    update(id, updateCarDto, photo) {
        return this.carsService.update(id, updateCarDto, photo);
    }
    remove(id) {
        return this.carsService.remove(id);
    }
};
exports.CarsController = CarsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new car' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The car has been successfully created.',
        type: car_serializer_1.CarSerializer,
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photoPath', {
        storage: (0, multer_util_1.createMulterStorage)('cars'),
    })),
    (0, common_1.SerializeOptions)({ type: car_serializer_1.CarSerializer }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_car_dto_1.CreateCarDto, Object]),
    __metadata("design:returntype", Promise)
], CarsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all cars with pagination' }),
    (0, swagger_1.ApiExtraModels)(page_dto_1.PageDto, car_serializer_1.CarSerializer),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of cars.',
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(page_dto_1.PageDto) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: (0, swagger_1.getSchemaPath)(car_serializer_1.CarSerializer) },
                        },
                    },
                },
            ],
        },
    }),
    (0, common_1.SerializeOptions)({ type: (page_dto_1.PageDto) }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_car_dto_1.QueryCarDto]),
    __metadata("design:returntype", Promise)
], CarsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a car by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The car.', type: car_serializer_1.CarSerializer }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Car not found.' }),
    (0, common_1.SerializeOptions)({ type: car_serializer_1.CarSerializer }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CarsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a car' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The car has been successfully updated.',
        type: car_serializer_1.CarSerializer,
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photoPath', {
        storage: (0, multer_util_1.createMulterStorage)('cars'),
    })),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Car not found.' }),
    (0, common_1.SerializeOptions)({ type: car_serializer_1.CarSerializer }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_car_dto_1.UpdateCarDto, Object]),
    __metadata("design:returntype", Promise)
], CarsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a car' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'The car has been successfully deleted.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Car not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CarsController.prototype, "remove", null);
exports.CarsController = CarsController = __decorate([
    (0, swagger_1.ApiTags)('Cars'),
    (0, common_1.Controller)('cars'),
    __metadata("design:paramtypes", [cars_service_1.CarsService])
], CarsController);
//# sourceMappingURL=cars.controller.js.map