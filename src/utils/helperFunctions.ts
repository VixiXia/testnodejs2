// Parse request list to remove client and project
// for /get-user-eng-party-request-list endpoint
// input: engParty -> client -> project -> request -> ((project -> client), message, file)
// output: engParty -> [request -> ((project -> client), message, file)]

import fs from "fs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseRequestList = async (data: any) => {
  const parsedList = [];

  // parse individual engParty
  for (const engParty of data) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ["Client"]: omittedField, ...engPartyClean } = engParty; // erase client field
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

    const engPartyFinal = {
      ...engPartyClean,
      Request: requestList
    };

    parsedList.push(engPartyFinal);
  }
  return parsedList;
};


export function convertRecordTitle(title: string) {
  const wordArr = title.split("_"); // 'INCOME_TAX_RETURN' => ['INCOME', 'TAX', 'RETURN']
  const formattedWordsArr = wordArr.map((word) => {
    const lowerWord = word.toLowerCase();
    const letterArr = lowerWord.split("");
    letterArr[0] = letterArr[0].toUpperCase();
    return letterArr.join("");
  });
  return formattedWordsArr.join(" ");
}

export function serverUTCTimeToLocalDateTime(time: Date, timeOffSet: number) {
  const timeOffsetInMS: number = timeOffSet * 60000;

  const utcTimeStampForInputTime = time.setTime(time.getTime() - timeOffsetInMS);
  return new Date(utcTimeStampForInputTime); // eg, 2023-11-04T11:00:00 (Server UTC time) => 2023-11-05T00:00:00
}

interface emailParamReplaceType {
  emailBase: string;
  firstName?: string;
  lastName?: string;
  entityName?: string;
  projectType?: string;
  projectYear?: string;
  linkToProject?: string;
  requestDescription?: string;
  requestDueDate?: Date;
  sendConfirmationEmailBody?: string;
  isClient: boolean;
  lineBody?: string;
  deliverableTitle?: string;
  approverName?: string;
  linkToDeliverable?: string;
}


export const crypt = (salt: string, text: string) => {
  const textToChars = (textChar: string) => textChar.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n: number) => ("0" + Number(n).toString(16)).slice(-2);
  const applySaltToChar = (code: number) => textToChars(salt).reduce((a: number, b: number) => a ^ b, code);

  return text
    .split("")
    .map((textChar: string) => textChar.charCodeAt(0))
    .map(applySaltToChar)
    .map(byteHex)
    .join("");
};

export const decrypt = (salt: string, encoded: string) => {
  const textToChars = (text: string) => text.split("").map((c) => c.charCodeAt(0));
  const applySaltToChar = (code: number) => textToChars(salt).reduce((a, b) => a ^ b, code);
  if (encoded !== null) {
    return encoded
      .match(/.{1,2}/g)
      ?.map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
  }
};


export function removeTempFile(fileNameWithPath: string, timeout: number = 60000) {
  setTimeout(() => {
    try {
      fs.unlinkSync(fileNameWithPath);
    } catch (error) {}
  }, timeout);
}
