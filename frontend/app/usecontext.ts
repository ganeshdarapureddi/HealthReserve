// UserContext.tsx
"use client"
import { createContext, useContext } from 'react';

export const UserContext = createContext<{ userId:string|boolean,userRole:string|boolean } | null>(null);

export const useUser = () => useContext(UserContext);   