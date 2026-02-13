export async function reverseGeocode(lat, lng) {
  const url =
    "https://nominatim.openstreetmap.org/reverse?" +
    new URLSearchParams({
      lat: String(lat),
      lon: String(lng),
      format: "json",
    });

  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha no reverse geocode");

  const data = await res.json();
  return data.display_name ?? "Local salvo";
}
