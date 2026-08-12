import pytest
from apps.brands.models import Brand
from apps.categories.models import Category
from apps.products.models import Product
@pytest.mark.django_db
def test_search(client):
    b=Brand.objects.create(name='Derma',slug='derma'); c=Category.objects.create(name='Skin',slug='skin'); Product.objects.create(name='کرم ضد لک',slug='cream',sku='sku',brand=b,category=c,price=10,stock=1)
    r=client.get('/api/v1/search/', {'q':'کرم'}); assert r.status_code==200; assert r.json()['total_results']>=1
