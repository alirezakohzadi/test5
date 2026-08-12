from django.db import models
from apps.common.models import TimeStampedModel, SEOMetadataMixin
class Brand(TimeStampedModel, SEOMetadataMixin):
    name=models.CharField(max_length=180); persian_name=models.CharField(max_length=180, blank=True); slug=models.SlugField(max_length=220, unique=True, db_index=True, allow_unicode=True)
    logo=models.ImageField(upload_to='brands/', blank=True); description=models.TextField(blank=True); is_active=models.BooleanField(default=True, db_index=True); is_popular=models.BooleanField(default=False, db_index=True); sort_order=models.PositiveIntegerField(default=0)
    wordpress_id=models.BigIntegerField(null=True, blank=True, unique=True)
    class Meta: ordering=('sort_order','name')
    def __str__(self): return self.persian_name or self.name
