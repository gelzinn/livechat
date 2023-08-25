export type UserSignIn = {
    password: string;
} & (
        { email: string; } |
        { username: string; }
    )

export type UserSignUp = {
    username: string;
    email: string;
    password: string;
} 