---
icon: material/cog
---

# Configuration

AniBridge reads configuration from a YAML file named `config.yaml` that lives
inside the data directory `$AB_DATA_PATH` (defaults to `./data`).

A [config editor](./web/settings.md) is also available through the web UI.

## Example

```yaml title="config.yaml"
--8<-- "docs/assets/snippets/config.yaml"
```

## Configuration Hierarchy

AniBridge supports having multiple, concurrently active profiles, each with its own set of configuration options. This allows you to sync different libraries or users with tailored settings.

To simplify configuration management, settings can also be defined globally and shared across all profiles by defining them under the top-level `global_config` key.

To define profile-specific settings, use the `profiles` key in the configuration file with the profile name as a sub-key. Any settings defined under a profile will override the corresponding global settings for that profile.

Settings are applied in the following order:

1. **Profile-specific settings** (highest priority)
2. **Global shared settings** (medium priority)
3. **Built-in defaults** (lowest priority)

For example, if `global_config.scan_interval` is defined as `900` and `profiles.personal.scan_interval` is defined as `1800`, the profile named `personal` will use the overridden value of `1800`. If `scan_interval` is not defined under either the profile or global settings, the built-in default of `86400` will be used.

## Profile Configuration

These settings can be defined per-profile under the `profiles` key or globally under
the `global_config` key.

### `library_provider`

`str`

Specifies the media library provider to use (e.g., `plex`, `jellyfin`).

---

### `list_provider`

`str`

Specifies the list provider to use (e.g., `anilist`, `mal`).

---

### `scan_modes`

`list[Enum("periodic", "poll", "webhook")]` (Optional, default: `["periodic", "poll", "webhook"]`)

Determines the triggers for scanning:

- `periodic`: Scan all items at the specified [scan interval](#scan_interval).
- `poll`: Poll for incremental changes at the specified [scan interval](#poll_interval).
- `webhook`: Trigger scans via webhook payloads from the library provider.

Setting `scan_modes` to `None` or an empty list will cause the application to perform a single scan on startup and then exit.

By default, all three modes are enabled, allowing for instant, incremental updates via polling and webhooks, as well as a full periodic scan every [`scan_interval`](#scan_interval) seconds (default: 24 hours) to catch any failed/missed updates.

!!! info "Webhooks"

    Using the webhooks scan mode will require configuring your library provider (e.g., Plex) to send webhook payloads to AniBridge. Refer to the documentation of your library provider for instructions on setting up webhooks.

    A prerequisite for using webhooks is that the web interface is [enabled](#webenabled) and accessible to the library provider.

    With webhooks enabled, set your library provider to send webhooks to `/webhook/{provider}`, where `{provider}` is the namespace of your library provider (e.g., `plex`).

    Once webhooks are setup, it is recommended to disable the `poll` scan mode as it becomes redundant.

    _Note: not all library providers may support webhooks._

### `scan_interval`

`int` (Optional, default: `86400`)

Interval in seconds to sync when using the `periodic` [scan mode](#scan_modes).

---

### `poll_interval`

`int` (Optional, default: `60`)

Interval in seconds to poll for changes when using the `poll` [scan mode](#scan_modes).

Polling is designed to be a lightweight way to keep your list provider up-to-date with just recent watch activity. It only checks for changes since the last successful sync and is not intended to be a complete scan of the entire library.

!!! info "The first poll"

    On the first run, polling will perform a regular periodic scan to establish a baseline. Subsequent polls will only check for changes since the last successful sync.

### `full_scan`

`bool` (Optional, default: `False`)

When enabled, the scan process will include all items, regardless of watch activity. By default, only watched items are scanned.

!!! warning "Recommended Usage"

    Full scans are generally **not recommended** unless combined with [`destructive_sync`](#destructive_sync) to delete list provider entries for unwatched library provider content.

    Enabling `full_scan` can lead to **excessive API usage** and **longer processing times**.

---

### `destructive_sync`

`bool` (Optional, default: `False`)

Allows list entry deletions.

!!! danger "Data Loss Warning"

    **Enable only if you understand the implications.**

    Destructive sync allows for deleting list entries that have no watch activity.

    When combined with `full_scan`, this can be used to mirror your library provider's content on the list provider, including removing entries for unwatched items. If `full_scan` is disabled, only library items with partial watch activity (e.g., watched a different season in the same show) may be deleted.

---

### `empty_sync`

`bool` (Optional, default: `False`)

Allows empty list entry creation, i.e., creating entries for every scanned item, even if they have no watch activity. This is helpful if you want to have a complete mirror of your library on the list provider, including unwatched items. The 'planning' status will be applied to these no-activity entries.

!!! tip

    By default when [`full_scan`](#full_scan) is disabled, only entries where you have some related watch activity (e.g. watched a different season in the same show) will be synced, and empty entries will not be created for fully unwatched items.

    If you'd like to have entries created for every single item in your library, enable [`full_scan`](#full_scan) and `empty_sync`.

---

### `promote_rewatch`

`bool` (Optional, default: `False`)

When enabled, if a list entry already has the `completed` or `repeating` status and the computed library provider status is `current`, the computed status will be promoted to `repeating` instead of `current`.

This prevents previously completed entries from being downgraded to current when the library provider has partial watch activity (i.e., the library reports you've never completed the show but are partway through it). It essentially treats the list status as the source of truth for whether you've completed the show before, and if you have, it won't let the computed status go back to `current`.

Instead, the entry will be marked as `repeating` to indicate that you've rewatched it and are currently watching it again, preserving the fact that you've completed it in the past.

---

### `sync_fields`

`dict[SyncField, bool | dict[str, bool]] ` (Optional, default: `{"review": false, "user_rating": false}`)

Allows defining granular sync behavior on a per-field basis. It allows for completely disabling syncing of specific fields or configuring them to only sync using comparison operators.

Note that undefined fields are implicitly enabled (i.e., if a field is not listed in `sync_fields`, it will be synced by default).

Available `SyncField` options are:

- `status` Watch status (watching, completed, etc.)
- `progress` Number of episodes/movies watched
- `repeats` Number of times rewatched
- `review` User's review/comments (text)
- `user_rating` User's rating/score
- `started_at` When the user started watching (date)
- `finished_at` When the user finished watching (date)

To completely disable syncing of a field, set its value to `false`:

```yaml
sync_fields:
  review: false
  user_rating: false
```

For more granular control, you have access to the following comparison operators: `_lt`, `_lte`, `_gt`, `_gte`, `_eq`, `_ne`, and direct value comparison (e.g., `dropped: false` to disallow changing status to "dropped"). These operators compare the library provider's value with the list provider's value before deciding whether to sync.

```yaml
sync_fields:
  progress:
    _lt: false # Don't allow decreasing progress (e.g., from 5 episodes watched to 4)
  started_at:
    _gt: false # Don't allow changing the start date to a later date
  status:
    dropped: false # Don't allow changing status to "dropped"
```

!!! tip "Allowing All Fields"

    The `review` and `user_rating` fields are disabled by default to prevent accidental overwriting of existing reviews and ratings.

    To sync all fields, set this to an empty dictionary: `{}`. All undefined fields are implicitly enabled.

??? "Status Comparison Values"

    See the available list status values [here](./providers/third-party/list-provider-api.md#anibridge.list.ListStatus).

    If you want to disallow everything except `current` and `completed`, you can set:

    ```yaml
    sync_fields:
      status:
        dropped: false
        paused: false
        planning: false
        repeating: false
    ```

---

### `backup_retention_days`

`int` (Optional, default: `30`)

Controls how many days AniBridge keeps AniList backup snapshots before pruning older files. Set to `0` to disable automatic cleanup and retain all backups indefinitely.

---

### `batch_requests`

`bool` (Optional, default: `False`)

When enabled, AniList API requests are made in batches:

1. Prior to syncing, a batch of requests is created to retrieve all the entries that will be worked on.
2. Post-sync, a batch of requests is created to update all the entries that were changed.

This can significantly reduce rate limiting, but at the cost of atomicity. If any request in the batch fails, the entire batch will fail.

For example, if a sync job finds 10 items to update with `batch_requests` enabled, all 10 requests will be sent at once. If any of the requests fail, all 10 updates will fail.

!!! success "First Run"

    The primary use case of batch requests is going through the first sync of a large library. It can significantly reduce rate limiting from AniList.

    For subsequent syncs, your data is pre-cached, and the benefit of batching is reduced.

---

### `search_fallback_threshold`

`int` (Optional, default: `-1`)

Determines how similar a title must be to the search query as a percentage to be considered a match.

The default behavior is to disable searching completely and only rely on the [community and local mappings database](./mappings/custom-mappings.md).

The higher the value, the more strict the title matching. A value of `100` requires an exact match, while `0` will match the first result returned by AniList, regardless of similarity.

---

### `dry_run`

`bool` (Optional, default: `False`)

When enabled:

- AniList data **is not modified**.
- Logs show what changes **would** have been made.

!!! success "First Run"

    Run with `dry_run` enabled on first launch to preview changes without modifying your AniList data.

## Provider Settings

Each provider may consume additional configuration options. Refer to the documentation of each provider for details:

<div class="grid cards" markdown>
  - [:simple-plex: Plex](./providers/library/plex.md){: style="text-decoration: none; color: #e5a00d" }
  - [:simple-jellyfin: Jellyfin](./providers/library/jellyfin.md){: style="text-decoration: none; color: #AA5CC3" }
  - [:simple-anilist: AniList](./providers/list/anilist.md){: style="text-decoration: none; color: #1da1f2" }
  - [:simple-myanimelist: MyAnimeList](./providers/list/mal.md){: style="text-decoration: none; color: #2e51a2" }
</div>

### library_provider_config

This is a dictionary where each key is the namespace of a library provider (e.g., `plex`, `jellyfin`), and the value is another dictionary containing configuration options that will be passed to that provider.

```yaml
library_provider_config:
  provider_namespace:
    option1: ...
    option2: ...
```

### list_provider_config

This is a dictionary where each key is the namespace of a list provider (e.g., `anilist`, `mal`), and the value is another dictionary containing configuration options that will be passed to that provider.

```yaml
list_provider_config:
  provider_namespace:
    option1: ...
    option2: ...
```

## App Settings

These settings apply to the entire application and are not profile-specific.

### `log_level`

`Enum("DEBUG", "INFO", "SUCCESS", "WARNING", "ERROR", "CRITICAL")` (Optional, default: `INFO`)

Sets logging verbosity for the entire application.

!!! tip "Minimal Logging"

    For minimal logging, set the verbosity to `SUCCESS` which only logs successful operations like syncing entries.

!!! tip "Debugging"

    For the most detailed logs, set this to `DEBUG`.

---

### `mappings_url`

`str` (Optional, default: `https://github.com/anibridge/anibridge-mappings/releases/download/v3/mappings.json.zst`)

URL to the upstream mappings source. This can be a JSON or YAML file, optionally compressed with [Zstandard](https://facebook.github.io/zstd/) (`*.zst`).

This option is only intended for advanced users who want to use their own upstream mappings source or disable upstream mappings entirely. For most users, it is recommended to keep the default value.

!!! info "Custom Mappings"

    This setting works in tandem with custom mappings stored in the `mappings/` directory inside the data path. Custom mappings will overload any upstream mappings.

??? question "Disabling Upstream Mappings"

    To disable upstream mappings, set this to an empty string: `""`. This will effectively make AniBridge depend solely on your local custom mappings.

---

### `provider_classes`

`list[str]` (Optional, default: `[]`)

A list of Python provider class paths to load. This is an advanced option to load additional library or list providers beyond the built-in options. Each item should be a string in the format `module.submodule.ClassName` that points to a valid [`LibraryProvider`](./providers/third-party/library-provider-api.md#library-provider-api) or [`ListProvider`](./providers/third-party/list-provider-api.md#list-provider-api) subclass.

For example, to load a hypothetical `MyCustomProvider` class from the `my_providers` module, you would set:

```yaml
provider_classes: ["my_providers.MyCustomProvider"]
```

---

### `web.enabled`

`bool` (Optional, default: `True`)

When enabled, the [web interface](./web/screenshots.md) is accessible.

---

### `web.host`

`str` (Optional, default: `0.0.0.0`)

The host address to bind the web interface to.

---

### `web.port`

`int` (Optional, default: `4848`)

The port to bind the web interface to.

---

### `web.allow_config_without_auth`

`bool` (Optional, default: `False`)

When enabled, allows access to configuration endpoints without authentication. By default, the configuration endpoints (which contain read/write access to sensitive data) are disabled unless authentication is properly set up.

It is recommended to keep this option disabled unless you have other security measures in place (e.g., network restrictions, reverse proxy with authentication).

This option has no effect if basic authentication is enabled via `web.basic_auth` or an `htpasswd` file, as authentication will be required regardless.

!!! warning "Security Risk"

    Enabling `web.allow_config_without_auth` can expose sensitive configuration data and allow unauthorized modifications if the web interface is accessible to untrusted users. Use with caution and ensure proper security measures are in place.

---

### `web.basic_auth.username`

`str` (Optional, default: `None`)

HTTP Basic Authentication username for the web UI. Basic Auth is enabled only when both the username and password are provided (or an `htpasswd` file is used). Leave unset to disable authentication.

---

### `web.basic_auth.password`

`str` (Optional, default: `None`)

HTTP Basic Authentication password for the web UI. Basic Auth is enabled only when both the username and password are provided (or an `htpasswd` file is used). Leave unset to disable authentication.

---

### `web.basic_auth.htpasswd_path`

`str` (Optional, default: `None`)

Path to an [Apache `htpasswd`](https://httpd.apache.org/docs/current/programs/htpasswd.html) file containing user credentials for HTTP Basic Authentication. When set, the web UI validates requests against this file. Only **bcrypt** (recommended) and **SHA1** (insecure) hashed passwords are supported.

Providing an `htpasswd` file allows you to manage multiple users and rotate passwords without exposing plaintext credentials in the configuration.

!!! tip "Generate htpasswd entries"

    <div class="htpasswd-generator" data-htpasswd-generator>
      <form class="htpasswd-generator__grid" autocomplete="off" novalidate>
        <label>Username
          <input data-htpasswd-username="" type="text" name="username" required  />
        </label>
        <label>Password
          <input data-htpasswd-password="" type="password" name="password" required />
        </label>
        <div class="htpasswd-generator__actions">
          <button type="submit">Generate htpasswd entry</button>
        </div>
      </form>
      <div class="htpasswd-generator__output">
        <textarea data-htpasswd-output="" autocomplete="off" readonly></textarea>
        <div class="htpasswd-generator__actions">
          <button type="button" data-htpasswd-copy="">Copy to clipboard</button>
        </div>
        <div class="htpasswd-generator__feedback" data-htpasswd-feedback=""></div>
      </div>
    </div>

---

### `web.basic_auth.realm`

`str` (Optional, default: `AniBridge`)

Realm label presented in the browser Basic Auth prompt and `WWW-Authenticate` response header.

## Advanced Examples

### Multiple Users

This example demonstrates configuring three profiles for different Plex and AniList users.

```yaml
# Global settings shared by all profiles
global_config:
  library_provider: "plex"
  list_provider: "anilist"
  library_provider_config:
    plex:
      token: "EzF..."
      url: "http://localhost:32400"
  scan_modes: ["periodic"]

profiles:
  nitta:
    library_provider_config:
      plex:
        user: "nitta32"
    list_provider_config:
      anilist:
        token: "eYJ..."
  hina:
    library_provider_config:
      plex:
        user: "hina_jp@gmail.com"
    list_provider_config:
      anilist:
        token: "sKf..."
  guest:
    library_provider_config:
      plex:
        user: "Guest User"
    list_provider_config:
      anilist:
        token: "gHt..."
    sync_fields:
      review: false
      user_rating: false
      started_at: false
      finished_at: false
```

### Per-section Profiles

This example demonstrates configuring separate profiles for different Plex sections, allowing for tailored sync settings based on content type.

```yaml
# Global settings shared by all profiles
global_config:
  library_provider: "plex"
  list_provider: "anilist"
  library_provider_config:
    plex:
      token: "EzF..."
      user: "Kyomoto"
      url: "http://localhost:32400"
  list_provider_config:
    anilist:
      token: "eYJ..."
  scan_modes: ["periodic"]

profiles:
  # For movies, perform full, destructive scans every 30 minutes
  movies:
    library_provider_config:
      plex:
        sections: ["Anime Movies"]
    full_scan: true
    destructive_sync: true
    scan_interval: 1800
    sync_fields: {} # Sync all fields (undefined is enabled)
  # For shows, use the built-in defaults
  shows:
    library_provider_config:
      plex:
        sections: ["Anime"]
```

### One User, Multiple List Providers

This example demonstrates configuring a single Plex user to sync with multiple list providers (AniList and MyAnimeList).

```yaml
global_config:
  library_provider: "plex"
  library_provider_config:
    plex:
      token: "EzF..."
      url: "http://localhost:32400"
      user: "takopi"
  scan_modes: ["periodic", "webhook"]

profiles:
  anilist:
    list_provider: "anilist"
    list_provider_config:
      anilist:
        token: "eYJ..."

  mal:
    list_provider: "mal"
    list_provider_config:
      mal:
        token: "XyZ..."
```
