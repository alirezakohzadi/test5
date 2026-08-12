from rest_framework import serializers
class SendOTPSerializer(serializers.Serializer): phone_number=serializers.CharField(max_length=20)
class VerifyOTPSerializer(serializers.Serializer): phone_number=serializers.CharField(max_length=20); code=serializers.CharField(max_length=8)
