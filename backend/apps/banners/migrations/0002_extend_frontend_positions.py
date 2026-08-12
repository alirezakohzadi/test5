# Generated manually because Django dependencies were unavailable in the execution environment.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("banners", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="banner",
            name="position",
            field=models.CharField(
                choices=[
                    ("hero", "hero"),
                    ("quick_access", "quick_access"),
                    ("specialized", "specialized"),
                    ("splash", "splash"),
                    ("row", "row"),
                    ("bottom", "bottom"),
                    ("sidebar", "sidebar"),
                    ("offers_top", "offers_top"),
                    ("offers_golden", "offers_golden"),
                    ("new_arrivals_top", "new_arrivals_top"),
                    ("new_arrivals_vertical", "new_arrivals_vertical"),
                    ("new_arrivals_bottom", "new_arrivals_bottom"),
                    ("bestsellers_vertical", "bestsellers_vertical"),
                    ("main_slider", "main_slider"),
                    ("main_side", "main_side"),
                    ("supplements_row", "supplements_row"),
                    ("new_arrivals_full_1", "new_arrivals_full_1"),
                    ("new_arrivals_double", "new_arrivals_double"),
                    ("new_arrivals_quad", "new_arrivals_quad"),
                    ("new_arrivals_full_2", "new_arrivals_full_2"),
                    ("specialized_care", "specialized_care"),
                    ("most_popular_top_row1", "most_popular_top_row1"),
                    ("most_popular_top_row2", "most_popular_top_row2"),
                    ("most_popular_top", "most_popular_top"),
                    ("best_sellers_vertical", "best_sellers_vertical"),
                    ("most_popular_bottom_quad", "most_popular_bottom_quad"),
                    ("bottom_row", "bottom_row"),
                    ("most_popular_bottom", "most_popular_bottom"),
                ],
                db_index=True,
                max_length=32,
            ),
        ),
    ]
