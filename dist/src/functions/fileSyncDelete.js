"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSyncDelete = void 0;
const functions_1 = require("@azure/functions");
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const client_1 = require("@prisma/client");
const storage_1 = require("../utils/storage");
const imanage_1 = require("../utils/imanage");
const imanage = new imanage_1.IManage();
function FileSyncDelete(timer, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileStorageSync = yield prismaClient_1.default.fileStorageSync.findMany({ where: { fileId: null } });
        for (const file of fileStorageSync) {
            try {
                if (file.fileStorage === client_1.FileStorage.IMANAGE) {
                    yield imanage.delete(file.documentId);
                }
                else {
                    const blobFileName = file.downloadLink.split("/").pop();
                    yield (0, storage_1.deleteBlob)(blobFileName);
                }
                context.log(`file ${file.documentId} - ${file.fileId} done clean up from storage`);
            }
            catch (error) {
                context.log(`file ${file.documentId} - ${file.fileId} have problem with clean up from storage`);
                context.log(error);
            }
            yield prismaClient_1.default.fileStorageSync.delete({ where: { id: file.id } });
        }
    });
}
exports.FileSyncDelete = FileSyncDelete;
functions_1.app.timer("FileSyncDelete", {
    schedule: process.env.TIME_TRIGGER || "0 * * * * *",
    handler: FileSyncDelete
});
//# sourceMappingURL=fileSyncDelete.js.map