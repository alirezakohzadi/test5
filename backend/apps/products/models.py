from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.common.models import TimeStampedModel, SEOMetadataMixin
class Product(TimeStampedModel, SEOMetadataMixin):
    name=models.CharField(max_length=255, db_index=True); slug=models.SlugField(max_length=280, unique=True, db_index=True, allow_unicode=True)
    description=models.TextField(blank=True); short_description=models.TextField(blank=True); sku=models.CharField(max_length=100, unique=True, db_index=True); barcode=models.CharField(max_length=64, blank=True, db_index=True)
    price=models.PositiveBigIntegerField(db_index=True); discount_price=models.PositiveBigIntegerField(null=True, blank=True, db_index=True); stock=models.PositiveIntegerField(default=0, db_index=True); is_active=models.BooleanField(default=True, db_index=True)
    brand=models.ForeignKey('brands.Brand', related_name='products', on_delete=models.PROTECT, db_index=True); category=models.ForeignKey('categories.Category', related_name='products', on_delete=models.PROTECT, db_index=True)
    attributes=models.JSONField(default=dict, blank=True); volume_or_size=models.CharField(max_length=120, blank=True); usage_instructions=models.TextField(blank=True); ingredients=models.TextField(blank=True)
    rating=models.DecimalField(max_digits=3, decimal_places=2, default=0, validators=[MinValueValidator(0),MaxValueValidator(5)], db_index=True); review_count=models.PositiveIntegerField(default=0)
    sales_count=models.PositiveIntegerField(default=0, db_index=True); is_featured=models.BooleanField(default=False, db_index=True); is_popular=models.BooleanField(default=False, db_index=True); is_golden_offer=models.BooleanField(default=False, db_index=True); badge=models.CharField(max_length=80, blank=True); bg_glow_color=models.CharField(max_length=80, blank=True)
    wordpress_id=models.BigIntegerField(null=True, blank=True, unique=True)
    class Meta: ordering=('-created_at',); indexes=[models.Index(fields=['is_active','category','brand']),models.Index(fields=['is_active','price']),models.Index(fields=['is_active','stock']),models.Index(fields=['is_featured','is_active'])]
    @property
    def effective_price(self): return self.discount_price or self.price
    @property
    def in_stock(self): return self.stock > 0
    @property
    def discount_percentage(self):
        return round((self.price-self.discount_price)*100/self.price) if self.discount_price and self.price else 0
    def __str__(self): return self.name
class ProductImage(TimeStampedModel):
    product=models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE); image=models.ImageField(upload_to='products/original/', blank=True); original_url=models.URLField(blank=True); webp_image=models.ImageField(upload_to='products/webp/', blank=True); alt=models.CharField(max_length=255, blank=True); sort_order=models.PositiveIntegerField(default=0); is_primary=models.BooleanField(default=False, db_index=True); wordpress_attachment_id=models.BigIntegerField(null=True, blank=True, db_index=True)
    class Meta: ordering=('sort_order','id'); indexes=[models.Index(fields=['product','is_primary','sort_order'])]
