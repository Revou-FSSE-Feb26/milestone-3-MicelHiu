"use client";

import { createContext, useContext, useEffect, useState  } from "react";
import { getToken, setToken, removeToken } from "@/lib/auth";

interface User {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    token: string | null;
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

//Create context -> wadah global state, default null
const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = "revoshop_user";

//Provider = membungkus seluruh app di layout.js
export function AuthProvider({children}: { children: React.ReactNode}) {
    const [token, setTokenState] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    //cek cookies saat pertamakali dibuka
    useEffect(() => {
        const savedToken = getToken();
        const savedUser = localStorage.getItem(USER_KEY);

        if(savedToken) {
            setTokenState(savedToken);
            setIsLoggedIn(true);
        }
        if(savedUser) {
            setUser(JSON.parse(savedUser)); //restore user dari local storage
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

        setToken(data.token);
        const userData: User = {
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            image: data.image,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(userData))

        //update ke global state
        setUser(userData);
        setTokenState(data.token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        removeToken();
        localStorage.removeItem(USER_KEY);
        setTokenState(null);
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, user, login, logout}}>
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