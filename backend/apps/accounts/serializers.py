from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import User
from .utils import normalize_iranian_phone_number

class PhoneSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    def validate_phone_number(self, value):
        try:
            return normalize_iranian_phone_number(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages)

class SendOTPSerializer(PhoneSerializer):
    pass

class VerifyOTPSerializer(PhoneSerializer):
    code = serializers.RegexField(r"^\d{6}$", max_length=6)

class RegisterSerializer(PhoneSerializer):
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
    password_confirm = serializers.CharField(write_only=True, style={"input_type": "password"})
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        validate_password(attrs["password"])
        if User.objects.filter(phone_number=attrs["phone_number"]).exists():
            raise serializers.ValidationError({"phone_number": "A user with this phone number already exists."})
        username = attrs.get("username")
        if username and User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "A user with this username already exists."})
        return attrs

class LoginSerializer(PhoneSerializer):
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
