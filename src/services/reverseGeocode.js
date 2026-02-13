export async function reverseGeocode(lat, lng) {
  const url =
    "/api/reverse?" +
    new URLSearchParams({
      lat: String(lat),
      lon: String(lng),
    });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro reverse: ${res.status}`);

  const data = await res.json();
  return data.display_name ?? "Local salvo";
}
