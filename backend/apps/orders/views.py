from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.products.models import Product
from apps.payments.services import PaymentGateway
from .models import Order,OrderItem
from .serializers import OrderCreateSerializer,OrderSerializer
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    s=OrderCreateSerializer(data=request.data); s.is_valid(raise_exception=True)
    with transaction.atomic():
        order=Order.objects.create(user=request.user,address=s.validated_data['address'],shipping_cost=s.validated_data.get('shipping_cost',0))
        total=0
        for item in s.validated_data['items']:
            p=Product.objects.select_for_update().get(id=item['product_id'],is_active=True)
            if p.stock < item['quantity']: return Response({'detail':f'Insufficient stock for {p.name}'}, status=400)
            unit=p.effective_price; line=unit*item['quantity']; total+=line; p.stock-=item['quantity']; p.sales_count+=item['quantity']; p.save(update_fields=['stock','sales_count'])
            OrderItem.objects.create(order=order,product=p,product_name=p.name,sku=p.sku,quantity=item['quantity'],unit_price=unit,line_total=line)
        order.total=total+order.shipping_cost; pay=PaymentGateway().create_payment(order); order.payment_reference=pay.get('authority',''); order.save()
    data=OrderSerializer(order).data; data['payment']=pay; return Response(data, status=201)
