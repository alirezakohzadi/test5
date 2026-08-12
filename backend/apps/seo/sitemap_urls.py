from django.urls import path
from .sitemap_views import sitemap
urlpatterns=[path('',sitemap),path('v1/',sitemap)]
