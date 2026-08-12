from django.db import models
from django.utils import timezone

from apps.common.models import TimeStampedModel


LEGACY_POSITION_CHOICES = [
    ('hero', 'hero'),
    ('quick_access', 'quick_access'),
    ('specialized', 'specialized'),
    ('splash', 'splash'),
    ('row', 'row'),
    ('bottom', 'bottom'),
    ('sidebar', 'sidebar'),
    ('offers_top', 'offers_top'),
    ('offers_golden', 'offers_golden'),
    ('new_arrivals_top', 'new_arrivals_top'),
    ('new_arrivals_bottom', 'new_arrivals_bottom'),
    ('bestsellers_vertical', 'bestsellers_vertical'),
]

FRONTEND_POSITION_CHOICES = [
    ('main_slider', 'main_slider'),
    ('main_side', 'main_side'),
    ('supplements_row', 'supplements_row'),
    ('new_arrivals_vertical', 'new_arrivals_vertical'),
    ('new_arrivals_full_1', 'new_arrivals_full_1'),
    ('new_arrivals_double', 'new_arrivals_double'),
    ('new_arrivals_quad', 'new_arrivals_quad'),
    ('new_arrivals_full_2', 'new_arrivals_full_2'),
    ('specialized_care', 'specialized_care'),
    ('most_popular_top_row1', 'most_popular_top_row1'),
    ('most_popular_top_row2', 'most_popular_top_row2'),
    ('most_popular_top', 'most_popular_top'),
    ('best_sellers_vertical', 'best_sellers_vertical'),
    ('most_popular_bottom_quad', 'most_popular_bottom_quad'),
    ('most_popular_bottom', 'most_popular_bottom'),
    ('bottom_row', 'bottom_row'),
]


class Banner(TimeStampedModel):
    POSITION_CHOICES = LEGACY_POSITION_CHOICES + FRONTEND_POSITION_CHOICES

    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='banners/')
    mobile_image = models.ImageField(upload_to='banners/mobile/', blank=True)
    link = models.CharField(max_length=500, blank=True)
    position = models.CharField(max_length=32, choices=POSITION_CHOICES, db_index=True)
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    badge_text = models.CharField(max_length=80, blank=True)
    button_text = models.CharField(max_length=80, blank=True)

    class Meta:
        ordering = ('position', 'order')

    @property
    def is_currently_active(self):
        now = timezone.now()
        return self.is_active and (not self.start_date or self.start_date <= now) and (not self.end_date or self.end_date >= now)
