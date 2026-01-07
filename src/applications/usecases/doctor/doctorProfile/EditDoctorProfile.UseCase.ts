import { IDoctorRepository } from "../../../../domain/repositories/IDoctor.repo";
import { IUserRepository } from "../../../../domain/repositories/IUser.repo";
import { IImageProcessor } from "../../../../domain/services/ImageProcess.service";
import { IFileStorage } from "../../../../domain/storage/IFile.storage";

interface DoctorProfileInput {
  fullName: string;
  mobile: string;
  bio: string;
  experienceYears: number | string;
  consultationFee: number | string;
}

export class EditDoctorProfileUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly doctorRepo: IDoctorRepository,
    private readonly fileStorage: IFileStorage,
    private readonly imageProcessor: IImageProcessor
  ) {}

  async execute(
    doctorId: string,
    userId: string,
    input: DoctorProfileInput,
    file?: Express.Multer.File
  ) {
    const doctorProfileUpdate: any = {};

    if (input.experienceYears) {
      doctorProfileUpdate.experienceYears = Number(input.experienceYears);
    }

    if (input.consultationFee) {
      doctorProfileUpdate.consultationFee = Number(input.consultationFee);
    }
    if (input.bio) {
      doctorProfileUpdate.bio = input.bio;
    }

    const userUpdate: any = {
      name: input.fullName,
      phone: input.mobile,
    };

    if (file) {
      console.log("does this works");
      const processedImage = await this.imageProcessor.process(file.buffer);

      console.log("The processedImage is ", processedImage);

      const key = `public/doctor/images/${doctorId}/${Date.now()}.jpg`;

      const imageUrl = await this.fileStorage.uploadImage({
        buffer: processedImage,
        mimeType: "image/jpeg",
        key,
      });

      userUpdate.profileImage = imageUrl;
    }

    await this.userRepo.updateUser({
      _id: userId,
      ...userUpdate,
    });

    await this.doctorRepo.updateById(doctorId, {
      ...doctorProfileUpdate,
    });

    return {
      message: "Doctor profile updated successfully",
    };
  }
}
