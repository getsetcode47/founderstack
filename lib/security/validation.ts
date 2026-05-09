export function normalizeEmail(value: unknown) {
  return String(value ?? '').trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePasswordStrength(password: string) {
  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return 'Password must include at least one letter and one number.';
  }

  return null;
}
