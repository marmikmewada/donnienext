// src/store/store.js
import create from 'zustand';

export const useStore = create((set) => ({
  session: null, // Change this to session instead of user
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null }),
}));
