import { Types } from "mongoose";
import { IPatientProfileRepository } from "../../../../domain/repositories/IPatientProfileRepository";
import { IUserRepository } from "../../../../domain/repositories/IUser.repo";
import { IImageProcessor } from "../../../../domain/services/ImageProcess.service";
import { IFileStorage } from "../../../../domain/storage/IFile.storage";

export interface PatientProfileInputDTO {
  fullName: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  height: number;
  weight: number;
  state: string;
  city: string;
  pincode: string;
  address: string;
}

export class EditPatientProfileUseCase {
  constructor(
    private readonly _UserRepo: IUserRepository,
    private readonly _PatientProfileRepositry: IPatientProfileRepository,
    private readonly fileStorage: IFileStorage,
    private readonly imageProcessor: IImageProcessor
  ) {}

  async execute(userId: string, input: PatientProfileInputDTO, file?: Express.Multer.File) {
    const userUpdate: any = {
      name: input.fullName,
      phone: input.mobile,
      dob: input.dateOfBirth,
      gender: input.gender,
    };

    if (file) {
      console.log("does this works");
      const processedImage = await this.imageProcessor.process(file.buffer);

      console.log("The processedImage is ", processedImage);

      const key = `public/patient/images/${userId}/${Date.now()}.jpg`;

      const imageUrl = await this.fileStorage.uploadPublicImage({
        buffer: processedImage,
        mimeType: "image/jpeg",
        key,
      });

      userUpdate.profileImage = imageUrl;
    }

    const result = await this._UserRepo.updateUser({
      _id: userId,
      ...userUpdate,
    });

    console.log("the result", result);

    const updatedProfile = await this._PatientProfileRepositry.updateByUserId(userId, {
      userId: new Types.ObjectId(userId),
      address: {
        state: input.state,
        addressLine: input.address,
        city: input.city,
        pincode: input.pincode,
      },
      height: input.height,
      weight: input.weight,
      bloodGroup: input.bloodGroup,
    });

    console.log("The updated patient profile", updatedProfile);
    return {
      message: "Doctor profile updated successfully",
    };
  }
}
