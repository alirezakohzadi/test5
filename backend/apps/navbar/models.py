from django.core.exceptions import ValidationError
from django.db import models

from apps.common.models import TimeStampedModel


class NavbarItem(TimeStampedModel):
    title = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, db_index=True, allow_unicode=True)
    url = models.CharField(max_length=500, blank=True)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="children",
    )
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    icon = models.CharField(max_length=120, blank=True)
    image_url = models.URLField(blank=True)
    badge_text = models.CharField(max_length=80, blank=True)

    class Meta:
        ordering = ("order", "id")
        indexes = [models.Index(fields=["parent", "is_active", "order", "id"])]

    def __str__(self):
        return self.title

    def clean(self):
        super().clean()
        if not self.title or not self.title.strip():
            raise ValidationError({"title": "Title cannot be empty."})
        if self.parent_id and self.pk and self.parent_id == self.pk:
            raise ValidationError({"parent": "A navbar item cannot be its own parent."})

        ancestor = self.parent
        seen = {self.pk} if self.pk else set()
        while ancestor is not None:
            if ancestor.pk in seen:
                raise ValidationError({"parent": "Parent selection creates a cycle."})
            seen.add(ancestor.pk)
            ancestor = ancestor.parent

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)
