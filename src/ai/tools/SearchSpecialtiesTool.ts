import * as z from "zod";
import { tool } from "@langchain/core/tools";
import { Types } from "mongoose";
import { IGetAvailableSpecialityUseCase } from "../../domain/usecase/patient/DoctorListing/IGetAvailableSpecialityUseCase";

export type Specialty = { _id: string | Types.ObjectId; name: string };

export class SearchSpecialtiesTool {
  constructor(private useCase: IGetAvailableSpecialityUseCase) {}

  build() {
    const schema = z.object({}); // No args

    return tool(
      async (): Promise<string> => {
        try {
          const specialties: Specialty[] = await this.useCase.execute();
          return JSON.stringify({
            success: true,
            data: specialties,
            message:
              specialties.length === 0
                ? "No specialties available"
                : `Found ${specialties.length} specialties.`,
          });
        } catch (err: any) {
          return JSON.stringify({ success: false, error: err?.message });
        }
      },
      {
        name: "search_specialties",
        description: "Get all available hospital specialties from DB.",
        schema,
      }
    );
  }
}
