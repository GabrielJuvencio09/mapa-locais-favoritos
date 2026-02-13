export default async function handler(req, res) {
  try {
    const lat = (req.query.lat || "").toString();
    const lon = (req.query.lon || req.query.lng || "").toString();

    if (!lat || !lon) {
      return res.status(400).json({ error: "Missing query params: lat and lon" });
    }

    const url =
      "https://nominatim.openstreetmap.org/reverse?" +
      new URLSearchParams({
        lat,
        lon,
        format: "json",
      });

    const r = await fetch(url, {
      headers: {
        "User-Agent": "mapa-locais-favoritos (vercel serverless)",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
      },
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).send(text);
    }

    const data = await r.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Internal error" });
  }
}
