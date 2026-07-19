"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCarDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_car_dto_1 = require("./create-car.dto");
class UpdateCarDto extends (0, swagger_1.PartialType)(create_car_dto_1.CreateCarDto) {
}
exports.UpdateCarDto = UpdateCarDto;
//# sourceMappingURL=update-car.dto.js.map