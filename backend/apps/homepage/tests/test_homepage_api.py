from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework.test import APIClient

from apps.banners.models import Banner
from apps.brands.models import Brand
from apps.categories.models import Category
from apps.homepage.models import ProductGroup, ProductSection, QuickAccessItem
from apps.navbar.models import NavbarItem
from apps.products.models import Product, ProductImage


GIF = b"GIF89a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"


class HomepageAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.brand = Brand.objects.create(name="Brand", slug="brand")
        self.category = Category.objects.create(name="Category", slug="category")
        self.product = Product.objects.create(
            name="کرم مرطوب کننده هیدرودرم",
            slug="hydroderm-moisturizing-cream",
            sku="hydroderm-1",
            brand=self.brand,
            category=self.category,
            price=10000,
            discount_price=8000,
            stock=2,
            is_active=True,
            rating=5,
            review_count=5,
            sales_count=1,
            is_featured=True,
            is_popular=True,
            is_golden_offer=True,
            attributes={},
        )
        ProductImage.objects.create(product=self.product, original_url="/media/products/hydroderm.jpg", is_primary=True)
        self.inactive_product = Product.objects.create(
            name="Inactive",
            slug="inactive",
            sku="inactive-1",
            brand=self.brand,
            category=self.category,
            price=10000,
            stock=2,
            is_active=False,
            is_featured=True,
            is_popular=True,
            sales_count=99,
        )
        QuickAccessItem.objects.create(title="Second", url="/second", order=2, is_active=True)
        QuickAccessItem.objects.create(title="First", url="/first", order=1, is_active=True)
        QuickAccessItem.objects.create(title="Hidden", url="/hidden", order=0, is_active=False)
        for order, section_type in enumerate(["new_arrivals", "best_sellers", "most_popular", "offers", "highlights"]):
            ProductSection.objects.create(title=section_type, slug=section_type, section_type=section_type, order=order, max_products=8)
        group = ProductGroup.objects.create(title="Group", slug="group", order=1)
        group.products.add(self.product, self.inactive_product)
        ProductGroup.objects.create(title="Hidden group", slug="hidden-group", order=0, is_active=False)

    def test_quick_access_returns_active_items_in_order(self):
        response = self.client.get("/api/v1/homepage/quick-access/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["title"] for item in response.json()], ["First", "Second"])
        self.assertIn("link_url", response.json()[0])

    def test_product_sections_return_expected_products_and_images(self):
        for section_type in ["new_arrivals", "best_sellers", "most_popular", "offers", "highlights"]:
            response = self.client.get("/api/v1/homepage/product-sections/", {"type": section_type, "slug": section_type})
            self.assertEqual(response.status_code, 200)
            payload = response.json()
            self.assertEqual(len(payload), 1)
            self.assertEqual(payload[0]["type"], section_type)
            slugs = [product["slug"] for product in payload[0]["products"]]
            self.assertIn("hydroderm-moisturizing-cream", slugs)
            self.assertNotIn("inactive", slugs)
            product = payload[0]["products"][0]
            self.assertIn("image_url", product)
            self.assertIn("images", product)
            self.assertIn("is_featured", product)

    def test_empty_section_returns_valid_json(self):
        Product.objects.all().delete()
        response = self.client.get("/api/v1/homepage/product-sections/", {"type": "offers", "slug": "offers"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]["products"], [])

    def test_product_groups_return_active_groups_and_products_only(self):
        response = self.client.get("/api/v1/homepage/product-groups/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["slug"] for item in response.json()], ["group"])
        self.assertEqual([p["slug"] for p in response.json()[0]["products"]], ["hydroderm-moisturizing-cream"])

    def test_existing_product_banner_and_navbar_apis_still_work(self):
        Banner.objects.create(title="Main", image=SimpleUploadedFile("b.gif", GIF, content_type="image/gif"), position="main_slider")
        NavbarItem.objects.create(title="Home", slug="home", url="/")
        self.assertEqual(self.client.get("/api/v1/products/").status_code, 200)
        self.assertEqual(self.client.get("/api/v1/banners/", {"position": "main_slider"}).status_code, 200)
        navbar = self.client.get("/api/v1/navbar/")
        self.assertEqual(navbar.status_code, 200)
        self.assertIn("link_url", navbar.json()[0])
