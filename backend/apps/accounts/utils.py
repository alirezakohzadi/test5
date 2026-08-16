import re
from django.core.exceptions import ValidationError

IRAN_PHONE_RE = re.compile(r"^09\d{9}$")

def normalize_iranian_phone_number(value: str) -> str:
    if not value:
        raise ValidationError("Phone number is required.")
    digits = re.sub(r"\D", "", str(value).strip())
    if digits.startswith("0098"):
        digits = "0" + digits[4:]
    elif digits.startswith("98"):
        digits = "0" + digits[2:]
    elif digits.startswith("9") and len(digits) == 10:
        digits = "0" + digits
    if not IRAN_PHONE_RE.match(digits):
        raise ValidationError("Enter a valid Iranian mobile phone number.")
    return digits
