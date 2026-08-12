from django.urls import path
from .views import CategoryList,CategoryDetail
urlpatterns=[path('categories/',CategoryList.as_view()),path('categories/<slug:slug>/',CategoryDetail.as_view())]
