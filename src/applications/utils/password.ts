import crypto from "crypto";

export function generatePlainPassword(length = 10): string {
  if (length < 8) {
    throw new Error("Password length must be at least 8 characters");
  }

  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";

  const allChars = letters + numbers;

  let password = "";

  for (let i = 0; i < length; i++) {
    const index = crypto.randomInt(0, allChars.length);
    password += allChars[index];
  }

  return password;
}
