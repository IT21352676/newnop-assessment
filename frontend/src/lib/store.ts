import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Issue, User } from "./types";

interface AuthState {
  userId: string | null;
  token: string | null;
  setAuth: (userId: string | null, token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      token: null,
      setAuth: (userId, token) => set({ userId, token }),
      logout: () => set({ userId: null, token: null }),
    }),
    {
      name: "auth-storage",
    },
  ),
);

interface IssueState {
  issues: Issue[];
  stats: { status: string; count: number }[];
  loading: boolean;
  setIssues: (issues: Issue[]) => void;
  setStats: (stats: { status: string; count: number }[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useIssueStore = create<IssueState>((set) => ({
  issues: [],
  stats: [],
  loading: false,
  setIssues: (issues) => set({ issues }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
}));
