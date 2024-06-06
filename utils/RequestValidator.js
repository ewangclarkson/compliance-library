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
exports.RequestValidator = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const validationErrors = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const error = yield (0, class_validator_1.validate)(input, {
        validationError: { target: false }
    });
    if (error.length)
        return error;
    return false;
});
const RequestValidator = (type, body) => __awaiter(void 0, void 0, void 0, function* () {
    const input = (0, class_transformer_1.plainToClass)(type, body);
    const errors = yield validationErrors(input);
    if (errors) {
        const errorMessage = errors.map((error) => Object.values(error.constraints)).join(",'\n' ");
        return Promise.resolve({ errors: errorMessage, input });
    }
    return Promise.resolve({ errors: false, input });
});
exports.RequestValidator = RequestValidator;
//# sourceMappingURL=RequestValidator.js.map