from rest_framework import serializers
from .models import Banner
class BannerSerializer(serializers.ModelSerializer):
    image_url=serializers.SerializerMethodField(); mobile_image_url=serializers.SerializerMethodField(); link_url=serializers.CharField(source='link')
    class Meta: model=Banner; fields=['id','title','subtitle','image_url','mobile_image_url','link_url','position','order','is_active','badge_text','button_text']
    def get_image_url(self,o): return o.image.url if o.image else ''
    def get_mobile_image_url(self,o): return o.mobile_image.url if o.mobile_image else ''
