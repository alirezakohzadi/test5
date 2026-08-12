from rest_framework import serializers
from .models import Order,OrderItem
class OrderItemInput(serializers.Serializer): product_id=serializers.IntegerField(); quantity=serializers.IntegerField(min_value=1)
class OrderCreateSerializer(serializers.Serializer): items=OrderItemInput(many=True); address=serializers.JSONField(); shipping_cost=serializers.IntegerField(default=0, min_value=0)
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta: model=OrderItem; fields=['product_name','sku','quantity','unit_price','line_total']
class OrderSerializer(serializers.ModelSerializer):
    items=OrderItemSerializer(many=True)
    class Meta: model=Order; fields=['id','items','total','discount','shipping_cost','payment_status','order_status','shipping_status','tracking_code','address','payment_reference','created_at','updated_at']
