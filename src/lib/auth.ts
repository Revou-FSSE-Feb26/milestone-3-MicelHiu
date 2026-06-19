export interface AuthUser {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
    role: "admin" | "user";
}

export interface SessionData {
    user: AuthUser;
    token: string;
}