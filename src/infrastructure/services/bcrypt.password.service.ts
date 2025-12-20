import bcrypt from "bcrypt";
import { IPasswordService } from "../../domain/services/password.interface.service";

class PasswordService implements IPasswordService {
  async hash(password: string, round: number = 10) {
    return await bcrypt.hash(password, round);
  }

  async compare(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
