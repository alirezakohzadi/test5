from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User,OTPCode
@admin.register(User)
class CustomUserAdmin(UserAdmin): list_display=('username','phone_number','email','is_staff','wallet_balance'); search_fields=('username','phone_number','email')
@admin.register(OTPCode)
class OTPAdmin(admin.ModelAdmin): list_display=('phone_number','code','created_at','expires_at','is_used'); list_filter=('is_used',); search_fields=('phone_number',)
