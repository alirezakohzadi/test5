from rest_framework import generics

from .models import ProductGroup, ProductSection, QuickAccessItem
from .serializers import ProductGroupSerializer, ProductSectionSerializer, QuickAccessItemSerializer


class QuickAccessItemList(generics.ListAPIView):
    serializer_class = QuickAccessItemSerializer
    pagination_class = None

    def get_queryset(self):
        return QuickAccessItem.objects.filter(is_active=True).order_by("order", "id")


class ProductSectionList(generics.ListAPIView):
    serializer_class = ProductSectionSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = ProductSection.objects.filter(is_active=True).prefetch_related("products__brand", "products__category", "products__images")
        section_type = self.request.query_params.get("type") or self.request.query_params.get("section_type")
        slug = self.request.query_params.get("slug")
        if section_type:
            queryset = queryset.filter(section_type=section_type)
        if slug:
            queryset = queryset.filter(slug=slug)
        return queryset.order_by("order", "id")


class ProductGroupList(generics.ListAPIView):
    serializer_class = ProductGroupSerializer
    pagination_class = None

    def get_queryset(self):
        return ProductGroup.objects.filter(is_active=True).prefetch_related("products__brand", "products__category", "products__images").order_by("order", "id")
