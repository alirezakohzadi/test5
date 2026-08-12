from django.contrib import admin
from .models import Product,ProductImage
class ProductImageInline(admin.TabularInline): model=ProductImage; extra=0; fields=('image','original_url','alt','sort_order','is_primary','wordpress_attachment_id')
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display=('id','name','sku','brand','category','price','discount_price','stock','is_active','is_featured','updated_at'); list_filter=('is_active','is_featured','is_popular','brand','category'); search_fields=('name','sku','barcode','slug'); autocomplete_fields=('brand','category'); readonly_fields=('created_at','updated_at'); inlines=[ProductImageInline]; list_select_related=('brand','category')
