---
icon: material/api
---

# API

The API is self documenting via the OpenAPI specification. You can explore endpoints, view schemas, and try out requests directly from either the built-in [Swagger UI](https://swagger.io/tools/swagger-ui/) or [Redoc](https://redocly.github.io/redoc/) interfaces (available at `/docs` and `/redoc` respectively of your AniBridge instance).

!!! warning "API Stability"

    The API is not intended for third-party integrations as it is subject to change without notice. Use at your own risk.

!!! tip "Authorization"

    AniBridge supports [basic authentication](../configuration.md#webbasic_authusername) for securing the API. Make sure to include the appropriate `Authorization` header in your requests when authentication is enabled.
