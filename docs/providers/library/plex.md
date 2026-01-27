---
icon: simple/plex
---

# Plex

A library provider for [Plex](https://www.plex.tv/).

[https://github.com/anibridge/anibridge-plex-provider](https://github.com/anibridge/anibridge-plex-provider)

## Configuration

```yaml
library_provider_config:
  plex:
    url: ...
    token: ...
    user: ...
    # sections: []
    # genres: []
    # strict: true
```

### `url` (`str`)

The base URL of the Plex server (e.g., http://localhost:32400).

### `token` (`str`)

The account API token of the Plex server admin. Get a token by following [these instructions](https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/).

!!! danger

    The token is sensitive and should be kept secret. Do not share it or expose it publicly, as it can be used to access and modify your Plex account.

### `user` (`str`)

The Plex user to synchronize. This can be a username, email, or display name.

### `sections` (`list[str]`, optional)

A list of Plex library section names to constrain synchronization to. Leave empty/unset to include all sections.

### `genres` (`list[str]`, optional)

A list of genres to constrain synchronization to. Leave empty/unset to include all genres.

### `strict` (`bool`, optional, default: `true`)

Whether to enforce strict matching when resolving mappings. If `true`, only exact mapping matches of a show's episode ordering (TMDB or TVDB) will be considered. If `false`, falling back from TMDB to TVDB (or vice versa) is allowed.

## Webhooks

The Plex provider supports webhooks for automatic synchronization on activity. To set up webhooks, configure your Plex server to send webhook requests to your AniBridge instance at the following URL:

!!! note "Plex Pass Required"

    Plex webhooks are a premium feature and require a Plex Pass subscription.

```
http://<your-server-host>:<port>/webhook/plex
```

Refer to the Plex documentation for instructions on setting up webhooks: [Plex Webhooks](https://support.plex.tv/articles/115002267687-webhooks/).
