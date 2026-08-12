from rest_framework import serializers
from .models import Product, ProductImage
class MiniBrandSerializer(serializers.Serializer):
    id=serializers.IntegerField(); name=serializers.CharField(); persian_name=serializers.CharField(allow_blank=True); slug=serializers.CharField()
class MiniCategorySerializer(serializers.Serializer):
    id=serializers.IntegerField(); name=serializers.CharField(); slug=serializers.CharField()
class ProductSerializer(serializers.ModelSerializer):
    brand=MiniBrandSerializer(read_only=True); category=MiniCategorySerializer(read_only=True); image_url=serializers.SerializerMethodField(); gallery_images=serializers.SerializerMethodField(); original_price=serializers.IntegerField(source='price'); price=serializers.IntegerField(source='effective_price'); discount_percentage=serializers.IntegerField(); in_stock=serializers.BooleanField(); stock_quantity=serializers.IntegerField(source='stock'); rating_count=serializers.IntegerField(source='review_count'); is_new=serializers.SerializerMethodField(); schema_json=serializers.SerializerMethodField()
    class Meta:
        model=Product; fields=['id','slug','name','sku','barcode','brand','category','image_url','gallery_images','price','original_price','discount_percentage','in_stock','stock_quantity','volume_or_size','rating','rating_count','is_new','is_popular','is_golden_offer','badge','description','short_description','usage_instructions','ingredients','attributes','sales_count','bg_glow_color','seo_title','seo_description','canonical_url','og_image','meta_keywords','schema_json','created_at','updated_at']
    def get_image_url(self,obj):
        img=obj.images.filter(is_primary=True).first() or obj.images.first(); req=self.context.get('request')
        if not img: return ''
        url=img.original_url or (img.image.url if img.image else '')
        return req.build_absolute_uri(url) if req and url.startswith('/') else url
    def get_gallery_images(self,obj): return [i.original_url or (i.image.url if i.image else '') for i in obj.images.all()]
    def get_is_new(self,obj): return False
    def get_schema_json(self,obj): return {'@context':'https://schema.org','@type':'Product','name':obj.name,'sku':obj.sku}
