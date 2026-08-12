import pytest
from apps.brands.models import Brand
from apps.categories.models import Category
from apps.products.models import Product
@pytest.mark.django_db
def test_product_list_pagination_and_filter(client):
    b=Brand.objects.create(name='Brand',slug='brand'); c=Category.objects.create(name='Cat',slug='cat')
    Product.objects.create(name='P1',slug='p1',sku='s1',brand=b,category=c,price=100,stock=2,is_active=True)
    Product.objects.create(name='P2',slug='p2',sku='s2',brand=b,category=c,price=200,stock=0,is_active=True)
    r=client.get('/api/v1/products/', {'page_size':1,'in_stock':'true','category_slug':'cat'})
    assert r.status_code==200; assert r.json()['count']==1; assert r.json()['results'][0]['slug']=='p1'
@pytest.mark.django_db
def test_product_detail(client):
    b=Brand.objects.create(name='Brand',slug='brand'); c=Category.objects.create(name='Cat',slug='cat'); Product.objects.create(name='P1',slug='p1',sku='s1',brand=b,category=c,price=100,stock=2,is_active=True)
    assert client.get('/api/v1/products/p1/').json()['sku']=='s1'
