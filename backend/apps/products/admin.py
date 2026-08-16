from django import forms
from django.contrib import admin
from django.utils.html import format_html

from .models import Product, ProductImage


class ProductAdminForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = "__all__"

    def clean_attributes(self):
        value = self.cleaned_data.get("attributes")
        return {} if value is None else value


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0
    fields = ("preview", "image", "original_url", "alt", "sort_order", "is_primary", "wordpress_attachment_id")
    readonly_fields = ("preview",)

    def preview(self, obj):
        url = ""
        if obj and obj.image:
            url = obj.image.url
        elif obj and obj.original_url:
            url = obj.original_url
        if not url:
            return "—"
        return format_html('<img src="{}" style="height:60px;width:60px;object-fit:cover;border-radius:4px;" />', url)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    list_display = ("id", "name", "sku", "brand", "category", "price", "discount_price", "stock", "is_active", "is_featured", "updated_at")
    list_filter = ("is_active", "is_featured", "is_popular", "brand", "category")
    search_fields = ("name", "sku", "barcode", "slug")
    autocomplete_fields = ("brand", "category")
    readonly_fields = ("created_at", "updated_at")
    inlines = [ProductImageInline]
    list_select_related = ("brand", "category")
