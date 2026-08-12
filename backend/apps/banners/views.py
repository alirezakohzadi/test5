from django.db.models import Q
from django.utils import timezone
from rest_framework import generics

from .models import Banner
from .serializers import BannerSerializer


class BannerList(generics.ListAPIView):
    serializer_class = BannerSerializer
    pagination_class = None

    def get_queryset(self):
        now = timezone.now()
        active_param = self.request.query_params.get("is_active")
        include_inactive = (
            active_param is not None
            and self.request.user.is_authenticated
            and self.request.user.is_staff
        )

        queryset = Banner.objects.all() if include_inactive else Banner.objects.filter(is_active=True)

        if active_param is not None and include_inactive:
            queryset = queryset.filter(is_active=active_param.lower() in ("1", "true", "yes"))

        if not include_inactive:
            queryset = queryset.filter(
                Q(start_date__isnull=True) | Q(start_date__lte=now),
                Q(end_date__isnull=True) | Q(end_date__gte=now),
            )

        position = self.request.query_params.get("position")
        if position:
            queryset = queryset.filter(position=position)

        return queryset.order_by("position", "order", "id")
