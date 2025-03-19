// components/UserContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

interface UserContextType {
  role: string | null;
  setRole: (role: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId) {
      fetch(`/api/get-user-role?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => setRole(data.role || 'user'));
    }
  }, []);

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}