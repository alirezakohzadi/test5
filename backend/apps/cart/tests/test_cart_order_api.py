import pytest
from apps.accounts.models import User
from apps.brands.models import Brand
from apps.categories.models import Category
from apps.products.models import Product
@pytest.mark.django_db
def test_order_snapshots_price(client):
    u=User.objects.create_user(username='u',password='p'); client.force_login(u); b=Brand.objects.create(name='B',slug='b'); c=Category.objects.create(name='C',slug='c'); p=Product.objects.create(name='P',slug='p',sku='sku',brand=b,category=c,price=100,discount_price=80,stock=2)
    r=client.post('/api/v1/orders/', {'items':[{'product_id':p.id,'quantity':1}], 'address':{'city':'تهران'}, 'shipping_cost':10}, content_type='application/json')
    assert r.status_code==201; assert r.json()['items'][0]['unit_price']==80; assert r.json()['total']==90
