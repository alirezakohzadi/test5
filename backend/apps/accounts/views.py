from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import OTPCode, User
from .serializers import SendOTPSerializer, VerifyOTPSerializer
from .services import send_otp
@api_view(['POST'])
def otp_send(request):
    s=SendOTPSerializer(data=request.data); s.is_valid(raise_exception=True); send_otp(s.validated_data['phone_number']); return Response({'detail':'OTP sent'})
@api_view(['POST'])
def otp_verify(request):
    s=VerifyOTPSerializer(data=request.data); s.is_valid(raise_exception=True); phone=s.validated_data['phone_number']; code=s.validated_data['code']
    otp=OTPCode.objects.filter(phone_number=phone,code=code,is_used=False).order_by('-created_at').first()
    if not otp or not otp.is_valid(): return Response({'detail':'Invalid or expired code'}, status=400)
    otp.is_used=True; otp.save(update_fields=['is_used']); user,_=User.objects.get_or_create(phone_number=phone, defaults={'username':phone}); refresh=RefreshToken.for_user(user)
    return Response({'access_token':str(refresh.access_token),'refresh_token':str(refresh),'user':{'id':user.id,'phone':phone,'name':user.get_full_name() or user.username,'walletBalance':user.wallet_balance}})
