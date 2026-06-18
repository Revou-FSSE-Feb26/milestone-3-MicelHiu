const TOKEN_KEY = "revoshop_token";

export function setToken (token:string) {
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${60 * 60 * 24 * 1}`;
}

export function getToken(): string | null {
    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${TOKEN_KEY}=`));
    return match ? match.split("=")[1] : null;
}

export function removeToken() {
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

export function isAuthenticated(): boolean {
    return getToken() !== null;
}