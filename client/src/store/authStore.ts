import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
interface User { _id: string; name: string; email: string; avatar?: string; }
interface AuthState { user: User | null; token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, token: null,
      login: async (email, password) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
        set({ user: data.user, token: data.accessToken });
      },
      logout: () => set({ user: null, token: null }),
    }),
    { name: "chatnest-auth", partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
