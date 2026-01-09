import axios from "axios";

export async function geocodeCityState(
  city: string,
  state: string
): Promise<{ latitude: number; longitude: number }> {
  const query = `${city}, ${state}, India`;

  const url = "https://nominatim.openstreetmap.org/search";

  const response = await axios.get(url, {
    params: {
      q: query,
      format: "json",
      limit: 1,
    },
    headers: {
      "User-Agent": "HealthCareSaaS/1.0 (contact@yourapp.com)",
    },
  });

  if (!response.data || response.data.length === 0) {
    throw new Error("Unable to geocode hospital location");
  }

  const result = response.data[0];

  return {
    latitude: Number(result.lat),
    longitude: Number(result.lon),
  };
}
