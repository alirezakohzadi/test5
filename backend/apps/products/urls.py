from django.urls import path
from . import views
urlpatterns=[path('products/',views.ProductList.as_view()),path('products/featured/',views.featured),path('products/new-arrivals/',views.new_arrivals),path('products/best-sellers/',views.best_sellers),path('products/<slug:slug>/',views.ProductDetail.as_view()),path('products/<slug:slug>/related/',views.related)]
