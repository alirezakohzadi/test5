from rest_framework import serializers
from .models import Brand
class BrandSerializer(serializers.ModelSerializer):
    logo_url=serializers.SerializerMethodField(); product_count=serializers.IntegerField(read_only=True)
    class Meta: model=Brand; fields=['id','name','persian_name','slug','logo_url','description','is_popular','product_count','seo_title','seo_description','canonical_url','og_image']
    def get_logo_url(self,o): return o.logo.url if o.logo else ''
