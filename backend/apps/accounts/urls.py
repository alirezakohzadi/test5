from django.urls import path
from .views import otp_send,otp_verify
urlpatterns=[path('auth/otp/send/',otp_send),path('auth/otp/verify/',otp_verify)]
