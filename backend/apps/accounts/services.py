import json
import logging
import secrets
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass

from django.conf import settings
from django.core.cache import cache
from django.utils import timezone

from .models import OTPCode

logger = logging.getLogger(__name__)

OTP_TTL_SECONDS = 120
OTP_RESEND_COOLDOWN_SECONDS = 60
OTP_MAX_ATTEMPTS = 5
OTP_SEND_LIMIT_SECONDS = 10 * 60
OTP_SEND_LIMIT_COUNT = 5
PAYAMAK_URL = "https://rest.payamak-panel.com/api/SendSMS/SendOtp"

class OTPRateLimitError(Exception):
    pass

class SMSDeliveryError(Exception):
    pass

def generate_otp():
    return f"{secrets.randbelow(1_000_000):06d}"

@dataclass
class PayamakOTPService:
    username: str | None = None
    password: str | None = None
    api_key: str | None = None
    sender: str | None = None
    timeout: int = 8

    def __post_init__(self):
        self.username = self.username if self.username is not None else getattr(settings, "PAYAMAK_USERNAME", "")
        self.password = self.password if self.password is not None else getattr(settings, "PAYAMAK_PASSWORD", "")
        self.api_key = self.api_key if self.api_key is not None else getattr(settings, "PAYAMAK_API_KEY", "")
        self.sender = self.sender if self.sender is not None else getattr(settings, "PAYAMAK_FROM", "")

    def send_otp(self, phone, code):
        if getattr(settings, "SMS_PROVIDER", "payamak") == "console":
            logger.info("OTP requested for %s using console SMS backend", phone)
            return {"status": "mocked"}
        password = self.password or self.api_key
        if not self.username or not password or not self.sender:
            if getattr(settings, "DEBUG", False):
                logger.warning("Payamak credentials are not configured; skipping SMS delivery in DEBUG")
                return {"status": "skipped"}
            raise SMSDeliveryError("SMS provider is not configured.")
        payload = urllib.parse.urlencode({
            "username": self.username,
            "password": password,
            "to": phone,
            "from": self.sender,
            "code": code,
        }).encode()
        request = urllib.request.Request(PAYAMAK_URL, data=payload, method="POST")
        request.add_header("Content-Type", "application/x-www-form-urlencoded")
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                raw = response.read().decode("utf-8")
        except (urllib.error.URLError, TimeoutError) as exc:
            raise SMSDeliveryError("SMS provider is unavailable.") from exc
        try:
            parsed = json.loads(raw)
        except ValueError:
            parsed = raw.strip()
        if isinstance(parsed, dict):
            status = str(parsed.get("RetStatus") or parsed.get("Value") or parsed.get("status") or "")
            if status and status not in {"1", "200", "success", "Success"}:
                raise SMSDeliveryError("SMS provider rejected the request.")
        elif parsed in {"", "0", "false", "False"}:
            raise SMSDeliveryError("SMS provider returned an invalid response.")
        return {"status": "sent"}

def create_and_send_otp(phone):
    cooldown_key = f"otp:cooldown:{phone}"
    limit_key = f"otp:send-count:{phone}"
    if cache.get(cooldown_key):
        raise OTPRateLimitError("Please wait before requesting another OTP.")
    count = cache.get(limit_key, 0)
    if count >= OTP_SEND_LIMIT_COUNT:
        raise OTPRateLimitError("Too many OTP requests. Please try again later.")
    code = generate_otp()
    OTPCode.objects.filter(phone_number=phone, is_used=False).update(is_used=True)
    otp = OTPCode.create_code(phone, code)
    try:
        PayamakOTPService().send_otp(phone, code)
    except Exception:
        otp.is_used = True
        otp.save(update_fields=["is_used"])
        raise
    cache.set(cooldown_key, True, OTP_RESEND_COOLDOWN_SECONDS)
    cache.set(limit_key, count + 1, OTP_SEND_LIMIT_SECONDS)
    return otp
