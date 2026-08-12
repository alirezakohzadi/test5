from django.db.models import Q
from django_filters.rest_framework import FilterSet, filters
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer
class ProductFilter(FilterSet):
    category_slug=filters.CharFilter(field_name='category__slug'); brand_slug=filters.CharFilter(field_name='brand__slug'); min_price=filters.NumberFilter(method='filter_min_price'); max_price=filters.NumberFilter(method='filter_max_price'); in_stock=filters.BooleanFilter(method='filter_stock'); is_discounted=filters.BooleanFilter(method='filter_discounted')
    def filter_stock(self,qs,n,v): return qs.filter(stock__gt=0) if v else qs
    def filter_discounted(self,qs,n,v): return qs.filter(discount_price__isnull=False) if v else qs
    def filter_min_price(self,qs,n,v): return qs.filter(Q(discount_price__gte=v)|Q(discount_price__isnull=True,price__gte=v))
    def filter_max_price(self,qs,n,v): return qs.filter(Q(discount_price__lte=v)|Q(discount_price__isnull=True,price__lte=v))
    class Meta: model=Product; fields=[]
def qs(): return Product.objects.filter(is_active=True).select_related('brand','category').prefetch_related('images')

def requested_limit(request, default=12):
    for param in ('limit', 'page_size', 'max_products'):
        raw_value = request.query_params.get(param)
        if raw_value:
            try:
                return max(1, min(int(raw_value), 100))
            except (TypeError, ValueError):
                continue
    return default
class ProductList(generics.ListAPIView):
    serializer_class=ProductSerializer; filterset_class=ProductFilter; search_fields=['name','sku','barcode','brand__name','brand__persian_name']; ordering_fields=['price','rating','created_at','sales_count']; ordering=['-created_at']
    def get_queryset(self):
        q=qs(); order=self.request.query_params.get('ordering')
        if order=='popularity': q=q.order_by('-sales_count','-rating')
        return q
class ProductDetail(generics.RetrieveAPIView): serializer_class=ProductSerializer; lookup_field='slug'; queryset=qs()
@api_view(['GET'])
def related(request, slug):
    p=generics.get_object_or_404(qs(), slug=slug); data=qs().filter(Q(category=p.category)|Q(brand=p.brand)).exclude(id=p.id)[:12]
    return Response(ProductSerializer(data, many=True, context={'request':request}).data)
@api_view(['GET'])
def featured(request):
    limit=requested_limit(request)
    return Response(ProductSerializer(qs().filter(is_featured=True)[:limit], many=True, context={'request':request}).data)
@api_view(['GET'])
def new_arrivals(request):
    limit=requested_limit(request)
    return Response(ProductSerializer(qs().order_by('-created_at')[:limit], many=True, context={'request':request}).data)
@api_view(['GET'])
def best_sellers(request):
    limit=requested_limit(request)
    return Response(ProductSerializer(qs().order_by('-sales_count','-rating')[:limit], many=True, context={'request':request}).data)
