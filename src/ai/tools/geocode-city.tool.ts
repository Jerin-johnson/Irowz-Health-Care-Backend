import * as z from "zod";
import { tool } from "langchain";
import { WinstonLogger } from "../../infrastructure/services/logger/WinstonLogger";

const logger = new WinstonLogger();

// Quick hardcoded map for common Kerala cities (fast & free)
export const CITY_COORDS_MAP: Record<string, { lat: number; lng: number }> = {
  // Major cities / Corporations
  ernakulam: { lat: 9.98, lng: 76.27 },
  kochi: { lat: 9.98, lng: 76.27 }, // Also known as Cochin
  kozhikode: { lat: 11.26, lng: 75.78 },
  calicut: { lat: 11.26, lng: 75.78 }, // Alternative name for Kozhikode
  thiruvananthapuram: { lat: 8.52, lng: 76.94 },
  trivandrum: { lat: 8.52, lng: 76.94 }, // Alternative name
  kollam: { lat: 8.89, lng: 76.61 }, // Quilon
  thrissur: { lat: 10.53, lng: 76.21 }, // Trichur
  kannur: { lat: 11.87, lng: 75.38 },

  // Other important district headquarters and towns
  alappuzha: { lat: 9.49, lng: 76.33 }, // Alleppey
  alleppey: { lat: 9.49, lng: 76.33 },
  kottayam: { lat: 9.59, lng: 76.52 },
  palakkad: { lat: 10.77, lng: 76.65 }, // Palghat
  malappuram: { lat: 11.04, lng: 76.08 },
  kasaragod: { lat: 12.5, lng: 75.0 }, // Kasargod
  pathanamthitta: { lat: 9.26, lng: 76.79 },
  idukki: { lat: 9.84, lng: 77.15 }, // Painavu area approx (district HQ)
  wayanad: { lat: 11.72, lng: 76.08 }, // Kalpetta approx (district HQ)

  // Additional major towns / municipalities
  angamaly: { lat: 10.19, lng: 76.38 }, // As you requested – near Kochi Airport
  aluva: { lat: 10.11, lng: 76.35 }, // Already in your list
  muvattupuzha: { lat: 9.98, lng: 76.57 }, // Already in your list
  perumbavoor: { lat: 10.13, lng: 76.48 }, // Slightly adjusted from your 10.1 / 76.47
  thiruvalla: { lat: 9.38, lng: 76.57 }, // Already in your list
  changanassery: { lat: 9.45, lng: 76.52 },
  kayamkulam: { lat: 9.18, lng: 76.5 }, // Kayankulam
  cherthala: { lat: 9.68, lng: 76.34 },
  shoranur: { lat: 10.76, lng: 76.27 },
  thalassery: { lat: 11.75, lng: 75.49 }, // Tellicherry
  vatakara: { lat: 11.61, lng: 75.59 }, // Badagara
  payyanur: { lat: 12.09, lng: 75.2 },
  taliparamba: { lat: 12.04, lng: 75.36 },
  ponnani: { lat: 10.77, lng: 75.92 },
  guruvayur: { lat: 10.59, lng: 76.04 },
  chavakkad: { lat: 10.58, lng: 76.0 },
  kanhangad: { lat: 12.34, lng: 75.1 }, // Kannangad
  nilambur: { lat: 11.28, lng: 76.25 },
  mananthavady: { lat: 11.8, lng: 76.0 }, // Wayanad area
  sulthanbathery: { lat: 11.67, lng: 76.27 }, // Sultan Battery
  munnar: { lat: 10.09, lng: 77.06 }, // Popular hill station
  thekkady: { lat: 9.44, lng: 77.16 }, // Periyar wildlife area
  kovalam: { lat: 8.4, lng: 76.98 }, // Famous beach
  varkala: { lat: 8.74, lng: 76.72 }, // Cliff beach town

  // More if needed (smaller but notable)
  nedumangad: { lat: 8.61, lng: 77.0 },
  attingal: { lat: 8.7, lng: 76.99 },
  paravur: { lat: 10.15, lng: 76.21 }, // North Paravur
  kodungallur: { lat: 10.22, lng: 76.2 },
  irinjalakuda: { lat: 10.34, lng: 76.21 },
  chalakudy: { lat: 10.31, lng: 76.34 },
  kunnamkulam: { lat: 10.65, lng: 76.08 },
  tirur: { lat: 11.15, lng: 75.92 },
  perinthalmanna: { lat: 10.98, lng: 76.23 },
  kondotty: { lat: 11.15, lng: 75.96 },
  manjeri: { lat: 11.12, lng: 76.12 },
  kunnamangalam: { lat: 11.3, lng: 75.88 },
  vadakara: { lat: 11.61, lng: 75.59 }, // Duplicate of Vatakara
  // Add more cities/towns as needed...
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
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "";
          logger.error(`GeocodeCityTool failed for ${city}: ${message}`);
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
