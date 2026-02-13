export async function geocodeAddress(query) {
  const url =
    "/nominatim/search?" +
    new URLSearchParams({
      q: query,
      format: "json",
      addressdetails: "1",
      limit: "8",
    });

  const res = await fetch(url, {
    method: "GET",
    // NÃO coloque User-Agent aqui no browser
  });

  if (!res.ok) {
    throw new Error(`Erro Nominatim: ${res.status}`);
  }

  const data = await res.json();

  return data.map((item) => ({
    id: item.place_id,
    displayName: item.display_name,
    lat: Number(item.lat),
    lng: Number(item.lon),
  }));
}
