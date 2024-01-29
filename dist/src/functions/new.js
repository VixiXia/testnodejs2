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
exports.ImanageFileUpload = void 0;
const functions_1 = require("@azure/functions");
const imanage_1 = require("../utils/imanage"); // comment out this line to show on function app
const imanage = new imanage_1.IManage(); // comment out this line to show on function app
function ImanageFileUpload(fileQueue, context) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.ImanageFileUpload = ImanageFileUpload;
functions_1.app.storageQueue("ImanageFileUpload", {
    queueName: "taxct-file-queue",
    connection: "AzureWebJobsStorage",
    handler: ImanageFileUpload
});
//# sourceMappingURL=new.js.map