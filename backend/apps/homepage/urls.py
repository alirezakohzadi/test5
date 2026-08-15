from django.urls import path

from .views import ProductGroupList, ProductSectionList, QuickAccessItemList

urlpatterns = [
    path("homepage/quick-access/", QuickAccessItemList.as_view(), name="homepage-quick-access"),
    path("homepage/product-sections/", ProductSectionList.as_view(), name="homepage-product-sections"),
    path("homepage/product-groups/", ProductGroupList.as_view(), name="homepage-product-groups"),
]
