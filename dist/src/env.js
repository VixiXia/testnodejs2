"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempFileDir = void 0;
exports.TempFileDir = process.env.NODE_ENV !== "local" ? "/tmp" : "./tmp";
//# sourceMappingURL=env.js.map