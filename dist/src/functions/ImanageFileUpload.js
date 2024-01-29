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
exports.ImanageFileUpload = void 0;
const functions_1 = require("@azure/functions");
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const helperFunctions_1 = require("../utils/helperFunctions");
const ts_md5_1 = require("ts-md5");
const env_1 = require("../env");
const imanage_1 = require("../utils/imanage"); // comment out this line to show on function app
const fs_1 = __importDefault(require("fs"));
const imanage = new imanage_1.IManage(); // comment out this line to show on function app
function ImanageFileUpload(fileQueue, context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync(env_1.TempFileDir)) {
            // Create the folder
            fs_1.default.mkdirSync(env_1.TempFileDir);
        }
        const file = yield prismaClient_1.default.file.findUnique({
            where: {
                id: fileQueue.fileId
            }
        });
        const uniqueFilePath = ts_md5_1.Md5.hashStr(`${file.id}-${new Date()}`);
        const requestFileDir = `${env_1.TempFileDir}/${uniqueFilePath}`;
        if (!fs_1.default.existsSync(requestFileDir)) {
            fs_1.default.mkdirSync(requestFileDir);
        }
        const fileNameWithPath = `${requestFileDir}/${file.filename}`;
        const blobFileName = file.downloadLink.split("/").pop();
        // const resp = await downloadBlobToFile(blobFileName, fileNameWithPath);
        // context.log(resp.status, fileNameWithPath);
        const fileExt = file.filename.split(".").pop();
        // const iMResponse = await imanage.upload(fileNameWithPath, file.fileSize, fileExt, file.filename, fileQueue.iMFolderId);
        // if (iMResponse.status === 201) {
        //   await prisma.file.update({
        //     where: { id: file.id },
        //     data: { documentId: iMResponse.data.id, downloadLink: iMResponse.data.id, fileStorage: FileStorage.IMANAGE }
        //   });
        // }
        (0, helperFunctions_1.removeTempFile)(fileNameWithPath, 1);
    });
}
exports.ImanageFileUpload = ImanageFileUpload;
functions_1.app.storageQueue("ImanageFileUpload", {
    queueName: "taxct-file-queue",
    connection: "AzureWebJobsStorage",
    handler: ImanageFileUpload
});
//# sourceMappingURL=ImanageFileUpload.js.map