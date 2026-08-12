from django.urls import path
from .views import ArticleList,ArticleDetail
urlpatterns=[path('blog/articles/',ArticleList.as_view()),path('blog/articles/<slug:slug>/',ArticleDetail.as_view())]
