import * as z from "zod";
import { tool } from "langchain";
import { WinstonLogger } from "../../infrastructure/services/logger/WinstonLogger";

const logger = new WinstonLogger();

// Quick hardcoded map for common Kerala cities (fast & free)
const CITY_COORDS_MAP: Record<string, { lat: number; lng: number }> = {
  ernakulam: { lat: 9.98, lng: 76.27 },
  kochi: { lat: 9.98, lng: 76.27 },
  thrissur: { lat: 10.53, lng: 76.21 },
  kozhikode: { lat: 11.26, lng: 75.78 },
  calicut: { lat: 11.26, lng: 75.78 },
  trivandrum: { lat: 8.52, lng: 76.94 },
  thiruvananthapuram: { lat: 8.52, lng: 76.94 },
  kottayam: { lat: 9.59, lng: 76.52 },
  kollam: { lat: 8.89, lng: 76.61 },
  alappuzha: { lat: 9.5, lng: 76.34 },
  pathanamthitta: { lat: 9.26, lng: 76.79 },
  idukki: { lat: 9.84, lng: 76.94 },
  kasaragod: { lat: 12.5, lng: 75.0 },
  malappuram: { lat: 11.07, lng: 76.07 },
  palakkad: { lat: 10.79, lng: 76.65 },
  wayanad: { lat: 11.6, lng: 76.08 },
  aluva: { lat: 10.11, lng: 76.35 },
  muvattupuzha: { lat: 9.98, lng: 76.57 },
  thiruvalla: { lat: 9.38, lng: 76.57 },
  perumbavoor: { lat: 10.1, lng: 76.47 },
  kannur: { lat: 11.87, lng: 75.38 },
  // Add more cities
};

export class GeocodeCityTool {
  build() {
    const schema = z.object({
      city: z.string().min(2).describe("City or area name, e.g. 'Ernakulam' or 'Muvattupuzha'"),
      state: z.string().default("Kerala").describe("State, usually Kerala"),
    });

    return tool(
      async ({ city, state }: z.infer<typeof schema>) => {
        try {
          // Step 1: Check quick map (fast, no network)
          const normalizedCity = city.toLowerCase().trim().replace(/\s+/g, "");
          const quickCoords = CITY_COORDS_MAP[normalizedCity];

          if (quickCoords) {
            logger.info(`Quick map hit for city: ${city}`);
            return JSON.stringify({
              success: true,
              lat: quickCoords.lat,
              lng: quickCoords.lng,
              source: "quick-map",
              message: `Found coordinates for ${city} using internal map.`,
            });
          }

          // Step 2: Use free Nominatim API (OpenStreetMap) — no key needed
          const query = encodeURIComponent(`${city}, ${state}, India`);
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;

          const response = await fetch(url, {
            headers: {
              "User-Agent": "HealthcareAI/1.0 (contact: your-email@example.com)", // Nominatim requires this
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
          }

          const data = await response.json();

          if (data && data.length > 0) {
            const result = data[0];
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);

            logger.info(`Nominatim geocoded ${city}: lat=${lat}, lng=${lng}`);

            return JSON.stringify({
              success: true,
              lat,
              lng,
              source: "nominatim-api",
              message: `Found coordinates for ${city} via free map service.`,
            });
          }

          // If nothing found
          return JSON.stringify({
            success: false,
            error: "Could not find exact coordinates for this city.",
            suggestion:
              "Try a larger nearby city (e.g., Ernakulam instead of small village), or provide approximate lat/long.",
          });
        } catch (err: any) {
          logger.error(`GeocodeCityTool failed for ${city}: ${err.message}`);
          return JSON.stringify({
            success: false,
            error: "Geocoding service is having issues right now.",
            suggestion: "Please provide a major city name or approximate coordinates.",
          });
        }
      },
      {
        name: "geocode_city",
        description:
          "Convert a city name (especially in Kerala) to latitude and longitude for doctor search. Uses internal map first, then free public API if needed.",
        schema,
      }
    );
  }
}
