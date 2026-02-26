import * as z from "zod";
import { tool } from "@langchain/core/tools";
import { IDoctorSearchUseCase } from "../../domain/usecase/patient/DoctorListing/IDoctorSearchUseCase";
import { DoctorSearchQueryDTO } from "../../applications/dtos/patient/doctor.search.Dto";

export class SearchDoctorsTool {
  constructor(private useCase: IDoctorSearchUseCase) {}

  build() {
    const schema = z.object({
      search: z.string().optional().describe("Symptoms, doctor/hospital/specialty name"),
      specialtyId: z.string().optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
      radiusKm: z.number().default(50),
      page: z.number().default(1),
      limit: z.number().default(5),
      sortBy: z.enum(["rating", "price", "experience"]).optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
    });

    return tool(
      async (input: z.infer<typeof schema>): Promise<string> => {
        if (!input.lat || !input.lng) {
          return JSON.stringify({
            success: false,
            error: "Location (lat/lng) required for search. Ask user for city.",
          });
        }
        try {
          const result = await this.useCase.execute(input as DoctorSearchQueryDTO);
          return JSON.stringify({
            success: true,
            data: result,
            message:
              result.items.length === 0
                ? "No doctors found — try different search?"
                : `Found ${result.items.length} doctors.`,
          });
        } catch (err) {
          return JSON.stringify({ success: false, error: err.message });
        }
      },
      {
        name: "search_doctors",
        description: "Search doctors by symptoms/name/specialty/location. Requires lat/lng.",
        schema,
      }
    );
  }
}
