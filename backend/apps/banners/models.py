from django.db import models
from django.utils import timezone
from apps.common.models import TimeStampedModel
class Banner(TimeStampedModel):
    POSITION_CHOICES=[(x,x) for x in ['hero','quick_access','specialized','splash','row','bottom','sidebar','offers_top','offers_golden','new_arrivals_top','new_arrivals_vertical','new_arrivals_bottom','bestsellers_vertical']]
    title=models.CharField(max_length=200); subtitle=models.CharField(max_length=255, blank=True); image=models.ImageField(upload_to='banners/'); mobile_image=models.ImageField(upload_to='banners/mobile/', blank=True); link=models.CharField(max_length=500, blank=True); position=models.CharField(max_length=32, choices=POSITION_CHOICES, db_index=True); order=models.PositiveIntegerField(default=0, db_index=True); is_active=models.BooleanField(default=True, db_index=True); start_date=models.DateTimeField(null=True, blank=True); end_date=models.DateTimeField(null=True, blank=True); badge_text=models.CharField(max_length=80, blank=True); button_text=models.CharField(max_length=80, blank=True)
    class Meta: ordering=('position','order')
    @property
    def is_currently_active(self):
        now=timezone.now(); return self.is_active and (not self.start_date or self.start_date<=now) and (not self.end_date or self.end_date>=now)
