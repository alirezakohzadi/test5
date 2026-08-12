from django.db.models import Count
from rest_framework import generics
from .models import Brand
from .serializers import BrandSerializer
class BrandList(generics.ListAPIView): serializer_class=BrandSerializer; pagination_class=None; queryset=Brand.objects.filter(is_active=True).annotate(product_count=Count('products'))
class BrandDetail(generics.RetrieveAPIView): serializer_class=BrandSerializer; lookup_field='slug'; queryset=Brand.objects.filter(is_active=True).annotate(product_count=Count('products'))
