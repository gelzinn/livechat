"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HaveAnySpecialCharacter = (string) => {
    const newString = string.match(/[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/g);
    let haveAnySpecialCharacter = false;
    if (newString && newString.length > 0) {
        haveAnySpecialCharacter = true;
    }
    else {
        haveAnySpecialCharacter = false;
    }
    return haveAnySpecialCharacter;
};
exports.default = HaveAnySpecialCharacter;
