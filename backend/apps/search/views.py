from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.products.models import Product
from apps.products.serializers import ProductSerializer
from apps.categories.serializers import CategorySerializer
from apps.brands.serializers import BrandSerializer
from apps.categories.models import Category
from apps.brands.models import Brand
@api_view(['GET'])
def search(request):
    q=request.query_params.get('q','').strip(); products=Product.objects.none(); cats=Category.objects.none(); brands=Brand.objects.none()
    if q:
        products=Product.objects.filter(is_active=True).filter(Q(name__icontains=q)|Q(sku__icontains=q)|Q(brand__name__icontains=q)|Q(brand__persian_name__icontains=q)).select_related('brand','category').prefetch_related('images')[:24]
        cats=Category.objects.filter(is_active=True,name__icontains=q)[:8]; brands=Brand.objects.filter(is_active=True).filter(Q(name__icontains=q)|Q(persian_name__icontains=q))[:8]
    return Response({'query':q,'total_results':len(products)+len(cats)+len(brands),'products':ProductSerializer(products,many=True,context={'request':request}).data,'categories':CategorySerializer(cats,many=True,context={'request':request}).data,'brands':BrandSerializer(brands,many=True,context={'request':request}).data,'suggestions':[{'text':p.name,'type':'product'} for p in products[:5]]})
@api_view(['GET'])
def suggestions(request):
    q=request.query_params.get('q','').strip(); names=[]
    if q: names=list(Product.objects.filter(is_active=True,name__icontains=q).values_list('name',flat=True)[:10])
    return Response({'suggestions':names})
