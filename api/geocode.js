export default async function handler(req, res) {
  try {
    const q = (req.query.q || "").toString().trim();
    const limit = (req.query.limit || "8").toString();

    if (!q) {
      return res.status(400).json({ error: "Missing query param: q" });
    }

    const url =
      "https://nominatim.openstreetmap.org/search?" +
      new URLSearchParams({
        q,
        format: "json",
        addressdetails: "1",
        limit,
      });

    const r = await fetch(url, {
      headers: {
        // Importante: Nominatim pede identificação do app
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
