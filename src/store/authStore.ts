import { create } from 'zustand';

interface AuthStore {
  userId: number | null;
  isLoggedIn: () => boolean;
  logout: () => void;
  getUserId: () => number | null;
}

const useAuthStore = create<AuthStore>((set) => ({
  userId: null,
  getUserId: () => {
    return Number(localStorage.getItem('user_id'));
  },
  isLoggedIn: () => {
    return localStorage.getItem('user_id') !== null;
  },
  logout: () => {
    localStorage.removeItem('user_id');
    set({ userId: null });
  },
}));

export default useAuthStore;
