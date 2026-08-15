import pytest

from apps.brands.models import Brand
from apps.categories.models import Category
from apps.products.admin import ProductAdminForm
from apps.products.models import Product


@pytest.mark.django_db
def test_product_attributes_default_to_empty_dict():
    brand = Brand.objects.create(name="Brand attr", slug="brand-attr")
    category = Category.objects.create(name="Category attr", slug="category-attr")

    product = Product.objects.create(
        name="No attrs",
        slug="no-attrs",
        sku="no-attrs",
        brand=brand,
        category=category,
        price=10000,
        stock=1,
        is_active=True,
    )

    assert product.attributes == {}


@pytest.mark.django_db
def test_product_save_converts_none_attributes_to_empty_dict():
    brand = Brand.objects.create(name="Brand none", slug="brand-none")
    category = Category.objects.create(name="Category none", slug="category-none")

    product = Product.objects.create(
        name="None attrs",
        slug="none-attrs",
        sku="none-attrs",
        brand=brand,
        category=category,
        price=10000,
        stock=1,
        is_active=True,
        attributes=None,
    )

    product.refresh_from_db()
    assert product.attributes == {}


@pytest.mark.django_db
def test_product_admin_form_converts_null_attributes_to_empty_dict():
    form = ProductAdminForm(data={"attributes": None})
    form.cleaned_data = {"attributes": None}

    assert form.clean_attributes() == {}
