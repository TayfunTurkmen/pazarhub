'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import * as authService from '@/services/auth';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    login: async () => false,
    logout: () => { },
    register: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Check for persisted user on mount (mock)
    useEffect(() => {
        const stored = localStorage.getItem('sahibinden_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    const login = async (email: string, pass: string) => {
        const u = await authService.login(email, pass);
        if (u) {
            setUser(u);
            localStorage.setItem('sahibinden_user', JSON.stringify(u));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sahibinden_user');
    };

    const register = async (data: any) => {
        const u = await authService.register(data);
        setUser(u);
        localStorage.setItem('sahibinden_user', JSON.stringify(u));
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
