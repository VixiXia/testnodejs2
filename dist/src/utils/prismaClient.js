"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// { log: ["query"] }
// prisma.$on("query" as never, async (e: any) => {
//   console.debug(e.params);
// });
exports.default = prisma;
//# sourceMappingURL=prismaClient.js.map