from rest_framework import serializers
from .models import Article
class ArticleSerializer(serializers.ModelSerializer):
    image_url=serializers.SerializerMethodField(); category_name=serializers.CharField(source='category.name'); category_slug=serializers.CharField(source='category.slug'); published_at=serializers.DateTimeField(format='%Y-%m-%d'); author=serializers.SerializerMethodField(); schema_json=serializers.SerializerMethodField()
    class Meta: model=Article; fields=['id','title','slug','summary','content','image_url','category_name','category_slug','read_time','author','published_at','updated_at','seo_title','seo_description','canonical_url','og_image','meta_keywords','schema_json']
    def get_image_url(self,o): return o.image.url if o.image else ''
    def get_author(self,o): return {'name': o.author.get_full_name() or o.author.username, 'role':'نویسنده', 'avatar_url':''} if o.author else {'name':'تیم تحریریه نوژاشاپ','role':'کارشناس سلامت','avatar_url':''}
    def get_schema_json(self,o): return {'@context':'https://schema.org','@type':'Article','headline':o.title}
