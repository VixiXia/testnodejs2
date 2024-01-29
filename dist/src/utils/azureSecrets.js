"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secrets = void 0;
const keyvault_secrets_1 = require("@azure/keyvault-secrets");
const identity_1 = require("@azure/identity");
const credential = process.env.NODE_ENV === "local" ? new identity_1.AzureCliCredential() : new identity_1.DefaultAzureCredential();
const url = "https://" + process.env.AZURE_KEY_VAULT_NAME + ".vault.azure.net";
exports.secrets = new keyvault_secrets_1.SecretClient(url, credential);
//# sourceMappingURL=azureSecrets.js.map