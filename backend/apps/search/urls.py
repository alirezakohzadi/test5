from django.urls import path
from .views import search,suggestions
urlpatterns=[path('search/',search),path('search/suggestions/',suggestions)]
