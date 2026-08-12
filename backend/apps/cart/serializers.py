from rest_framework import serializers
from .models import Cart,CartItem
from apps.products.models import Product
from apps.products.serializers import ProductSerializer
class CartItemSerializer(serializers.ModelSerializer):
    product=ProductSerializer(read_only=True); product_id=serializers.PrimaryKeyRelatedField(source='product', queryset=Product.objects.filter(is_active=True), write_only=True); line_total=serializers.SerializerMethodField()
    class Meta: model=CartItem; fields=['id','product','product_id','quantity','line_total']
    def get_line_total(self,o): return o.product.effective_price*o.quantity
class CartSerializer(serializers.ModelSerializer):
    items=CartItemSerializer(many=True); subtotal=serializers.SerializerMethodField(); total=serializers.SerializerMethodField()
    class Meta: model=Cart; fields=['id','items','subtotal','total','updated_at']
    def get_subtotal(self,o): return sum(i.product.effective_price*i.quantity for i in o.items.select_related('product'))
    def get_total(self,o): return self.get_subtotal(o)
