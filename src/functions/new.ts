import { app, InvocationContext } from "@azure/functions";
import { IManage } from "../utils/imanage"; // comment out this line to show on function app

type FileQueue = {
  fileId: string;
  iMFolderId: string;
};
const imanage = new IManage(); // comment out this line to show on function app

export async function ImanageFileUpload(fileQueue: FileQueue, context: InvocationContext): Promise<void> {

}

app.storageQueue("ImanageFileUpload", {
  queueName: "taxct-file-queue",
  connection: "AzureWebJobsStorage",
  handler: ImanageFileUpload
});
