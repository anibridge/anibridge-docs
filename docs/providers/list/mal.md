---
icon: simple/myanimelist
---

# MyAnimeList

A list provider for [MyAnimeList](https://myanimelist.net/).

[https://github.com/anibridge/anibridge-mal-provider](https://github.com/anibridge/anibridge-mal-provider)

```yaml
list_provider_config:
  mal:
    token: ...
    # client_id: "b11a4e1ead0db8142268906b4bb676a4"
```

## Configuration

### `token` (`str`)

Your MyAnimeList API refresh token.

[:simple-myanimelist: Generate a MAL API token](./mal?generate_token=mal){: .md-button style="background-color: #2e51a2; color: white; border-radius: 0.4em;"}

!!! danger

    The token is sensitive and should be kept secret. Do not share it or expose it publicly, as it can be used to access and modify your MyAnimeList account.

### `client_id` (`str`, optional)

Your MyAnimeList API client ID. This option is for advanced users who want to use their own client ID. If not provided, a default client ID managed by the AniBridge team will be used.
