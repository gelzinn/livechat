import { z } from "zod";

import { isValidUsername } from "../testers/isValidUsername";

import {
    hasUppercase,
    hasLowercase,
    hasSymbol,
    hasNumber
} from "../testers/passwordValidators";

export const userValidationSchema = z.object({
    username: z.string().min(4, { message: "O nome de usuário deve conter pelo menos 4 caracteres." })
        .max(24, { message: "Máximo de 16 caracteres." })
        .refine(isValidUsername, {
            message: "Use apenas letras, números, hífens e subtraços.",
        }),
    email: z.string().email({ message: "Insira um endereço de email válido." })
        .min(4, { message: "Mínimo de 4 caracteres." })
        .max(64, { message: "Máximo de 64 caracteres." }),
    password: z.string().min(8, { message: "Mínimo de 8 caracteres." })
        .max(64, { message: "Máximo de 64 caracteres." })
        .refine((password) => {
            return (
                hasUppercase(password) &&
                hasLowercase(password) &&
                hasSymbol(password) &&
                hasNumber(password)
            );
        }, {
            message: "Senha não atende aos requisitos mínimos de segurança.",
        }),
});
