import random
from django.conf import settings
from .models import OTPCode
class SMSService:
    def send_otp(self, phone, code):
        if settings.SMS_PROVIDER == 'console': print(f'OTP for {phone}: {code}')
def generate_otp(): return ''.join(random.choice('0123456789') for _ in range(5))
def send_otp(phone):
    code=generate_otp(); OTPCode.create_code(phone, code); SMSService().send_otp(phone, code); return code
