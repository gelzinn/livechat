"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IsStringEmpty = (string) => {
    let isStringEmpty = false;
    if (string.trim().replace(" ", "") === "") {
        isStringEmpty = true;
    }
    else {
        isStringEmpty = false;
    }
    return isStringEmpty;
};
exports.default = IsStringEmpty;
