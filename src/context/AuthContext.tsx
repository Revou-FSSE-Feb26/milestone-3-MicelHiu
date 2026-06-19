"use client";

import React, { useContext, createContext, useState, useEffect } from "react";
import { AuthUser, SessionData } from "@/lib/auth";
import axios from "axios";
import { create } from "node:domain";

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token,setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    //check session
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get("/api/auth/me");
            setUser(response.data);
            setIsLoading(false);
        } catch (error) {
            setUser(null);
            setToken(null);
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post("/api/auth/logout");
        } finally {
            setUser(null);
            setToken(null);
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
        value={{
            user,
            token,
            isLoggedIn: !!user,
            isLoading,
            logout,
            checkAuth,
        }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}