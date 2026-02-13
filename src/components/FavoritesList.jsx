import { useFavoritesStore } from "../store/useFavoritesStore";

const FavoritesList = () => {
const { favorites, removeFavorite, clearFavorites, setSelectedFavorite, selectedFavorite } =
  useFavoritesStore();

  return (
    <aside className="h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header fixo */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900">Os Meus Locais</h2>
        <p className="text-sm text-gray-500 mt-1">
          Favoritos salvos neste navegador
        </p>
      </div>
      

      {/* Conteúdo com scroll */}
      <div className="p-6 overflow-y-auto flex-1">
        {favorites.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="font-medium">Ainda não tens favoritos.</p>
            <p className="text-sm mt-2">
              Clica no mapa ou pesquisa para adicionar.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {favorites.map((fav) => {
              const isSelected = selectedFavorite?.id === fav.id;

              return (
                <li
                  key={fav.id}
                  onClick={() => setSelectedFavorite(fav)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex justify-between gap-3
                    ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                >
                  <div className="min-w-0">
                    {/* Apelido (nome manual) */}
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {fav.name ?? "Local Favorito"}
                    </p>

                    {/* Endereço (da API) */}
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {fav.displayName ??
                        `${fav.lat.toFixed(5)}, ${fav.lng.toFixed(5)}`}
                    </p>

                    {/* Rodapé pequeno */}
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                      <span>
                        {new Date(fav.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>
                        {fav.lat.toFixed(4)}, {fav.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(fav.id);
                    }}
                    className="shrink-0 h-9 w-9 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition"
                    aria-label="Remover favorito"
                    title="Remover"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default FavoritesList;
