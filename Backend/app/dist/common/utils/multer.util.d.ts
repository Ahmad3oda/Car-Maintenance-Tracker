export declare const createMulterStorage: (subfolder: string) => import("multer").StorageEngine;
export declare const deleteUploadedFile: (subfolder: string, filename?: string | null) => Promise<void>;
