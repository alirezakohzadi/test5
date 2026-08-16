import { apiClient } from './apiClient';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export interface SendOtpResponse {
  detail: string;
}

export interface AuthUserResponse {
  id: number | string;
  phone?: string;
  phone_number?: string;
  name?: string;
  walletBalance?: number;
}

export interface AuthTokenResponse {
  access_token?: string;
  refresh_token?: string;
  access?: string;
  refresh?: string;
  user: AuthUserResponse;
}

export const normalizeIranianMobile = (value: string): string => {
  const latinDigits = value
    .trim()
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)))
    .replace(/[\s\-()]/g, '');

  if (latinDigits.startsWith('0098')) {
    return `0${latinDigits.slice(4)}`;
  }

  if (latinDigits.startsWith('+98')) {
    return `0${latinDigits.slice(3)}`;
  }

  if (latinDigits.startsWith('98')) {
    return `0${latinDigits.slice(2)}`;
  }

  if (latinDigits.startsWith('9')) {
    return `0${latinDigits}`;
  }

  return latinDigits;
};

export const isValidIranianMobile = (value: string): boolean => /^09\d{9}$/.test(value);

export const authService = {
  sendOtp(phoneNumber: string): Promise<SendOtpResponse> {
    return apiClient.post<SendOtpResponse>('/auth/otp/send/', {
      phone_number: normalizeIranianMobile(phoneNumber),
    });
  },

  verifyOtp(phoneNumber: string, code: string): Promise<AuthTokenResponse> {
    return apiClient.post<AuthTokenResponse>('/auth/otp/verify/', {
      phone_number: normalizeIranianMobile(phoneNumber),
      code,
    });
  },
};
