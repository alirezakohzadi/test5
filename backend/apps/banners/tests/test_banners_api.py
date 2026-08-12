import pytest
from django.core.files.base import ContentFile

from apps.banners.models import Banner


@pytest.mark.django_db
def test_banner_position_filter_supports_new_frontend_positions(client):
    Banner.objects.create(
        title="Main slider",
        image=ContentFile(b"image", name="main.jpg"),
        position="main_slider",
        order=2,
    )
    Banner.objects.create(
        title="Popular row",
        image=ContentFile(b"image", name="popular.jpg"),
        position="most_popular_top_row1",
        order=1,
    )

    response = client.get("/api/v1/banners/", {"position": "main_slider"})

    assert response.status_code == 200
    assert [item["position"] for item in response.json()] == ["main_slider"]
    assert response.json()[0]["title"] == "Main slider"


@pytest.mark.django_db
def test_public_banner_api_hides_inactive_items(client):
    Banner.objects.create(
        title="Hidden",
        image=ContentFile(b"image", name="hidden.jpg"),
        position="bottom_row",
        is_active=False,
    )

    response = client.get("/api/v1/banners/", {"position": "bottom_row"})

    assert response.status_code == 200
    assert response.json() == []
