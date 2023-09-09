export type UserSignIn = {
  password: string,
} & (
    { email: string, } |
    { username: string, }
  )

export type UserSignUp = {
  username: string,
  email: string,
  password: string,
}

export type UserAgent = {
  userAgent: string,
  browser: {
    name: string | undefined,
    version: string | undefined,
  },
  operatingSystem: {
    name: string | undefined,
    version: string | undefined,
  },
}
