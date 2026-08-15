from django.contrib import admin

from .models import ProductGroup, ProductSection, QuickAccessItem


@admin.register(QuickAccessItem)
class QuickAccessItemAdmin(admin.ModelAdmin):
    list_display = ("title", "subtitle", "order", "is_active", "url")
    list_filter = ("is_active",)
    search_fields = ("title", "subtitle", "url", "badge")
    list_editable = ("order", "is_active")
    ordering = ("order", "id")


@admin.register(ProductSection)
class ProductSectionAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "section_type", "max_products", "order", "is_active")
    list_filter = ("section_type", "display_type", "is_active")
    search_fields = ("title", "slug", "subtitle", "badge")
    list_editable = ("max_products", "order", "is_active")
    filter_horizontal = ("products",)
    ordering = ("order", "id")


@admin.register(ProductGroup)
class ProductGroupAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title", "slug", "description")
    list_editable = ("order", "is_active")
    filter_horizontal = ("products",)
    ordering = ("order", "id")
