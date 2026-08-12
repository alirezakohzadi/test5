from django.db import models
from apps.common.models import TimeStampedModel, SEOMetadataMixin
class Category(TimeStampedModel, SEOMetadataMixin):
    name=models.CharField(max_length=180); slug=models.SlugField(max_length=220, unique=True, db_index=True, allow_unicode=True)
    parent=models.ForeignKey('self', null=True, blank=True, related_name='children', on_delete=models.CASCADE, db_index=True)
    image=models.ImageField(upload_to='categories/', blank=True); description=models.TextField(blank=True); icon=models.CharField(max_length=80, blank=True); badge=models.CharField(max_length=80, blank=True)
    is_active=models.BooleanField(default=True, db_index=True); is_featured=models.BooleanField(default=False, db_index=True); sort_order=models.PositiveIntegerField(default=0)
    wordpress_id=models.BigIntegerField(null=True, blank=True, unique=True)
    class Meta: ordering=('sort_order','name'); indexes=[models.Index(fields=['parent','is_active'])]
    def __str__(self): return self.name
