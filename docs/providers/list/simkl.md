---
icon: simple/simkl
---

# Simkl

A list provider for [Simkl](https://simkl.com/).

## Configuration

```yaml
list_provider_config:
  simkl:
    token: ...
    # client_id: "966b70652bf3ebbe46556dde9aa5a88e903790ae448c30b9866584743a6fc39e"
    # rate_limit: null
```

### `token`

`str` (required)

Your Simkl access token.

[:simple-simkl: Generate a Simkl API token](./simkl?generate_token=simkl){: .md-button style="background-color: #000000; color: white; border-radius: 0.4em;"}

!!! danger

    The token is sensitive and should be kept secret. Do not share it or expose it publicly, as it can be used to access and modify your Simkl account.

### `client_id`

`str` (optional, default: `"966b70652bf3ebbe46556dde9aa5a88e903790ae448c30b9866584743a6fc39e"`)

Your Simkl API client ID. If not provided, AniBridge's default Simkl client ID will be used.

### `rate_limit`

`int | None` (optional, default: `null`)

The maximum number of API requests per minute.

If unset or set to `null`, the provider will use a default _global_ rate limit of 30 requests per minute. It is important to note that this global rate limit is shared across all Simkl provider instances, i.e. they collectively use 30 requests per minute. If you override the rate limit, a new rate limit, local to the provider instance, will be created.
