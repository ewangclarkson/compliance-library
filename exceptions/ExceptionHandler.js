"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleException = void 0;
const http_status_1 = __importDefault(require("http-status"));
const Logger_1 = require("../config/logging/Logger");
function handleException(error, request, response, next) {
    Logger_1.Logger.error("internal server error", error);
    return response.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error.message);
}
exports.handleException = handleException;
//# sourceMappingURL=ExceptionHandler.js.map