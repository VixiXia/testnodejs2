"use strict";
// Parse request list to remove client and project
// for /get-user-eng-party-request-list endpoint
// input: engParty -> client -> project -> request -> ((project -> client), message, file)
// output: engParty -> [request -> ((project -> client), message, file)]
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTempFile = exports.decrypt = exports.crypt = exports.serverUTCTimeToLocalDateTime = exports.convertRecordTitle = exports.parseRequestList = void 0;
const fs_1 = __importDefault(require("fs"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseRequestList = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedList = [];
    // parse individual engParty
    for (const engParty of data) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ["Client"]: omittedField } = engParty, engPartyClean = __rest(engParty, ["Client"]); // erase client field
        const client = engParty["Client"];
        const requestList = [];
        // parse client in engParty to get project
        for (const clientIndex in client) {
            const project = client[clientIndex]["Project"];
            // parse project in each client to get request
            for (const projectIndex in project) {
                const request = project[projectIndex]["Request"];
                // append request to requestListEmpty
                requestList.push(...request);
            }
        }
        const engPartyFinal = Object.assign(Object.assign({}, engPartyClean), { Request: requestList });
        parsedList.push(engPartyFinal);
    }
    return parsedList;
});
exports.parseRequestList = parseRequestList;
function convertRecordTitle(title) {
    const wordArr = title.split("_"); // 'INCOME_TAX_RETURN' => ['INCOME', 'TAX', 'RETURN']
    const formattedWordsArr = wordArr.map((word) => {
        const lowerWord = word.toLowerCase();
        const letterArr = lowerWord.split("");
        letterArr[0] = letterArr[0].toUpperCase();
        return letterArr.join("");
    });
    return formattedWordsArr.join(" ");
}
exports.convertRecordTitle = convertRecordTitle;
function serverUTCTimeToLocalDateTime(time, timeOffSet) {
    const timeOffsetInMS = timeOffSet * 60000;
    const utcTimeStampForInputTime = time.setTime(time.getTime() - timeOffsetInMS);
    return new Date(utcTimeStampForInputTime); // eg, 2023-11-04T11:00:00 (Server UTC time) => 2023-11-05T00:00:00
}
exports.serverUTCTimeToLocalDateTime = serverUTCTimeToLocalDateTime;
const crypt = (salt, text) => {
    const textToChars = (textChar) => textChar.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).slice(-2);
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
    return text
        .split("")
        .map((textChar) => textChar.charCodeAt(0))
        .map(applySaltToChar)
        .map(byteHex)
        .join("");
};
exports.crypt = crypt;
const decrypt = (salt, encoded) => {
    var _a;
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
    if (encoded !== null) {
        return (_a = encoded
            .match(/.{1,2}/g)) === null || _a === void 0 ? void 0 : _a.map((hex) => parseInt(hex, 16)).map(applySaltToChar).map((charCode) => String.fromCharCode(charCode)).join("");
    }
};
exports.decrypt = decrypt;
function removeTempFile(fileNameWithPath, timeout = 60000) {
    setTimeout(() => {
        try {
            fs_1.default.unlinkSync(fileNameWithPath);
        }
        catch (error) { }
    }, timeout);
}
exports.removeTempFile = removeTempFile;
//# sourceMappingURL=helperFunctions.js.map