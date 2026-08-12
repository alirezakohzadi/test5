from django.contrib import admin
from .models import Category
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin): list_display=('name','slug','parent','is_active','is_featured','sort_order'); list_filter=('is_active','is_featured'); search_fields=('name','slug'); autocomplete_fields=('parent',)
