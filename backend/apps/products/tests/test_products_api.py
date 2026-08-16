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
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
import io
from apps.products.models import ProductImage


def image_file(name='test.jpg', fmt='JPEG'):
    buf = io.BytesIO(); Image.new('RGB', (10, 10), 'red').save(buf, fmt); buf.seek(0)
    return SimpleUploadedFile(name, buf.read(), content_type='image/jpeg')

@pytest.mark.django_db
def test_product_image_upload_multiple_primary_and_api_absolute_url(client, settings, tmp_path):
    settings.MEDIA_ROOT = tmp_path
    b=Brand.objects.create(name='Brand2',slug='brand2'); c=Category.objects.create(name='Cat2',slug='cat2')
    p=Product.objects.create(name='Pimg',slug='pimg',sku='simg',brand=b,category=c,price=100,stock=2,is_active=True)
    ProductImage.objects.create(product=p, image=image_file('a.jpg'), alt='A', is_primary=False, sort_order=2)
    ProductImage.objects.create(product=p, image=image_file('b.jpg'), alt='B', is_primary=True, sort_order=1)
    r=client.get('/api/v1/products/pimg/')
    assert r.status_code == 200
    data = r.json()
    assert data['image_url'].startswith('http://testserver/media/products/gallery/')
    assert len(data['images']) == 2
    ProductImage.objects.filter(product=p, is_primary=True).delete()
    assert ProductImage.objects.filter(product=p).count() == 1

@pytest.mark.django_db
def test_product_image_invalid_extension_rejected():
    b=Brand.objects.create(name='Brand3',slug='brand3'); c=Category.objects.create(name='Cat3',slug='cat3')
    p=Product.objects.create(name='Pbad',slug='pbad',sku='sbad',brand=b,category=c,price=100,stock=2,is_active=True)
    img = ProductImage(product=p, image=SimpleUploadedFile('bad.gif', b'bad', content_type='image/gif'))
    with pytest.raises(Exception):
        img.full_clean()

@pytest.mark.django_db
def test_existing_original_url_compatibility(client):
    b=Brand.objects.create(name='Brand4',slug='brand4'); c=Category.objects.create(name='Cat4',slug='cat4')
    p=Product.objects.create(name='Purl',slug='purl',sku='surl',brand=b,category=c,price=100,stock=2,is_active=True)
    ProductImage.objects.create(product=p, original_url='https://cdn.example.com/x.jpg', is_primary=True)
    assert client.get('/api/v1/products/purl/').json()['image_url'] == 'https://cdn.example.com/x.jpg'
