from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from rest_framework.test import APIClient

from .models import NavbarItem


class NavbarAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = get_user_model().objects.create_user(
            username="admin", password="pass", is_staff=True
        )

    def test_get_navbar_returns_nested_active_roots_ordered(self):
        inactive = NavbarItem.objects.create(title="Inactive", slug="inactive", is_active=False)
        root_b = NavbarItem.objects.create(title="B", slug="b", order=2)
        root_a = NavbarItem.objects.create(title="A", slug="a", order=1)
        child = NavbarItem.objects.create(title="Child", slug="child", parent=root_a, order=1)
        NavbarItem.objects.create(title="Inactive Child", slug="inactive-child", parent=root_a, is_active=False)

        response = self.client.get("/api/v1/navbar/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["slug"] for item in response.data], ["a", "b"])
        self.assertEqual(response.data[0]["children"][0]["slug"], child.slug)
        self.assertNotIn(inactive.slug, [item["slug"] for item in response.data])
        self.assertEqual(response.data[0]["children"], [response.data[0]["children"][0]])

    def test_admin_can_post_patch_and_delete_navbar_item(self):
        self.client.force_authenticate(self.admin)
        create_response = self.client.post(
            "/api/v1/navbar/",
            {"title": "Root", "slug": "root", "url": "/root/", "order": 1},
            format="json",
        )
        self.assertEqual(create_response.status_code, 201)

        item_id = create_response.data["id"]
        patch_response = self.client.patch(
            f"/api/v1/navbar/{item_id}/", {"is_active": False}, format="json"
        )
        self.assertEqual(patch_response.status_code, 200)
        self.assertFalse(patch_response.data["is_active"])

        delete_response = self.client.delete(f"/api/v1/navbar/{item_id}/")
        self.assertEqual(delete_response.status_code, 204)

    def test_anonymous_cannot_write_navbar_item(self):
        response = self.client.post(
            "/api/v1/navbar/", {"title": "Root", "slug": "root"}, format="json"
        )
        self.assertEqual(response.status_code, 403)

    def test_parent_cycle_validation(self):
        root = NavbarItem.objects.create(title="Root", slug="root")
        child = NavbarItem.objects.create(title="Child", slug="child", parent=root)
        root.parent = child
        with self.assertRaises(ValidationError):
            root.full_clean()

    def test_item_cannot_parent_itself_via_api(self):
        item = NavbarItem.objects.create(title="Root", slug="root")
        self.client.force_authenticate(self.admin)
        response = self.client.patch(
            f"/api/v1/navbar/{item.id}/", {"parent": item.id}, format="json"
        )
        self.assertEqual(response.status_code, 400)
