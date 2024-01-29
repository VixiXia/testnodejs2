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
exports.IManage = void 0;
const azureSecrets_1 = require("./azureSecrets");
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const ts_md5_1 = require("ts-md5");
const helperFunctions_1 = require("./helperFunctions");
const env_1 = require("../env");
class IManage {
    tokenFromVault() {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = yield azureSecrets_1.secrets.getSecret("ImanageAPISecret");
            if (secret.value) {
                const token = JSON.parse(secret.value);
                return token;
            }
            else {
                throw Error(`unable to obtain imanage secret from vault`);
            }
        });
    }
    upload(filePath, fileSize, fileExt, fileName, iMFolderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.tokenFromVault();
            const profileContent = JSON.stringify({
                warnings_for_required_and_disabled_fields: true,
                doc_profile: {
                    name: fileName.replace(`.${fileExt}`, ""),
                    extension: fileExt,
                    file_edit_date: new Date().toISOString(),
                    file_create_date: new Date().toISOString(),
                    size: fileSize
                }
            });
            const profilePath = `${env_1.TempFileDir}/${ts_md5_1.Md5.hashStr(profileContent)}.json`;
            fs_1.default.writeFileSync(profilePath, profileContent);
            const data = new form_data_1.default();
            data.append("profile", fs_1.default.createReadStream(profilePath));
            data.append("file", fs_1.default.createReadStream(filePath));
            const config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `https://microsoft.com/ACTIVE/folders/${iMFolderId}/documents`,
                headers: Object.assign({ "X-Auth-Token": token.access_token, "content-type": "multipart/form-data; boundary=---" }, data.getHeaders()),
                data: data
            };
            let response;
            response = yield axios_1.default.request(config);
            (0, helperFunctions_1.removeTempFile)(profilePath, 1);
            return Object.assign(Object.assign({}, response.data), { status: response.status });
        });
    }
    /**
     * get version history from imanage for document
     * @param documentId imanage file id
     **/
    getVersionHistory(documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.tokenFromVault();
            const myHeaders = new Headers();
            myHeaders.append("X-Auth-Token", token.access_token);
            const requestOptions = {
                method: "GET",
                headers: myHeaders
            };
            const response = yield fetch(`https://microsoft.com/ACTIVE/documents/${documentId}/history/versions`, requestOptions);
            const resultJson = yield response.json();
            return resultJson;
        });
    }
    /**
     * delete file from imanage
     * @param documentId imanage file id
     **/
    delete(documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.tokenFromVault();
            const myHeaders = new Headers();
            myHeaders.append("X-Auth-Token", token.access_token);
            const requestOptions = {
                method: "DELETE",
                headers: myHeaders
            };
            const responses = [];
            const allVersions = this.getVersionHistory(documentId);
            for (const docVersion of (yield allVersions).data) {
                const response = yield fetch(`https://microsoft.com/ACTIVE/documents/${docVersion.id}`, requestOptions);
                if (response.status === 200) {
                    responses.push(response);
                }
            }
            return responses;
        });
    }
}
exports.IManage = IManage;
//# sourceMappingURL=imanage.js.map