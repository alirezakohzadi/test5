from django.db import models
from rest_framework import serializers

from apps.products.models import Product
from apps.products.serializers import ProductSerializer
from .models import ProductGroup, ProductSection, QuickAccessItem


def build_absolute(request, url):
    if request and url and url.startswith("/"):
        return request.build_absolute_uri(url)
    return url or ""


class QuickAccessItemSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    link_url = serializers.CharField(source="url", read_only=True)

    class Meta:
        model = QuickAccessItem
        fields = ["id", "title", "subtitle", "icon", "image", "image_url", "url", "link_url", "order", "is_active", "badge"]
        read_only_fields = ["image_url", "link_url"]

    def get_image_url(self, obj):
        return build_absolute(self.context.get("request"), obj.image.url if obj.image else "")


class ProductSectionSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source="section_type", read_only=True)
    products = serializers.SerializerMethodField()

    class Meta:
        model = ProductSection
        fields = ["id", "title", "slug", "subtitle", "type", "section_type", "badge", "display_type", "order", "is_active", "max_products", "products"]

    def get_products(self, obj):
        products = self.context.get("section_products", {}).get(obj.id)
        if products is None:
            products = resolve_section_products(obj)
        return ProductSerializer(products, many=True, context=self.context).data


class ProductGroupSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    products = serializers.SerializerMethodField()

    class Meta:
        model = ProductGroup
        fields = ["id", "title", "slug", "description", "image", "image_url", "icon", "order", "is_active", "products"]
        read_only_fields = ["image_url", "products"]

    def get_image_url(self, obj):
        if obj.image:
            return build_absolute(self.context.get("request"), obj.image.url)
        return obj.icon

    def get_products(self, obj):
        products = obj.products.filter(is_active=True).select_related("brand", "category").prefetch_related("images")
        return ProductSerializer(products, many=True, context=self.context).data


def active_products():
    return Product.objects.filter(is_active=True).select_related("brand", "category").prefetch_related("images")


def resolve_section_products(section):
    explicit = section.products.filter(is_active=True).select_related("brand", "category").prefetch_related("images")
    if explicit.exists():
        return explicit[: section.max_products]

    qs = active_products()
    if section.section_type == ProductSection.NEW_ARRIVALS:
        qs = qs.order_by("-created_at", "-id")
    elif section.section_type == ProductSection.BEST_SELLERS:
        qs = qs.order_by("-sales_count", "-rating", "-review_count", "-id")
    elif section.section_type == ProductSection.MOST_POPULAR:
        qs = qs.filter(is_popular=True).order_by("-sales_count", "-rating", "-review_count", "-id")
    elif section.section_type == ProductSection.OFFERS:
        qs = qs.filter(discount_price__isnull=False, discount_price__lt=models.F("price")).order_by("-is_golden_offer", "discount_price", "-created_at", "-id")
    elif section.section_type == ProductSection.HIGHLIGHTS:
        qs = qs.filter(is_featured=True).order_by("-is_golden_offer", "-sales_count", "-rating", "-created_at", "-id")
    return qs[: section.max_products]
