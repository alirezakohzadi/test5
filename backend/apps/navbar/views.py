from collections import defaultdict

from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, SAFE_METHODS

from .models import NavbarItem
from .serializers import NavbarItemSerializer


class PublicReadAdminWritePermission(IsAdminUser):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return super().has_permission(request, view)


class NavbarItemViewSet(viewsets.ModelViewSet):
    serializer_class = NavbarItemSerializer
    permission_classes = [PublicReadAdminWritePermission]
    pagination_class = None
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        queryset = NavbarItem.objects.select_related("parent").order_by("order", "id")
        if self.request.method in SAFE_METHODS:
            return queryset.filter(is_active=True)
        return queryset

    def list(self, request, *args, **kwargs):
        active_items = list(self.get_queryset())
        children_map = defaultdict(list)
        roots = []
        active_ids = {item.id for item in active_items}
        for item in active_items:
            if item.parent_id and item.parent_id in active_ids:
                children_map[item.parent_id].append(item)
            elif item.parent_id is None:
                roots.append(item)
        serializer = self.get_serializer(roots, many=True, context={"request": request, "children_map": children_map})
        from rest_framework.response import Response
        return Response(serializer.data)
