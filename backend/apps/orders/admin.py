from django.contrib import admin
from .models import Order,OrderItem
class OrderItemInline(admin.TabularInline): model=OrderItem; extra=0; readonly_fields=('product_name','sku','quantity','unit_price','line_total')
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin): list_display=('id','user','total','payment_status','order_status','shipping_status','tracking_code','created_at'); list_filter=('payment_status','order_status','shipping_status'); search_fields=('id','tracking_code','user__phone_number'); inlines=[OrderItemInline]
