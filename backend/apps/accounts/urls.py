from django.urls import path
from .views import login, otp_send, otp_verify, register
urlpatterns = [
    path('auth/register/', register),
    path('auth/login/', login),
    path('auth/otp/send/', otp_send),
    path('auth/otp/verify/', otp_verify),
]
