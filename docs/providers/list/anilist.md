---
icon: simple/anilist
---

# AniList

A list provider for [AniList](https://anilist.co/).

[https://github.com/anibridge/anibridge-anilist-provider](https://github.com/anibridge/anibridge-anilist-provider)

## Configuration

### `token` (`str`)

```yaml
list_provider_config:
  anilist:
    token: ...
```

Your AniList API token. You can generate one [here](https://anilist.co/login?apiVersion=v2&client_id=34003&response_type=token).

!!! danger

    The token is sensitive and should be kept secret. Do not share it or expose it publicly, as it can be used to access and modify your AniList account.
