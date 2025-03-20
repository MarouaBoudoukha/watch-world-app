// components/UserContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

type UserContextType = {
  role: string | null;
  setRole: (role: string | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Get role from cookie first
    const roleFromCookie = Cookies.get("role");
    if (roleFromCookie) {
      setRole(roleFromCookie);
      return;
    }

    // If no role in cookie, try to get it from the API
    const userId = Cookies.get("userId");
    if (userId) {
      fetch(`/api/get-user-role?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          const userRole = data.role || 'user';
          setRole(userRole);
          Cookies.set("role", userRole);
        })
        .catch((error) => {
          console.error("Error fetching user role:", error);
          setRole('user'); // Default to user role on error
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
}