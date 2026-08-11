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
exports.ItemsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const items_service_1 = require("./items.service");
const create_item_dto_1 = require("./dtos/create-item.dto");
const update_item_dto_1 = require("./dtos/update-item.dto");
const query_item_dto_1 = require("./dtos/query-item.dto");
const item_serializer_1 = require("./serializers/item.serializer");
const page_dto_1 = require("../../common/dtos/page.dto");
const multer_util_1 = require("../../common/utils/multer.util");
let ItemsController = class ItemsController {
    itemsService;
    constructor(itemsService) {
        this.itemsService = itemsService;
    }
    create(createItemDto, files) {
        const photo = files?.photoPath?.[0] || files?.photo?.[0];
        return this.itemsService.create(createItemDto, photo?.filename);
    }
    findAll(query) {
        return this.itemsService.findAll(query);
    }
    findOne(id) {
        return this.itemsService.findOne(id);
    }
    update(id, updateItemDto, files) {
        const photo = files?.photoPath?.[0] || files?.photo?.[0];
        return this.itemsService.update(id, updateItemDto, photo?.filename);
    }
    remove(id) {
        return this.itemsService.remove(id);
    }
};
exports.ItemsController = ItemsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new item' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The item has been successfully created.',
        type: item_serializer_1.ItemSerializer,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'photoPath', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
    ], { storage: (0, multer_util_1.createMulterStorage)('items') })),
    (0, common_1.SerializeOptions)({ type: item_serializer_1.ItemSerializer }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_item_dto_1.CreateItemDto, Object]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all items with pagination' }),
    (0, swagger_1.ApiExtraModels)(page_dto_1.PageDto, item_serializer_1.ItemSerializer),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of items.',
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(page_dto_1.PageDto) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: (0, swagger_1.getSchemaPath)(item_serializer_1.ItemSerializer) },
                        },
                    },
                },
            ],
        },
    }),
    (0, common_1.SerializeOptions)({ type: (page_dto_1.PageDto) }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_item_dto_1.QueryItemDto]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an item by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The item.', type: item_serializer_1.ItemSerializer }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found.' }),
    (0, common_1.SerializeOptions)({ type: item_serializer_1.ItemSerializer }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an item' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The item has been successfully updated.',
        type: item_serializer_1.ItemSerializer,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found.' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'photoPath', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
    ], { storage: (0, multer_util_1.createMulterStorage)('items') })),
    (0, common_1.SerializeOptions)({ type: item_serializer_1.ItemSerializer }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_item_dto_1.UpdateItemDto, Object]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an item' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'The item has been successfully deleted.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "remove", null);
exports.ItemsController = ItemsController = __decorate([
    (0, swagger_1.ApiTags)('Items'),
    (0, common_1.Controller)('items'),
    __metadata("design:paramtypes", [items_service_1.ItemsService])
], ItemsController);
//# sourceMappingURL=items.controller.js.map