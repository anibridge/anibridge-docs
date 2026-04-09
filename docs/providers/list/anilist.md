---
icon: simple/anilist
---

# AniList

A list provider for [AniList](https://anilist.co/).

[https://github.com/anibridge/anibridge-anilist-provider](https://github.com/anibridge/anibridge-anilist-provider)

## Configuration

```yaml
list_provider_config:
  anilist:
    token: ...
    # rate_limit: null
```

### `token`

`str` (required)

Your AniList OAuth access token.

[:simple-anilist: Generate an AniList API token](./anilist?generate_token=anilist){: .md-button style="background-color: #1da1f2; color: white; border-radius: 0.4em;"}

!!! danger

    The token is sensitive and should be kept secret. Do not share it or expose it publicly, as it can be used to access and modify your AniList account.

### `rate_limit`

`int | None` (optional, default: `null`)

The maximum number of API requests per minute.

If unset or set to `null`, the provider will use a default _global_ rate limit of 30 requests per minute. It is important to note that this global rate limit is shared across all AniList provider instances, i.e. they collectively use 30 requests per minute. If you override the rate limit, a new rate limit, local to the provider instance, will be created.
