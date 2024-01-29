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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlob = exports.downloadBlobToFile = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const connectionStringParts = `${process.env.AzureWebJobsStorage}`.split(";");
const account = connectionStringParts[1].replace("AccountName=", "");
const accountKey = connectionStringParts[2].replace("AccountKey=", "");
const containerName = "taxct-blob";
const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${account}.blob.core.windows.net`, sharedKeyCredential);
const containerClient = blobServiceClient.getContainerClient(containerName);
function downloadBlobToFile(blobName, fileNameWithPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const blobClient = containerClient.getBlobClient(blobName);
        const res = yield blobClient.downloadToFile(fileNameWithPath);
        return res._response;
    });
}
exports.downloadBlobToFile = downloadBlobToFile;
function deleteBlob(blobName) {
    return __awaiter(this, void 0, void 0, function* () {
        const blobClient = containerClient.getBlobClient(blobName);
        const res = yield blobClient.deleteIfExists();
        return res._response;
    });
}
exports.deleteBlob = deleteBlob;
//# sourceMappingURL=storage.js.map