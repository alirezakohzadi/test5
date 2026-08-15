from django.test import override_settings


@override_settings(
    CORS_ALLOWED_ORIGINS=["http://127.0.0.1:3100", "http://localhost:3100"]
)
def test_frontend_origin_options_preflight_has_cors_headers(client):
    response = client.options(
        "/api/v1/homepage/quick-access/",
        HTTP_ORIGIN="http://127.0.0.1:3100",
        HTTP_ACCESS_CONTROL_REQUEST_METHOD="GET",
    )

    assert response.status_code in (200, 204)
    assert response.headers["Access-Control-Allow-Origin"] == "http://127.0.0.1:3100"


@override_settings(
    CORS_ALLOWED_ORIGINS=["http://127.0.0.1:3100", "http://localhost:3100"]
)
def test_localhost_frontend_origin_is_allowed(client):
    response = client.options(
        "/api/v1/products/",
        HTTP_ORIGIN="http://localhost:3100",
        HTTP_ACCESS_CONTROL_REQUEST_METHOD="GET",
    )

    assert response.status_code in (200, 204)
    assert response.headers["Access-Control-Allow-Origin"] == "http://localhost:3100"
