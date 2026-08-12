from django.contrib import admin
from .models import Brand
@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin): list_display=('name','persian_name','slug','is_active','is_popular','sort_order'); list_filter=('is_active','is_popular'); search_fields=('name','persian_name','slug')
