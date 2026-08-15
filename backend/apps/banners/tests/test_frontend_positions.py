import pytest

from apps.banners.models import Banner, FRONTEND_POSITION_CHOICES


@pytest.mark.django_db
def test_all_requested_frontend_banner_positions_are_model_choices():
    requested_positions = {
        "main_slider",
        "main_side",
        "supplements_row",
        "new_arrivals_vertical",
        "new_arrivals_full_1",
        "new_arrivals_double",
        "new_arrivals_quad",
        "new_arrivals_full_2",
        "specialized_care",
        "most_popular_top_row1",
        "most_popular_top_row2",
        "most_popular_top",
        "best_sellers_vertical",
        "most_popular_bottom_quad",
        "most_popular_bottom",
        "bottom_row",
        "splash",
        "offers_top",
        "offers_golden",
        "quick_access",
        "new_arrivals_top",
        "new_arrivals_bottom",
        "bestsellers_vertical",
        "sidebar",
        "hero",
        "bottom",
        "specialized",
    }
    choices = {value for value, _label in Banner._meta.get_field("position").choices}
    frontend_choices = {value for value, _label in FRONTEND_POSITION_CHOICES}

    assert requested_positions <= choices
    assert {"main_slider", "bottom_row", "best_sellers_vertical"} <= frontend_choices
