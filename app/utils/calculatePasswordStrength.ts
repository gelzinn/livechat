import { hasUppercase, hasLowercase, hasSymbol, hasNumber } from "../helpers/validators/testers/passwordValidators";

export const calculatePasswordStrength = (password: string) => {
    const calculateStrength = () => {
        const requirements = [
            hasUppercase(password),
            hasLowercase(password),
            hasSymbol(password),
            hasNumber(password)
        ];

        const fulfilledRequirements = requirements.filter(Boolean).length;
        return (fulfilledRequirements / requirements.length) * 100;
    };

    const strength = calculateStrength();

    return +strength.toFixed(0);
};