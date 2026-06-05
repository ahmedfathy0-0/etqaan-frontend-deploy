import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = "super_admin" | "admin" | "sheikh" | "student";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: true, // Initially true while hydrating
      setAuth: (user, token) => set({ user, token, isLoading: false }),
      logout: () => set({ user: null, token: null, isLoading: false }),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'etqaan-auth-storage', // name of the item in the storage (must be unique)
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setIsLoading(false);
        }
      },
    }
  )
);
