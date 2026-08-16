from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import OTPCode, User
from .serializers import LoginSerializer, RegisterSerializer, SendOTPSerializer, VerifyOTPSerializer
from .services import SMSDeliveryError, OTPRateLimitError, create_and_send_otp


def token_response(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {"id": user.id, "phone": user.phone_number, "phone_number": user.phone_number, "name": user.get_full_name() or user.username, "walletBalance": user.wallet_balance},
    }

@api_view(["POST"])
def register(request):
    s = RegisterSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    data = s.validated_data
    username = data.get("username") or data["phone_number"]
    user = User(username=username, phone_number=data["phone_number"], email=data.get("email", ""))
    user.set_password(data["password"])
    user.save()
    return Response(token_response(user), status=status.HTTP_201_CREATED)

@api_view(["POST"])
def login(request):
    s = LoginSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    phone = s.validated_data["phone_number"]
    try:
        user = User.objects.get(phone_number=phone)
    except User.DoesNotExist:
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(request, username=user.username, password=s.validated_data["password"])
    if not user:
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
    return Response(token_response(user))

@api_view(["POST"])
def otp_send(request):
    s = SendOTPSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    try:
        create_and_send_otp(s.validated_data["phone_number"])
    except OTPRateLimitError as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_429_TOO_MANY_REQUESTS)
    except SMSDeliveryError:
        return Response({"detail": "Unable to send OTP at this time."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    return Response({"detail": "OTP sent"})

@api_view(["POST"])
def otp_verify(request):
    s = VerifyOTPSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    phone = s.validated_data["phone_number"]
    otp = OTPCode.objects.filter(phone_number=phone, is_used=False).order_by("-created_at").first()
    if not otp or not otp.verify(s.validated_data["code"]):
        return Response({"detail": "Invalid or expired code"}, status=status.HTTP_400_BAD_REQUEST)
    user, created = User.objects.get_or_create(phone_number=phone, defaults={"username": phone})
    if created:
        user.set_unusable_password(); user.save(update_fields=["password"])
    return Response(token_response(user))
