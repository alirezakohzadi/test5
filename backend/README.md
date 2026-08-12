# NozhaShop Django Backend

Production-oriented Django REST Framework backend for the existing Persian/RTL Vite React storefront.

## Installation
```bash
cd backend
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

## Environment
Copy `.env.example` to `.env` and configure `SECRET_KEY`, `DATABASE_URL`, Redis, CORS origins, media paths, SMS, payment, and shipping provider variables. No real credentials are stored in the repository.

## Database
PostgreSQL is recommended for production and large catalog search. SQLite can be used locally through the default fallback.
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

## Run
```bash
python manage.py runserver 0.0.0.0:8000
```
Frontend should use `VITE_DJANGO_API_URL=http://localhost:8000/api`.

## API
Canonical prefix: `/api/v1/`.
Implemented resources: products, categories, brands, banners, blog articles, search, SEO meta, OTP auth, cart, orders, and JSON sitemap at `/api/sitemap/`.
Swagger/OpenAPI: `/api/docs/`, schema: `/api/schema/`.

## Testing
```bash
pytest
python manage.py check
```

## Media and WebP
Product images keep `original_url` and optional uploaded originals. `webp_image` is separated so later Celery conversion will not break WordPress-imported original URLs.

## Production Notes
Use PostgreSQL, Redis cache, fixed CORS origins, object storage/CDN for media, real SMS provider, concrete payment gateway implementation, and background workers for image conversion/import jobs.
