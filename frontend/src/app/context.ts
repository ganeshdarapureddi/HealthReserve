"use client"
import { createContext, useContext } from 'react';

export const UserContext = createContext<{ userId:string|null,userRole:string|null } | null>(null);

export const useUser = () => useContext(UserContext);   