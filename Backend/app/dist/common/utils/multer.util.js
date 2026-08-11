"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUploadedFile = exports.createMulterStorage = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const createMulterStorage = (subfolder) => {
    const destination = (0, path_1.join)(process.cwd(), 'uploads', subfolder);
    if (!(0, fs_1.existsSync)(destination)) {
        (0, fs_1.mkdirSync)(destination, { recursive: true });
    }
    return (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            if (!(0, fs_1.existsSync)(destination)) {
                (0, fs_1.mkdirSync)(destination, { recursive: true });
            }
            cb(null, destination);
        },
        filename: (req, file, cb) => {
            const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(null, `${unique}${(0, path_1.extname)(file.originalname)}`);
        },
    });
};
exports.createMulterStorage = createMulterStorage;
const deleteUploadedFile = async (subfolder, filename) => {
    if (!filename)
        return;
    try {
        const filePath = (0, path_1.join)(process.cwd(), 'uploads', subfolder, filename);
        await fs_1.promises.unlink(filePath);
    }
    catch {
    }
};
exports.deleteUploadedFile = deleteUploadedFile;
//# sourceMappingURL=multer.util.js.map