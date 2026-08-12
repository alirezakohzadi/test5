from collections import defaultdict

from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, SAFE_METHODS
from rest_framework.response import Response

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
        include_inactive = (
            self.request.query_params.get("include_inactive") in ("1", "true", "yes")
            and self.request.user.is_authenticated
            and self.request.user.is_staff
        )
        if self.request.method in SAFE_METHODS and not include_inactive:
            return queryset.filter(is_active=True)
        return queryset

    def list(self, request, *args, **kwargs):
        items = list(self.get_queryset())
        children_map = defaultdict(list)
        roots = []
        item_ids = {item.id for item in items}

        for item in items:
            if item.parent_id and item.parent_id in item_ids:
                children_map[item.parent_id].append(item)
            elif item.parent_id is None:
                roots.append(item)

        serializer = self.get_serializer(
            roots,
            many=True,
            context={"request": request, "children_map": children_map},
        )
        return Response(serializer.data)
