import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString();
}

export function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

export function extractLocation(ip: string): string {
  // In production, use a geolocation API
  // For now, return a placeholder
  return 'Unknown Location';
}

export function calculateSecurityScore(data: {
  hasBreaches: boolean;
  breachCount: number;
  recentScans: number;
  activeSessions: number;
}): number {
  let score = 100;
  
  if (data.hasBreaches) {
    score -= Math.min(data.breachCount * 10, 40);
  }
  
  if (data.activeSessions > 5) {
    score -= 10;
  }
  
  if (data.recentScans === 0) {
    score -= 15;
  }
  
  return Math.max(score, 0);
}
