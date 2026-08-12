from django.db.models import Count
from rest_framework import generics
from .models import Category
from .serializers import CategorySerializer
class CategoryList(generics.ListAPIView):
    serializer_class=CategorySerializer; pagination_class=None
    def get_queryset(self): return Category.objects.filter(is_active=True,parent__isnull=True).annotate(product_count=Count('products')).prefetch_related('children')
class CategoryDetail(generics.RetrieveAPIView): serializer_class=CategorySerializer; lookup_field='slug'; queryset=Category.objects.filter(is_active=True).annotate(product_count=Count('products'))
