from datetime import timedelta

from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True, db_index=True)
    wallet_balance = models.PositiveBigIntegerField(default=0)


class OTPCode(models.Model):
    phone_number = models.CharField(max_length=20, db_index=True)
    code = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    attempts = models.PositiveSmallIntegerField(default=0)

    class Meta:
        indexes = [models.Index(fields=["phone_number", "is_used", "created_at"])]

    def is_valid(self):
        return (not self.is_used) and self.expires_at >= timezone.now() and self.attempts < 5

    def verify(self, raw_code):
        if not self.is_valid():
            return False
        self.attempts += 1
        ok = check_password(raw_code, self.code) or raw_code == self.code  # raw comparison supports legacy pre-hash OTP rows
        if ok:
            self.is_used = True
        self.save(update_fields=["attempts", "is_used"])
        return ok

    @classmethod
    def create_code(cls, phone, code):
        return cls.objects.create(
            phone_number=phone,
            code=make_password(code),
            expires_at=timezone.now() + timedelta(minutes=2),
        )
