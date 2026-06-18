"use client";

import { createContext, useContext, useEffect, useState  } from "react";
import { getToken, setToken, removeToken } from "@/lib/auth";

interface AuthContextType {
    isLoggedIn: boolean;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

//Create context -> wadah global state, default null
const AuthContext = createContext<AuthContextType | null>(null);

//Provider = membungkus seluruh app di layout.js
export function AuthProvider({children}: { children: React.ReactNode}) {
    const [token, setTokenState] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    //cek cookies saat pertamakali dibuka
    useEffect(() => {
        const savedToken = getToken();
        if(savedToken) {
            setTokenState(savedToken);
            setIsLoggedIn(true);
        }
    }, []);

    //buat halaman login
    const login = async (username: string, password: string) => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Login failed");
            //throw supaya halaman login bisa lengkap errornya dan tampilkan pesan
        }

        const data = await res.json();
        //data berupa token

        setToken(data.token); //simpan token ke cookie
        //update ke global state
        setTokenState(data.token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        removeToken();
        setTokenState(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

//Custom hook = supaya komponen lain tinggal tulis useAuth(), bukan useContext(AuthContext)
export function useAuth() {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
}