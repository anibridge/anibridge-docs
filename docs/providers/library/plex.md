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
    sections: []
    genres: []
```

### `url` (`str`)

The base URL of the Plex server (e.g., http://localhost:32400).

### `token` (`str`)

The account API token of the Plex server admin. Get a token by following [these instructions](https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/).

### `user` (`str`)

The Plex user to synchronize. This can be a username, email, or display name.

### `sections` (`list[str]`, optional)

A list of Plex library section names to constrain synchronization to. Leave empty/unset to include all sections.

### `genres` (`list[str]`, optional)

A list of genres to constrain synchronization to. Leave empty/unset to include all genres.
