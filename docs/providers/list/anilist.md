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
```

### `token` (`str`)

Your AniList API token.

[:simple-anilist: Generate an AniList API token](./anilist?generate_token=anilist){: .md-button style="background-color: #1da1f2; color: white; border-radius: 0.4em;"}

!!! danger

    The token is sensitive and should be kept secret. Do not share it or expose it publicly, as it can be used to access and modify your AniList account.
