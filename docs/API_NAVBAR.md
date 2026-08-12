# Navbar and Banner API

All endpoints are mounted under `/api/v1/` and are designed for the current Django/DRF backend.

## Navbar

### `GET /api/v1/navbar/`

Public endpoint. Returns active root navbar items ordered by `order` then `id`; active children are nested recursively in `children`. Inactive items are not returned.

Example response:

```json
[
  {
    "id": 1,
    "title": "Products",
    "slug": "products",
    "url": "/products/",
    "link_url": "/products/",
    "parent": null,
    "order": 1,
    "is_active": true,
    "icon": "",
    "image_url": "",
    "badge_text": "",
    "children": [
      {
        "id": 2,
        "title": "Skin Care",
        "slug": "skin-care",
        "url": "/categories/skin-care/",
        "link_url": "/categories/skin-care/",
        "parent": 1,
        "order": 1,
        "is_active": true,
        "icon": "",
        "image_url": "",
        "badge_text": "",
        "children": []
      }
    ]
  }
]
```

### `POST /api/v1/navbar/`

Admin/staff-only endpoint.

Example request:

```json
{
  "title": "Products",
  "slug": "products",
  "url": "/products/",
  "parent": null,
  "order": 1,
  "is_active": true,
  "icon": "",
  "image_url": "",
  "badge_text": ""
}
```

Example response: `201 Created` with the created navbar item.

### `PATCH /api/v1/navbar/{id}/`

Admin/staff-only endpoint. Supports partial updates.

Example request:

```json
{
  "order": 2,
  "is_active": false
}
```

Example response: `200 OK` with the updated navbar item.

### `DELETE /api/v1/navbar/{id}/`

Admin/staff-only endpoint. Deletes the item and its descendants because `parent` uses cascade deletion.

Example response: `204 No Content`.

## Validation

- `title` cannot be blank.
- `parent` cannot point to the same item.
- `parent` cannot create a cycle in the tree.
- Public serialization only traverses active items, preventing inactive descendants from leaking to the frontend.

## Banner

### `GET /api/v1/banners/?position={position}`

Public endpoint. Returns active banners whose optional `start_date` / `end_date` window includes the current time. Results are ordered by `position`, `order`, then `id`.

Supported frontend positions include:

- `main_slider`
- `main_side`
- `supplements_row`
- `new_arrivals_vertical`
- `new_arrivals_full_1`
- `new_arrivals_double`
- `new_arrivals_quad`
- `new_arrivals_full_2`
- `specialized_care`
- `most_popular_top_row1`
- `most_popular_top_row2`
- `most_popular_top`
- `best_sellers_vertical`
- `most_popular_bottom_quad`
- `bottom_row`

Existing legacy positions remain supported, including `hero`, `sidebar`, `quick_access`, `specialized`, `splash`, `row`, `bottom`, `offers_top`, `offers_golden`, `new_arrivals_top`, `new_arrivals_bottom`, `bestsellers_vertical`, and `most_popular_bottom`.

Example response:

```json
[
  {
    "id": 1,
    "title": "Main Slider 1",
    "subtitle": "",
    "image_url": "/media/banners/main.jpg",
    "mobile_image_url": "/media/banners/mobile/main.jpg",
    "link_url": "/categories/skin-care/",
    "position": "main_slider",
    "order": 1,
    "is_active": true,
    "badge_text": "",
    "button_text": ""
  }
]
```
