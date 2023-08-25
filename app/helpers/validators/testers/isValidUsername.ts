export const isValidUsername = (username: string) => (
    /^[a-z._]+$/i.test(username) &&
    !/^\.|_|[._]{2}|[._]$|\.(_|\.)/.test(username) &&
    !/@/.test(username)
);