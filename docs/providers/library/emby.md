---
icon: simple/emby
---

# Emby

A library provider for [Emby](https://emby.media/).

[https://github.com/anibridge/anibridge-emby-provider](https://github.com/anibridge/anibridge-emby-provider)

## Configuration

```yaml
library_provider_config:
  emby:
    url: ...
    token: ...
    user: ...
    # sections: []
    # genres: []
    # strict: true
```

### `url` (`str`)

The base URL of the Emby server (e.g., http://localhost:8096).

### `token` (`str`)

The Emby API token. You can generate this under the user settings in Emby.

!!! danger

    The token is sensitive and should be kept secret. Do not share it or expose it publicly, as it can be used to access and modify your Emby server.

### `user` (`str`)

The Emby user to synchronize. This can be a user id, username, or display name.

### `sections` (`list[str]`, optional)

A list of Emby library section names to constrain synchronization to. Leave empty/unset to include all sections.

### `genres` (`list[str]`, optional)

A list of genres to constrain synchronization to. Leave empty/unset to include all
genres.

### `strict` (`bool`, optional)

When enabled, show/season/episode mappings are restricted to the section's highest-priority TV show metadata downloader from Emby library options. For example, if the top TV metadata downloader is AniDB, only AniDB mapping descriptors will be considered for matching. When disabled, all metadata downloaders will be considered for matching. This option is enabled by default.

## Webhooks

The Emby provider supports webhooks for automatic synchronization on activity. To set up webhooks, install and configure the Emby's "Webhooks" plugin from the Emby plugin catalog. See <https://emby.media/support/articles/Notifications.html> for more details.

Configure the notification webhook URL to:

```
http://<your-server-host>:<port>/webhook/emby
```

Configure the following events:

- Library > New Media Added
- Playback > Stop
- Users > Add to Favorites
- Users > Remove from Favorites
- Users > Mark Played
- Users > Mark Unplayed

!!! tip "User Filter"

    If you have multiple users, you can use the 'User Filter' to prevent unecessary webhooks from being sent for other users. Not doing so won't change functionality, but may result in more webhooks being sent than necessary and thus more load on the server.
