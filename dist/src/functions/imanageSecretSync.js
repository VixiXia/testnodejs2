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
exports.ImanageSecretSync = void 0;
const functions_1 = require("@azure/functions");
const azureSecrets_1 = require("../utils/azureSecrets");
function ImanageSecretSync(timer, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const secret = yield azureSecrets_1.secrets.getSecret("ImanageAPISecret");
        const value = JSON.parse(secret.value);
        const urlencoded = new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: value.refresh_token,
            client_id: process.env.IMANAGE_CLIENT_ID,
            client_secret: process.env.IMANAGE_CLIENT_SECRET
        });
        if (!value.obtained_at) {
            value.obtained_at = 17000000;
        }
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: urlencoded
        };
        if (new Date() > new Date(value.obtained_at + (value.expires_in - 120) * 1000)) {
            const response = yield fetch("https://microsoft.com/auth//oauth2/token", requestOptions);
            const result = yield response.text();
            if (response.status !== 200) {
                throw Error(`${result}`);
            }
            const resultJson = JSON.parse(result);
            resultJson.obtained_at = new Date().getTime();
            const expireOn = new Date(resultJson.obtained_at + resultJson.expires_in * 1000);
            yield azureSecrets_1.secrets.setSecret("ImanageAPISecret", JSON.stringify(resultJson), {
                expiresOn: expireOn
            });
            context.log(`obtained imanage api token ${response.statusText}`);
            azureSecrets_1.secrets.updateSecretProperties("ImanageAPISecret", secret.properties.version, { enabled: false });
        }
    });
}
exports.ImanageSecretSync = ImanageSecretSync;
functions_1.app.timer("ImanageSecretSync", {
    schedule: process.env.TIME_TRIGGER || "0 */5 * * * *",
    handler: ImanageSecretSync
});
//# sourceMappingURL=imanageSecretSync.js.map