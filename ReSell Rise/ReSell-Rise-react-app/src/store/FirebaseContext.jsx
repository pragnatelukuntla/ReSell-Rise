import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export const FirebaseContext = createContext(null);
export const AuthContext = createContext(null);
export const UserDocReference = createContext(null);

export default function AuthProvider({ children }) {
  const [main, setMain] = useState(null);
  const [email, setEmail] = useState(null);

  return (
    <AuthContext.Provider value={{ main, setMain, email, setEmail }}>
      {children}
    </AuthContext.Provider>
  );
}
