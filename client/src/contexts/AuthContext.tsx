import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
// const mockUsers: User[] = [
//   {
//     id: "1",
//     name: "Dr. John Admin",
//     email: "admin@hospital.com",
//     role: "admin",
//     avatar:
//       "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
//     phone: "+254700000001",
//   },
//   {
//     id: "2",
//     name: "Dr. Sarah Wilson",
//     email: "doctor@hospital.com",
//     role: "doctor",
//     specialization: "Cardiology",
//     avatar:
//       "https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
//     phone: "+254700000002",
//   },
//   {
//     id: "3",
//     name: "Mary Johnson",
//     email: "patient@hospital.com",
//     role: "patient",
//     avatar:
//       "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
//     phone: "+254700000003",
//   },
// ];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("hmsUser");
      if (stored && stored !== "undefined") {
        const parsed = JSON.parse(stored);
        setIsAuthenticated(true);
        setUser(parsed);
      }
    } catch (err) {
      console.error("Failed to parse stored user:", err);
      setIsAuthenticated(false);
      localStorage.removeItem("hmsUser");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    if (userData) {
      localStorage.setItem("hmsUser", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem("hmsUser");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
