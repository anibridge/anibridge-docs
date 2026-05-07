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
    # home_user: ...
    # sections: []
    # genres: []
    # strict: true
```

### `url`

`str` (required)

The base URL of the Plex server (e.g., http://localhost:32400).

### `token`

`str` (required)

The Plex authentication token for the target user being synchronized.

[:simple-plex: Generate a Plex API token](./plex?generate_token=plex){: .md-button style="background-color: #e5a00d; color: #1f1f1f; border-radius: 0.4em;"}

!!! danger

    The token is sensitive and should be kept secret. Do not share it or expose it publicly, as it can be used to access and modify your Plex account.

### `home_user`

`str` (optional, default: `None`)

Optional Plex Home user to use. If the token provided belongs to the user you want to synchronize, you can leave this unset.

If set, the provider will attempt to switch to the specified Plex Home user using the Plex API. The account token provided must be the token of the Plex Home owner, otherwise the provider will fail to authenticate.

### `sections`

`list[str]` (optional, default: `[]`)

A list of Plex library section names to constrain synchronization to. Leave empty/unset to include all sections.

### `genres`

`list[str]` (optional, default: `[]`)

A list of genres to constrain synchronization to. Leave empty/unset to include all genres.

### `strict`

`bool` (optional, default: `True`)

Whether to enforce strict matching when resolving mappings. If `true`, only exact mapping matches of a show's episode ordering (TMDB or TVDB) will be considered. If `false`, falling back from TMDB to TVDB (or vice versa) is allowed.

You can configure episode ordering in the show's or section's 'Advanced' settings.

## Plex Webhooks

The Plex provider supports Plex webhooks for automatic synchronization on activity. To set up webhooks, configure your Plex server to send webhook requests to your AniBridge instance at the following URL:

!!! note "Plex Pass Required"

    Plex webhooks are a premium feature and require a Plex Pass subscription.

```
http://<your-server-host>:<port>/webhook/plex
```

Refer to the Plex documentation for instructions on setting up webhooks: [Plex Webhooks](https://support.plex.tv/articles/115002267687-webhooks/).

## Tautulli Webhooks

If you don't have Plex Pass, you can use [Tautulli](https://github.com/Tautulli/Tautulli) webhooks as an alternative. Tautulli is a third-party monitoring tool for Plex that supports webhooks through its "Notification Agents" feature.

Tatulli's webhooks setup is a bit more involved, but it allows you to achieve similar functionality without needing Plex Pass:

1. After installing and setting up Tautulli, navigate to "Settings" > "Notification Agents" in the Tautulli web interface.
2. Click "Add a new notification agent" and select "Webhook" as the notification type.
3. Under the "Configuration" tab:
   - Configure the "Webhook URL" to your AniBridge instance at the following URL: `http://<your-server-host>:<port>/webhook/plex?format=tautulli`.
   - Configure the "Webhook Method" to `POST`.
4. Under the "Triggers" tab, select:
   - "Playback Stop"
   - "Watched"
   - "Recently Added"
5. Under the "Data" tab configure the following "JSON Data" template for every trigger you selected in (4):

   ```json
   <movie>
   {
     "action": "{action}",
     "user_id": "{user_id}",
     "rating_key": "{rating_key}",
     "parent_rating_key": "{parent_rating_key}",
     "grandparent_rating_key": "{grandparent_rating_key}"
   }
   </movie>
   <show>
   {
     "action": "{action}",
     "user_id": "{user_id}",
     "rating_key": "{rating_key}",
     "parent_rating_key": "{parent_rating_key}",
     "grandparent_rating_key": "{grandparent_rating_key}"
   }
   </show>
   <season>
   {
     "action": "{action}",
     "user_id": "{user_id}",
     "rating_key": "{rating_key}",
     "parent_rating_key": "{parent_rating_key}",
     "grandparent_rating_key": "{grandparent_rating_key}"
   }
   </season>
   <episode>
   {
     "action": "{action}",
     "user_id": "{user_id}",
     "rating_key": "{rating_key}",
     "parent_rating_key": "{parent_rating_key}",
     "grandparent_rating_key": "{grandparent_rating_key}"
   }
   </episode>
   ```

!!! note

    It is completely valid to disable the "Playback Stop" and "Recently Added" triggers if you only want to synchronize on watch status changes. In that case, only the "Watched" trigger is necessary.
