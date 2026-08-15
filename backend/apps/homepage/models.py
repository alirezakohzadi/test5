from django.db import models

from apps.common.models import TimeStampedModel


class QuickAccessItem(TimeStampedModel):
    title = models.CharField(max_length=160)
    subtitle = models.CharField(max_length=255, blank=True)
    icon = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to="homepage/quick-access/", blank=True)
    url = models.CharField(max_length=500, blank=True)
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    badge = models.CharField(max_length=80, blank=True)

    class Meta:
        ordering = ("order", "id")

    def __str__(self):
        return self.title


class ProductSection(TimeStampedModel):
    HIGHLIGHTS = "highlights"
    OFFERS = "offers"
    NEW_ARRIVALS = "new_arrivals"
    BEST_SELLERS = "best_sellers"
    MOST_POPULAR = "most_popular"
    SECTION_TYPES = [
        (HIGHLIGHTS, "Highlights"),
        (OFFERS, "Offers"),
        (NEW_ARRIVALS, "New arrivals"),
        (BEST_SELLERS, "Best sellers"),
        (MOST_POPULAR, "Most popular"),
    ]
    DISPLAY_TYPES = [("carousel", "Carousel"), ("grid", "Grid"), ("slider", "Slider"), ("list", "List")]

    title = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, db_index=True, allow_unicode=True)
    section_type = models.CharField(max_length=32, choices=SECTION_TYPES, db_index=True)
    subtitle = models.CharField(max_length=255, blank=True)
    badge = models.CharField(max_length=80, blank=True)
    display_type = models.CharField(max_length=20, choices=DISPLAY_TYPES, default="carousel")
    max_products = models.PositiveIntegerField(default=8)
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    products = models.ManyToManyField("products.Product", blank=True, related_name="homepage_sections")

    class Meta:
        ordering = ("order", "id")
        indexes = [models.Index(fields=["section_type", "slug", "is_active"])]

    def __str__(self):
        return self.title


class ProductGroup(TimeStampedModel):
    title = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, db_index=True, allow_unicode=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="homepage/product-groups/", blank=True)
    icon = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    products = models.ManyToManyField("products.Product", blank=True, related_name="homepage_groups")

    class Meta:
        ordering = ("order", "id")

    def __str__(self):
        return self.title
