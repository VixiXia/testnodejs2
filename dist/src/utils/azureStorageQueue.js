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
exports.addEmailToQueue = void 0;
const storage_queue_1 = require("@azure/storage-queue");
const helperFunctions_1 = require("./helperFunctions");
const connectionStringParts = `${process.env.AzureWebJobsStorage}`.split(";");
const accountName = connectionStringParts[1].replace("AccountName=", "");
const accountKey = connectionStringParts[2].replace("AccountKey=", "");
const queueName = process.env.AZURE_QUEUE_NAME || "taxct-queue";
const sharedKeyCredential = new storage_queue_1.StorageSharedKeyCredential(accountName, accountKey);
const queueClient = new storage_queue_1.QueueClient(`https://${accountName}.queue.core.windows.net/${queueName}`, sharedKeyCredential);
function addEmailToQueue(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.header) {
            message.header = (0, helperFunctions_1.crypt)(accountKey, message.header);
        }
        if (message.content) {
            message.content = (0, helperFunctions_1.crypt)(accountKey, message.content);
        }
        return yield queueClient.sendMessage(JSON.stringify(message));
    });
}
exports.addEmailToQueue = addEmailToQueue;
//# sourceMappingURL=azureStorageQueue.js.map