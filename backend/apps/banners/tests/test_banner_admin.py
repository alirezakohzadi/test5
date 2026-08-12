import pytest
from django.contrib import admin

from apps.banners.admin import BannerAdmin
from apps.banners.models import Banner, FRONTEND_POSITION_CHOICES


@pytest.mark.django_db
def test_banner_model_position_choices_include_all_frontend_positions():
    model_choices = dict(Banner._meta.get_field("position").choices)

    for value, label in FRONTEND_POSITION_CHOICES:
        assert model_choices[value] == label


@pytest.mark.django_db
def test_banner_admin_uses_banner_model_position_choices(rf):
    banner_admin = admin.site._registry[Banner]

    assert isinstance(banner_admin, BannerAdmin)

    form = banner_admin.get_form(rf.get("/admin/apps/banners/banner/add/"))
    form_choices = dict(form.base_fields["position"].choices)

    for value, label in FRONTEND_POSITION_CHOICES:
        assert form_choices[value] == label
