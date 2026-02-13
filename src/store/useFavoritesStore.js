import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFavoritesStore = create(
  persist(
    (set) => ({
      favorites: [],
      selectedFavorite: null,

      addFavorite: (location) =>
        set((state) => {
          const exists = state.favorites.some(
            (fav) =>
              Math.abs(fav.lat - location.lat) < 0.0001 &&
              Math.abs(fav.lng - location.lng) < 0.0001
          );

          if (exists) return state;

          const newFav = {
            id: crypto.randomUUID(),
            name: location.name?.trim() || "Local Favorito",
            lat: location.lat,
            lng: location.lng,
            displayName: location.displayName ?? "Local salvo",
            createdAt: Date.now(),
          };

          return { favorites: [newFav, ...state.favorites] };
        }),

      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== id),
        })),

      clearFavorites: () =>
        set(() => ({
          favorites: [],
          selectedFavorite: null,
        })),

      setSelectedFavorite: (fav) => set({ selectedFavorite: fav }),
    }),
    {
      name: "favorites-storage",
    }
  )
);
