from django import forms
from django.contrib import admin

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
    fields = ("image", "original_url", "alt", "sort_order", "is_primary", "wordpress_attachment_id")


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
