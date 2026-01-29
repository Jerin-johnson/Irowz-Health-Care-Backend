export function calculateAge(dateOfBirth?: string): number {
  if (!dateOfBirth) return 0;

  const dob = new Date(dateOfBirth);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);

  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm) return 0;

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  return Number(bmi.toFixed(1));
}
