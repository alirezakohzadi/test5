from django.db import models
class TimeStampedModel(models.Model):
    created_at=models.DateTimeField(auto_now_add=True, db_index=True); updated_at=models.DateTimeField(auto_now=True)
    class Meta: abstract=True
class SEOMetadataMixin(models.Model):
    seo_title=models.CharField(max_length=255, blank=True); seo_description=models.TextField(blank=True); canonical_url=models.URLField(blank=True); og_image=models.URLField(blank=True); meta_keywords=models.CharField(max_length=500, blank=True)
    class Meta: abstract=True
