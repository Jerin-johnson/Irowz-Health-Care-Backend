// import * as z from "zod";
import { tool } from "@langchain/core/tools";
import { IGetProfileUseCase } from "../../domain/usecase/patient/Profile&settings/IGetProfileUseCase";
import { PatientProfileDTO } from "../../applications/mapper/patientProfile.mapper";

export class GetProfileTool {
  constructor(private useCase: IGetProfileUseCase) {} // Manual new in factory

  build(userId: string) {
    // const schema = z.object({
    //   userId: z.string().describe("User ID from session"),
    // });
    // { userId }: z.infer<typeof schema>
    return tool(
      async (): Promise<string> => {
        try {
          console.log("is this invoked");
          const profile: PatientProfileDTO = await this.useCase.execute(userId);
          console.log("the userId", userId, profile);
          return JSON.stringify({
            success: true,
            data: profile,
            complete: !!profile.city && !!profile.state && !!profile.fullName,
            message: profile ? "Profile ready" : "Profile incomplete — ask for missing fields.",
          });
        } catch (err: any) {
          return JSON.stringify({ success: false, error: err.message });
        }
      },
      {
        name: "get_profile",
        description: "Get patient profile for name, location, etc. Ask if incomplete.",
      }
    );
  }
}
