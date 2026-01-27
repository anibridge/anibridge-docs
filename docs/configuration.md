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
- `poll`: Poll for changes every 30 seconds, making incremental updates.
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

Interval in seconds to sync when using the `periodic` [scan mode](#scan_modes)

---

### `full_scan`

`bool` (Optional, default: `False`)

When enabled, the scan process will include all items, regardless of watch activity. By default, only watched items are scanned.

!!! warning "Recommended Usage"

    Full scans are generally **not recommended** unless combined with [`destructive_sync`](#destructive_sync) to delete list provider entries for unwatched library provider content.

    Enabling `full_scan` can lead to **excessive API usage** and **longer processing times**.

---

### `destructive_sync`

`bool` (Optional, default: `False`)

Allows regressive updates and deletions, which **can cause data loss**.

!!! danger "Data Loss Warning"

    **Enable only if you understand the implications.**

    Destructive sync allows:

    - Deleting AniList entries.
    - Making regressive updates - e.g., if the list's progress is higher than the library's, the list will be **lowered** to match the library.

    To delete AniList entries for unwatched library content, enable both [`full_scan`](#full_scan) and `destructive_sync`.

---

### `excluded_sync_fields`

`list[Enum("status", "progress", "repeats", "review", "user_rating", "started_at", "finished_at")]` (Optional, default: `["review", "user_rating"]`)

Specifies which fields should **not** be synced. Available fields:

- `status` Watch status (watching, completed, etc.)
- `progress` Number of episodes/movies watched
- `repeats` Number of times rewatched
- `review` User's review/comments (text)
- `user_rating` User's rating/score
- `started_at` When the user started watching (date)
- `finished_at` When the user finished watching (date)

!!! tip "Allowing All Fields"

    To sync all fields, set this to an empty list: `[]`.

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

`str` (Optional, default: `https://github.com/anibridge/anibridge-mappings/releases/latest/download/mappings.json.zst`)

URL to the upstream mappings source. This can be a JSON or YAML file, optionally compressed with [Zstandard](https://facebook.github.io/zstd/) (`*.zst`).

This option is only intended for advanced users who want to use their own upstream mappings source or disable upstream mappings entirely. For most users, it is recommended to keep the default value.

!!! info "Custom Mappings"

    This setting works in tandem with custom mappings stored in the `mappings/` directory inside the data path. Custom mappings will overload any upstream mappings.

??? question "Disabling Upstream Mappings"

    To disable upstream mappings, set this to an empty string: `""`. This will effectively make AniBridge depend solely on your local custom mappings.

---

### `provider_modules`

`list[str]` (Optional, default: `[]`)

A list of provider modules to load. This is an advanced option to load additional library or list providers beyond the built-in options. Each module must be a [valid provider Python package](./providers/third-party/developers-guide.md) installed in the current environment.

For example, to load a hypothetical `my_custom_provider` module:

```yaml
provider_modules: ["my_custom_provider"]
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
    excluded_sync_fields: ["review", "user_rating", "started_at", "finished_at"]
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
    excluded_sync_fields: []
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
