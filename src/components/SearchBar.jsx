import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { geocodeAddress } from "../services/geocode";
import { useFavoritesStore } from "../store/useFavoritesStore";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  const [editingId, setEditingId] = useState(null);
  const [nickname, setNickname] = useState("Local Favorito");

  const { addFavorite, favorites, setSelectedFavorite } = useFavoritesStore();

  const mutation = useMutation({
    mutationFn: geocodeAddress,
  });

  const isSaved = (lat, lng) => {
    return favorites.some(
      (fav) =>
        Math.abs(fav.lat - lat) < 0.0001 && Math.abs(fav.lng - lng) < 0.0001,
    );
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    mutation.mutate(query);
  }

  function handleClear() {
    setQuery("");
    mutation.reset();
    setEditingId(null);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        mutation.reset();
        setEditingId(null);
      }
    }
    function handleEscKey(event) {
      if (event.key === "Escape") {
        mutation.reset();
        setEditingId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [mutation]);

  return (
    <div
      ref={searchRef}
      className="w-full bg-white p-4 border-b shadow-sm relative z-[2000]"
    >
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Buscar endereço (ex: Av. Paulista)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Limpar busca"
              title="Limpar"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          disabled={mutation.isPending || query.trim() === ""}
        >
          {mutation.isPending ? "..." : "Buscar"}
        </button>
      </form>

      {mutation.isError && (
        <p className="text-red-500 text-sm mt-2">Erro ao buscar.</p>
      )}

      {mutation.data && mutation.data.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl rounded-b-lg max-h-60 overflow-y-auto z-[1000]">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider p-2 bg-gray-50 sticky top-0">
            Resultados
          </p>

          {mutation.data.map((place) => {
            const alreadySaved = isSaved(place.lat, place.lng);
            const isEditing = editingId === place.id;

            return (
              <div
                key={place.id}
                className="p-3 hover:bg-blue-50 transition-colors flex items-start justify-between gap-3 border-b border-gray-100 last:border-0"
              >
                {/* Clique no nome apenas centraliza */}
                <div
                  className="flex-1 cursor-pointer min-w-0"
                  onClick={() => {
                    setSelectedFavorite({
                      id: "search",
                      lat: place.lat,
                      lng: place.lng,
                      displayName: place.displayName,
                    });
                    mutation.reset();
                    setEditingId(null);
                  }}
                >
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">
                    {place.displayName.split(",")[0]}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {place.displayName}
                  </p>
                </div>

                <div className="shrink-0">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-28 sm:w-36 border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Apelido"
                        autoFocus
                      />

                      <button
                        type="button"
                        onClick={() => {
                          addFavorite({
                            lat: place.lat,
                            lng: place.lng,
                            displayName: place.displayName,
                            name: nickname.trim() || "Local Favorito",
                          });

                          // 🔥 FECHA TUDO AO SALVAR
                          setEditingId(null);
                          mutation.reset();
                        }}
                        className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Confirmar
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="text-xs px-2 py-1.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={alreadySaved}
                      onClick={() => {
                        if (alreadySaved) return;
                        setEditingId(place.id);
                        setNickname("Local Favorito");
                      }}
                      className={`text-xs px-3 py-1.5 rounded transition-all whitespace-nowrap ${
                        alreadySaved
                          ? "bg-green-100 text-green-700 cursor-default"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                      }`}
                    >
                      {alreadySaved ? "✓ Salvo" : "Salvar"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {mutation.data && mutation.data.length === 0 && (
        <div className="absolute top-full left-0 w-full bg-white p-4 shadow-lg rounded-b-lg z-[1000] text-center text-gray-500 text-sm border-t">
          Nenhum local encontrado.
        </div>
      )}
    </div>
  );
};

export default SearchBar;
