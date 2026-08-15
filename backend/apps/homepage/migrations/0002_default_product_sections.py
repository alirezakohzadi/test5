from django.db import migrations


def create_default_sections(apps, schema_editor):
    ProductSection = apps.get_model("homepage", "ProductSection")
    defaults = [
        ("highlights", "highlights", "محصولات منتخب", 0),
        ("offers", "offers", "پیشنهادهای ویژه", 1),
        ("new_arrivals", "new_arrivals", "جدیدترین محصولات", 2),
        ("best_sellers", "best_sellers", "پرفروش‌ترین‌ها", 3),
        ("most_popular", "most_popular", "محبوب‌ترین‌ها", 4),
    ]
    for slug, section_type, title, order in defaults:
        ProductSection.objects.get_or_create(
            slug=slug,
            defaults={
                "section_type": section_type,
                "title": title,
                "order": order,
                "max_products": 8,
                "is_active": True,
                "display_type": "carousel",
            },
        )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [("homepage", "0001_initial")]
    operations = [migrations.RunPython(create_default_sections, noop_reverse)]
