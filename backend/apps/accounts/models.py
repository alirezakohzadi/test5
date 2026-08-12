from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta
class User(AbstractUser):
    phone_number=models.CharField(max_length=20, unique=True, null=True, blank=True, db_index=True); wallet_balance=models.PositiveBigIntegerField(default=0)
class OTPCode(models.Model):
    phone_number=models.CharField(max_length=20, db_index=True); code=models.CharField(max_length=8); created_at=models.DateTimeField(auto_now_add=True); expires_at=models.DateTimeField(); is_used=models.BooleanField(default=False)
    def is_valid(self): return (not self.is_used) and self.expires_at >= timezone.now()
    @classmethod
    def create_code(cls, phone, code): return cls.objects.create(phone_number=phone, code=code, expires_at=timezone.now()+timedelta(minutes=5))
