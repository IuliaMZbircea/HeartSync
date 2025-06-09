export default function calculateAge(birthDate: Date | string | undefined): number {
  if (!birthDate) {
    return 0;
  }

  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= 0 ? age : 0;
}
