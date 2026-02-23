---
icon: simple/jellyfin
---

# Jellyfin

A library provider for [Jellyfin](https://jellyfin.org/).

[https://github.com/anibridge/anibridge-jellyfin-provider](https://github.com/anibridge/anibridge-jellyfin-provider)

## Configuration

```yaml
library_provider_config:
  jellyfin:
    url: ...
    token: ...
    user: ...
    # sections: []
    # genres: []
    # strict: true
```

### `url` (`str`)

The base URL of the Jellyfin server (e.g., http://localhost:8096).

### `token` (`str`)

The Jellyfin API token. You can generate this under the user settings in Jellyfin.

!!! danger

    The token is sensitive and should be kept secret. Do not share it or expose it publicly, as it can be used to access and modify your Jellyfin server.

### `user` (`str`)

The Jellyfin user to synchronize. This can be a user id, username, or display name.

### `sections` (`list[str]`, optional)

A list of Jellyfin library section names to constrain synchronization to. Leave
empty/unset to include all sections.

### `genres` (`list[str]`, optional)

A list of genres to constrain synchronization to. Leave empty/unset to include all
genres.

### `strict` (`bool`, optional)

When enabled, show/season/episode mappings are restricted to the section's highest-priority TV show metadata downloader from Jellyfin library options. For example, if the top TV metadata downloader is AniDB, only AniDB mapping descriptors will be considered for matching. When disabled, all metadata downloaders will be considered for matching. This option is enabled by default.
