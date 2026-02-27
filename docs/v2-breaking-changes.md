---
icon: material/exclamation-thick
---

# v2 Breaking Changes

This page summarizes the major, breaking changes introduced in the v2 release.

!!! danger "Important"

    Upgrading from v1 to v2 is **not** a seamless process. Please read through all the changes below to understand the necessary migration steps.

    It is recommend to backup your existing data and configuration before proceeding. However, migrating your prior data will not be possible due to the significant changes in architecture and schema.

!!! tip

    As you read through the changes, I recommend having a local copy of the [example v2 configuration](./configuration.md#example) open for reference to see how the new config structure looks in practice.

## Project rebrand

The project has been renamed from "PlexAniBridge" to "AniBridge" to reflect its expanded capabilities beyond just Plex integration. As part of this rebrand:

- The GitHub repository has moved from `https://github.com/eliasbenb/PlexAniBridge` to [`https://github.com/anibridge/anibridge`](https://github.com/anibridge/anibridge).
- The official Docker image has moved from `ghcr.io/eliasbenb/plexanibridge:v1` to `ghcr.io/anibridge/anibridge:v2`.
- The official mapping repository has moved from `https://github.com/eliasbenb/PlexAniBridge-Mappings` to [`https://github.com/anibridge/anibridge-mappings`](https://github.com/anibridge/anibridge-mappings).
- Documentation has been updated to reflect the new project name and URLs.

If you are using Docker, please update your image references accordingly:

<div class="grid" markdown>

```yaml
# v1 Docker compose
services:
  plexanibridge:
    image: ghcr.io/eliasbenb/plexanibridge:v1
    ...
```

```yaml
# v2 Docker compose
services:
  anibridge:
    image: ghcr.io/anibridge/anibridge:v2
    ...
```

</div>

## Configuration changes

v2 introduces a provider-agnostic architecture, allowing AniBridge to support multiple media library or list providers beyond Plex and AniList. This change required significant refactoring of the codebase and configuration schema. As a result, many configuration options and mappings have changed to accommodate this new architecture:

### YAML configuration

v1 allowed multiple config sources (YAML, JSON, and environment variables). **v2 only accepts a single YAML config file**.

If you used environment variables or a JSON file to configure your v1 instance, move those values into the YAML file located at `$AB_DATA_PATH/config.yaml`.

### Global config nesting

In v1, values defined at the root level were implicitly global/shared across profiles. In v2, **you must explicitly nest these shared options under a `global_config` key**.

_Note: certain application-level settings (like `log_level`, `mappings_url`, `web`, etc.) remain at the root level._

Example conversion:

<div class="grid" markdown>

```yaml
# v1 config
sync_modes: ["periodic", "webhook"]
sync_interval: 3600
profiles:
  some_profile: ...
```

```yaml
# v2 config
global_config:
  scan_modes: ["periodic", "webhook"]
  scan_interval: 3600
profiles:
  some_profile: ...
```

</div>

### Key renames and nesting

Some previously existing configuration keys were renamed for clarity:

- `sync_modes` → `scan_modes`
- `sync_interval` → `scan_interval`

Configuration for the web UI is now nested under a `web` key:

- `web_enabled` → `web.enabled`
- `web_host` → `web.host`
- `web_port` → `web.port`
- `web_basic_auth_username` → `web.basic_auth.username`
- `web_basic_auth_password` → `web.basic_auth.password`
- `web_basic_auth_htpasswd_path` → `web.basic_auth.htpasswd_path`
- `web_basic_auth_realm` → `web.basic_auth.realm`

### Provider-first schema

v2 is provider-agnostic. Users can select which library and list providers to use through the config.

Each profile must declare its [`library_provider`](./configuration.md#library_provider) and [`list_provider`](./configuration.md#list_provider), and provider-specific settings must be nested under a [`library_provider_config`](./configuration.md#provider-settings) and [`list_provider_config`](./configuration.md#provider-settings) key respectively.

AniBridge currently supports these built-in providers (with more planned):

- Library providers: [Plex](./providers/library/plex.md) (`plex`), [Jellyfin](./providers/library/jellyfin.md) (`jellyfin`)
- List providers: [AniList](./providers/list/anilist.md) (`anilist`), [MyAnimeList](./providers/list/mal.md) (`mal`)

For advanced users: you can also load 3rd-party providers that implement the [library base](https://github.com/anibridge/anibridge-library-base) or [list base](https://github.com/anibridge/anibridge-list-base) by including the full Python class path in [`provider_classes`](./configuration.md#provider_classes). This opens up possibilities for custom or community-developed providers.

**Example for Plex-AniList:**

<div class="grid" markdown>

```yaml
# v1 config
profiles:
  some_profile:
    plex_url: ...
    plex_token: ...
    plex_user: ...
    plex_sections: []
    plex_genres: []
    anilist_token: ...
```

```yaml
# v2 config
profiles:
  some_profile:
    library_provider: plex
    list_provider: anilist
    library_provider_config:
      plex:
        url: ...
        token: ...
        user: ...
    list_provider_config:
      anilist:
        token: ...
```

</div>

## Mapping schema

Significant changes were made to the mapping schema in v2 to increase flexibility under the new provider-agnostic architecture. As a result, all custom mappings from v1 are incompatible with v2. Users must recreate any custom mappings using the new schema defined in the [AniBridge Mappings repository](https://github.com/anibridge/anibridge-mappings). _See the repository for more detailed documentation on the new mapping format_.

Example conversion:

<div class="grid" markdown>

```yaml
# v1 custom mapping
1: # Some AniList ID
  tmdb_show_id: 12345
  tmdb_mappings:
    s1: "e1-e12"
  tvdb_show_id: 67890
  tvdb_mappings:
    s1: "e1-e12"
```

```yaml
# v2 custom mapping
anilist:1: # Specify the source descriptor (<provider>:<id><:optional scope>)
  tmdb_show:12345:s1:
    "1-12": "1-12" # AniList 1-12 maps to TMDB 1-12
  tvdb_show:67890:s1:
    "1-12": "1-12" # AniList 1-12 maps to TVDB 1-12
```

</div>

!!! note

    The old format cannot be converted automatically due to the v2 schema requiring new data (both a source and target episode range).

## Sync fields control

In v1, users could set `excluded_sync_fields` to prevent certain fields from being synced. This option has been removed and superseded by `sync_fields` in v2.

The sync_fields option provides granular, per-field control over how data is synchronized. You canl completely disable syncing for specific fields or allow syncing only under certain comparison conditions (e.g. only sync if old > new, only sync if new != x, etc.). This allows for much more flexible and powerful sync behavior compared to the all-or-nothing approach of `excluded_sync_fields`.

You can read more about the new `sync_fields` option and its capabilities in the [configuration documentation](./configuration.md#sync_fields). Below is an example conversion of the old `excluded_sync_fields` to the new `sync_fields`:

<div class="grid" markdown>

```yaml
# v1 config
global_config:
  excluded_sync_fields: ["status", "score"]
```

```yaml
# v2 config
global_config:
  sync_fields: # Note that all fields are implictly true
    status: false
    score: false
    # Below are some more advanced examples that weren't previously possible
    # progress:
    #   _lt: false # Don't sync progress if the new value is less than the old value (prevents regressions)
    # status:
    #   dropped: false # Don't sync if the new status is "dropped" (prevents unwanted drops)
```

</div>

## Destructive sync changes

In v1, the `destructive_sync` option controlled **both**:

- Deleting list entries (destructive deletions), and
- Allowing regressive field updates (e.g., decreasing progress or changing status from "completed" back to "current").

In v2, this behavior has been split for greater precision:

- `destructive_sync` now only controls whether list entries can be deleted.
- Regressive field updates are now managed exclusively through the new `sync_fields` configuration.

This separation gives users more precise control. You can now prevent regressions on specific fields (such as progress or status) without also enabling destructive deletions.

!!! warning "Default behavior changes"

    In v1, regressive updates were blocked by default. In v2, this is no longer the case and users must explicitly restrict regressions via `sync_fields`.

    If you previously relied on the v1 default behavior (preventing regressions for the `status`, `progress`, `repeats`, `started_at`, `finished_at` fields), you must explicitly configure those protections in v2 to avoid unintended updates.

    The equivalent of the v1 default behavior in v2 would look like this:

    ```yaml
    global_config:
      sync_fields:
        status:
          _lt: false
        progress:
          _lt: false
        repeats:
          _lt: false
        started_at:
          _lt: false
        finished_at:
          _lt: false
    ```

## Database

The local database schema had to be overhauled to support the new provider-agnostic architecture. As a result, it was decided to reset the database for v2. Migration from v1 to v2 is not supported, users must start with a fresh database.

!!! important

    The v2 release resets the database migration history and uses a new SQLite filename (`plexanibridge.db` → `anibridge.db`).

    As a result, all existing sync history and pins will be lost when upgrading from v1 to v2.

## Platform and runtime

For users running AniBridge in Docker, please switch to the new v2 image: `ghcr.io/anibridge/anibridge:v2`.

For users running from source, ensure your Python environment is upgraded to at least Python 3.14, as v2 requires this version or higher.
