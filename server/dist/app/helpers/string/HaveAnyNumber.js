"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HaveAnyNumber = (string) => {
    const newString = string.replace(/\D/g, "");
    let haveAnyNumber = false;
    if (newString.length > 0) {
        haveAnyNumber = true;
    }
    else {
        haveAnyNumber = false;
    }
    return haveAnyNumber;
};
exports.default = HaveAnyNumber;
