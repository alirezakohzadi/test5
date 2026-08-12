from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Cart,CartItem
from .serializers import CartSerializer
@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def cart_view(request):
    cart,_=Cart.objects.get_or_create(user=request.user)
    if request.method=='POST':
        items=request.data.get('items',[])
        if items: cart.items.all().delete()
        for item in items:
            ci,_=CartItem.objects.get_or_create(cart=cart, product_id=item['product_id'], defaults={'quantity':item.get('quantity',1)})
            ci.quantity=item.get('quantity',ci.quantity); ci.save()
    return Response(CartSerializer(cart, context={'request':request}).data)
