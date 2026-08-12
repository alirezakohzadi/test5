from django.utils import timezone
from rest_framework import generics
from .models import Banner
from .serializers import BannerSerializer
class BannerList(generics.ListAPIView):
    serializer_class=BannerSerializer; pagination_class=None
    def get_queryset(self):
        now=timezone.now(); q=Banner.objects.filter(is_active=True).filter(start_date__isnull=True)|Banner.objects.filter(is_active=True,start_date__lte=now); q=q.filter(end_date__isnull=True)|q.filter(end_date__gte=now); pos=self.request.query_params.get('position'); return q.filter(position=pos) if pos else q.order_by('position','order')
