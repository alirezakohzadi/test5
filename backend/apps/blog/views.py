from rest_framework import generics
from .models import Article
from .serializers import ArticleSerializer
class ArticleList(generics.ListAPIView):
    serializer_class=ArticleSerializer
    def get_queryset(self):
        q=Article.objects.filter(is_published=True).select_related('category','author')
        slug=self.request.query_params.get('category_slug')
        return q.filter(category__slug=slug) if slug else q
class ArticleDetail(generics.RetrieveAPIView): serializer_class=ArticleSerializer; lookup_field='slug'; queryset=Article.objects.filter(is_published=True).select_related('category','author')
