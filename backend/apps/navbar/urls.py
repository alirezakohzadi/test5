from rest_framework.routers import DefaultRouter

from .views import NavbarItemViewSet

router = DefaultRouter(trailing_slash=True)
router.register("navbar", NavbarItemViewSet, basename="navbar")

urlpatterns = router.urls
