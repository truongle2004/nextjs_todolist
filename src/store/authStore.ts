import { create } from 'zustand';

interface AuthStore {
  userId: number | null;
  isLoggedIn: () => boolean;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  userId: null,
  isLoggedIn: () => {
    return localStorage.getItem('user_id') !== null;
  },
  logout: () => {
    localStorage.removeItem('user_id');
    set({ userId: null });
  },
}));

export default useAuthStore;
