from django.contrib import admin

from .models import NavbarItem


@admin.register(NavbarItem)
class NavbarItemAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "parent", "order", "is_active", "url")
    list_filter = ("is_active", "parent")
    search_fields = ("title", "slug", "url")
    autocomplete_fields = ("parent",)
    list_editable = ("order", "is_active")
    ordering = ("order", "id")
