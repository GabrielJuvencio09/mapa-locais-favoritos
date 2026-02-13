import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import { reverseGeocode } from "../services/reverseGeocode";

// Correção dos ícones (Mantenha isto)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Centraliza o mapa quando selectedFavorite muda
function CenterMap({ selectedFavorite }) {
  const map = useMap();

  useEffect(() => {
    if (selectedFavorite?.lat && selectedFavorite?.lng) {
      map.setView([selectedFavorite.lat, selectedFavorite.lng], 15, {
        animate: true,
      });
    }
  }, [selectedFavorite, map]);

  return null;
}

// Captura clique no mapa e atualiza posição selecionada
function LocationMarker({ setPosition, clearMsg, resetNickname }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      clearMsg();
      resetNickname?.();
    },
  });
  return null;
}

const MapView = () => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const { addFavorite, favorites, selectedFavorite } = useFavoritesStore();
  const [nickname, setNickname] = useState("Local Favorito");
  const markerRefs = useRef({});

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Ref do container do MapView para detectar clique fora
  const containerRef = useRef(null);

  const clearMsg = () => setMsg("");

  const closeSelection = () => {
    setSelectedPosition(null);
    setMsg("");
  };

  const alreadySaved =
    selectedPosition &&
    favorites.some(
      (fav) =>
        Math.abs(fav.lat - selectedPosition.lat) < 0.0001 &&
        Math.abs(fav.lng - selectedPosition.lng) < 0.0001
    );

  // Abre o popup automaticamente ao selecionar favorito na lista
  useEffect(() => {
    if (!selectedFavorite?.id) return;
    if (selectedFavorite.id === "search") return;

    const marker = markerRefs.current[selectedFavorite.id];
    if (marker) marker.openPopup();
  }, [selectedFavorite]);

  // Fecha o "sheet" ao clicar fora do MapView (SearchBar, lista, etc.)
  useEffect(() => {
    function handleClickOutside(e) {
      if (!selectedPosition) return;

      const el = containerRef.current;
      if (el && !el.contains(e.target)) {
        closeSelection();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedPosition]);

  // Bônus: Fecha com ESC
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape" && selectedPosition) {
        closeSelection();
      }
    }

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [selectedPosition]);

  async function handleSaveClickPosition() {
    if (!selectedPosition || alreadySaved) return;

    try {
      setSaving(true);
      setMsg("");

      const name = await reverseGeocode(
        selectedPosition.lat,
        selectedPosition.lng
      );

      addFavorite({
        lat: selectedPosition.lat,
        lng: selectedPosition.lng,
        displayName: name,
        name: nickname,
      });

      setMsg("✅ Salvo nos favoritos!");
      setSelectedPosition(null); // fecha o sheet após salvar
    } catch (err) {
      setMsg("❌ Não foi possível obter o endereço. Tente novamente.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 2000);
    }
  }

  return (
    <div ref={containerRef} className="h-full w-full relative pb-24 md:pb-0">
      <MapContainer
        center={[-18.9186, -48.2772]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CenterMap selectedFavorite={selectedFavorite} />

        {/* Markers dos favoritos */}
        {favorites.map((fav) => (
          <Marker
            key={fav.id}
            position={[fav.lat, fav.lng]}
            ref={(marker) => {
              if (marker) markerRefs.current[fav.id] = marker;
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{fav.name ?? "Local Favorito"}</p>
                <p className="text-xs text-gray-600">
                  {(fav.displayName ?? "Local salvo").split(",")[0]}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Marker temporário do local selecionado */}
        {selectedPosition && (
          <Marker position={selectedPosition} opacity={0.6}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Local selecionado</p>
                <p className="text-xs text-gray-600">
                  {selectedPosition.lat.toFixed(5)},{" "}
                  {selectedPosition.lng.toFixed(5)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        <LocationMarker
          setPosition={setSelectedPosition}
          clearMsg={clearMsg}
          resetNickname={() => setNickname("Local Favorito")}
        />
      </MapContainer>

      {/* Sheet / Card de salvar */}
      {selectedPosition && (
        <div
          className="
            absolute z-[1000]
            left-0 right-0 bottom-0
            md:left-6 md:right-auto md:bottom-6
          "
        >
          <div
            className="
              bg-white border border-gray-200 shadow-xl
              rounded-t-2xl md:rounded-2xl
              p-4
              mx-auto md:mx-0
              w-full md:w-[320px]
            "
            // garante que clicar no sheet não "vaze" para o listener externo
            onMouseDown={(e) => e.stopPropagation()}
          >
            <p className="font-bold text-gray-900 text-base md:text-lg">
              Local Selecionado
            </p>

            {msg && <p className="text-sm mt-2">{msg}</p>}

            <p className="text-[11px] text-gray-600 mt-1 mb-2">
              {selectedPosition.lat.toFixed(5)},{" "}
              {selectedPosition.lng.toFixed(5)}
            </p>

            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Apelido do local
            </label>

            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='Ex: "Casa", "Trabalho"'
            />

            <button
              onClick={handleSaveClickPosition}
              disabled={saving || alreadySaved}
              className={`w-full text-white px-4 py-2.5 rounded-lg transition text-sm md:text-base
                ${alreadySaved ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"}
                disabled:opacity-70 disabled:cursor-not-allowed
              `}
            >
              {alreadySaved
                ? "✓ Já está salvo"
                : saving
                ? "Salvando..."
                : "Adicionar aos Favoritos"}
            </button>

            <button
              type="button"
              onClick={closeSelection}
              className="w-full mt-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
