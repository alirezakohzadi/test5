from django.urls import path
from .views import BrandList,BrandDetail
urlpatterns=[path('brands/',BrandList.as_view()),path('brands/<slug:slug>/',BrandDetail.as_view())]
