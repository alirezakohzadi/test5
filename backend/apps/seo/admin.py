from django.contrib import admin
from .models import PageMeta
@admin.register(PageMeta)
class PageMetaAdmin(admin.ModelAdmin): list_display=('path','title','robots'); search_fields=('path','title')
