import MapView from "./components/MapView";
import FavoritesList from "./components/FavoritesList";
import SearchBar from "./components/SearchBar";

function App() {
  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      {/* Coluna do mapa */}
      <div className="flex flex-col md:flex-1 min-w-0">
        <SearchBar />
        {/* no mobile: mapa com altura mínima boa */}
        <div className="flex-1 min-h-[360px]">
          <MapView />
        </div>
      </div>

      {/* Coluna da lista */}
      <div className="w-full md:w-[420px] lg:w-[480px] shrink-0 md:h-full">
        {/* no mobile: lista ocupa o "resto" e faz scroll */}
        <div className="h-[calc(100vh-360px-64px)] md:h-full">
          <FavoritesList />
        </div>
      </div>
    </div>
  );
}

export default App;
