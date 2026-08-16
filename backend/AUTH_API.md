# Authentication API

All auth endpoints return the existing JWT shape: `access_token`, `refresh_token`, `access`, `refresh`, and a safe `user` object.

## POST `/api/v1/auth/register/`
Request:
```json
{"phone_number":"09123456789","password":"StrongPassword123!","password_confirm":"StrongPassword123!"}
```
Response `201`:
```json
{"access_token":"...","refresh_token":"...","user":{"id":1,"phone_number":"09123456789"}}
```

## POST `/api/v1/auth/login/`
Request:
```json
{"phone_number":"09123456789","password":"StrongPassword123!"}
```
Invalid credentials return a generic error and never reveal whether the phone or password failed.

## POST `/api/v1/auth/otp/send/`
Request:
```json
{"phone_number":"09123456789"}
```
Response:
```json
{"detail":"OTP sent"}
```
The OTP is six digits, hashed in the database, expires after about two minutes, is rate limited, and is never returned or logged.

## POST `/api/v1/auth/otp/verify/`
Request:
```json
{"phone_number":"09123456789","code":"123456"}
```
Response uses the same JWT shape as registration/login. Verification marks the OTP as used and creates the user when necessary.

Melli Payamak credentials are read from `PAYAMAK_USERNAME`, `PAYAMAK_PASSWORD`, `PAYAMAK_API_KEY`, and `PAYAMAK_FROM`.
