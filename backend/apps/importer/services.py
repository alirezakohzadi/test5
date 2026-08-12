class WordPressImportService:
    """Idempotent import skeleton. Use wordpress_id/slug/sku unique keys; no fake source data is generated."""
    def upsert_product(self, payload):
        from apps.products.models import Product
        lookup={'wordpress_id': payload['wordpress_id']} if payload.get('wordpress_id') else {'sku': payload['sku']}
        return Product.objects.update_or_create(defaults=payload, **lookup)
