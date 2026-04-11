---
icon: simple/trakt
---

!!! warning "Instability warning"

    The Trakt provider is not part of the stable release channel yet. You can only currently access it under the `develop` branch.

    It is barely tested. Use at your own risk.

# Trakt

A list provider for [Trakt](https://trakt.tv/).

[https://github.com/anibridge/anibridge-trakt-provider](https://github.com/anibridge/anibridge-trakt-provider)

!!! warning "Trakt as a list-based provider"

    When using the Trakt provider, AniBridge treats your Trakt history as your list. History-based tracking and list-based tracking are not fully compatible concepts. For example, given one start date and one end date for an entire show, there is no way to determine the intermediate watch dates for individual episodes.

    There are other similar limitations, so be aware that syncing with Trakt may not be as accurate or feature-rich as with other providers.

## Configuration

```yaml
list_provider_config:
  trakt:
    token: ...
    # client_id: "fab91d3719c4206245850c46022ba5a571677ee62a886cfd8da8fc93db4e9f7c"
    # client_secret: "d58b8bfcc63f8e372ff932f78c3ff5ebad0a2c99910a2cce380bf313808e2bbd"
    # rate_limit: null
```

### `token`

`str` (required)

Your Trakt OAuth refresh token.

[:simple-trakt: Generate a Trakt API token](./trakt?generate_token=trakt){: .md-button style="background-color: #ed1c24; color: white; border-radius: 0.4em;"}

!!! danger

    The token is sensitive and should be kept secret. Do not share it or expose it publicly, as it can be used to access and modify your Trakt account.

### `client_id`

`str` (optional, default: `"fab91d3719c4206245850c46022ba5a571677ee62a886cfd8da8fc93db4e9f7c"`)

Your Trakt API client ID. The default value is AniBridge's official Trakt application ID. You can create your own at [trakt.tv/oauth/applications](https://trakt.tv/oauth/applications).

### `rate_limit`

`int | None` (optional, default: `null`)

The maximum number of API requests per minute.

If unset or set to `null`, the provider will use a default global rate limit of 1000 requests per 5 minutes (matching Trakt's official rate limit). This global limit is shared across all Trakt provider instances. If you override the rate limit, a local per-instance limiter is created instead.
