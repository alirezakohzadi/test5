from django.db import models
from apps.common.models import TimeStampedModel
class Cart(TimeStampedModel):
    user=models.OneToOneField('accounts.User', null=True, blank=True, related_name='cart', on_delete=models.CASCADE); session_key=models.CharField(max_length=80, blank=True, db_index=True)
class CartItem(TimeStampedModel):
    cart=models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE); product=models.ForeignKey('products.Product', on_delete=models.CASCADE); quantity=models.PositiveIntegerField(default=1)
    class Meta: unique_together=(('cart','product'),)
