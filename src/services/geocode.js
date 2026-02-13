export async function geocodeAddress(query) {
  const url =
    "/api/geocode?" +
    new URLSearchParams({
      q: query,
      limit: "8",
    });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro geocode: ${res.status}`);

  const data = await res.json();

  return data.map((item) => ({
    id: item.place_id,
    displayName: item.display_name,
    lat: Number(item.lat),
    lng: Number(item.lon),
  }));
}
