export const hasUppercase = (str: string) => /[A-Z]/.test(str);
export const hasLowercase = (str: string) => /[a-z]/.test(str);
export const hasSymbol = (str: string) => /[!@#$%^&*()\-_=+[\]{}|\\;:'",.<>/?]/.test(str);
export const hasNumber = (str: string) => /[0-9]/.test(str);