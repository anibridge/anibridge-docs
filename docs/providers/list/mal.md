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

!!! warning

    Clicking the button above to generate a token requires some trust in the AniBridge project. To make token generation as easy as possible, it relies on passing your MyAnimeList authorization code to AniBridge's [CORS proxy](https://httptoolkit.com/blog/cors-proxies/) server, which then exchanges it for a refresh token so you don't have to do any manual work. If you are uncomfortable with this, you can manually perform the OAuth2 token exchange process as described in the [MyAnimeList API documentation](https://myanimelist.net/apiconfig/references/authorization) to obtain a refresh token yourself.

    You are also able to specify your own client ID and CORS proxy server by clicking "Advanced Options" in the token generation dialog.

### `client_id` (`str`, optional)

Your MyAnimeList API client ID. This option is for advanced users who want to use their own client ID. If not provided, a default client ID managed by the AniBridge team will be used.
