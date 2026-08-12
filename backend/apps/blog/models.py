from django.db import models
from apps.common.models import TimeStampedModel, SEOMetadataMixin
class BlogCategory(TimeStampedModel, SEOMetadataMixin):
    name=models.CharField(max_length=160); slug=models.SlugField(max_length=200, unique=True, allow_unicode=True)
    def __str__(self): return self.name
class Article(TimeStampedModel, SEOMetadataMixin):
    title=models.CharField(max_length=255); slug=models.SlugField(max_length=280, unique=True, db_index=True, allow_unicode=True); summary=models.TextField(); content=models.TextField(); image=models.ImageField(upload_to='blog/', blank=True); author=models.ForeignKey('accounts.User', null=True, blank=True, on_delete=models.SET_NULL); category=models.ForeignKey(BlogCategory, related_name='articles', on_delete=models.PROTECT); read_time=models.CharField(max_length=50, default='۵ دقیقه'); is_published=models.BooleanField(default=True, db_index=True); published_at=models.DateTimeField(null=True, blank=True, db_index=True); wordpress_id=models.BigIntegerField(null=True, blank=True, unique=True)
    class Meta: ordering=('-published_at','-created_at')
