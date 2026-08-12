from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.products.models import Product
from apps.categories.models import Category
from apps.blog.models import Article
@api_view(['GET'])
def sitemap(request):
    base=settings.SITE_DOMAIN.rstrip('/'); urls=[{'loc':base+'/','changefreq':'daily','priority':1.0},{'loc':base+'/shop','changefreq':'daily','priority':0.9}]
    urls += [{'loc':f'{base}/categories/{c.slug}','lastmod':c.updated_at.date().isoformat(),'changefreq':'weekly','priority':0.8} for c in Category.objects.filter(is_active=True)[:50000]]
    urls += [{'loc':f'{base}/products/{p.slug}','lastmod':p.updated_at.date().isoformat(),'changefreq':'weekly','priority':0.7} for p in Product.objects.filter(is_active=True).only('slug','updated_at')[:50000]]
    urls += [{'loc':f'{base}/blog/{a.slug}','lastmod':a.updated_at.date().isoformat(),'changefreq':'monthly','priority':0.6} for a in Article.objects.filter(is_published=True)[:50000]]
    return Response({'urls':urls})
