---
icon: material/exclamation-thick
---

# v2 Breaking Changes

This page summarizes the major, breaking changes introduced in the v2 release.

!!! danger "Important"

    Upgrading from v1 to v2 is **not** a seamless process. Please read through all the changes below to understand the necessary migration steps. Backup your existing data and configuration before proceeding.

## Project rebrand

The project has been renamed from "PlexAniBridge" to "AniBridge" to reflect its expanded capabilities beyond just Plex integration. As part of this rebrand:

- The GitHub repository has moved from `https://github.com/eliasbenb/PlexAniBridge` to [`https://github.com/anibridge/anibridge`](https://github.com/anibridge/anibridge).
- The official Docker image has moved from `ghcr.io/eliasbenb/plexanibridge:v1` to `ghcr.io/anibridge/anibridge:v2`.
- The official mapping repository has moved from `https://github.com/eliasbenb/PlexAniBridge-Mappings` to [`https://github.com/anibridge/anibridge-mappings`](https://github.com/anibridge/anibridge-mappings).
- Documentation has been updated to reflect the new project name and URLs.

If you are using Docker, please update your image references accordingly.

## Configuration changes

v2 introduces a provider-agnostic architecture, allowing AniBridge to support multiple media library or list providers beyond Plex and AniList. This change required significant refactoring of the codebase and configuration schema. As a result, many configuration options and mappings have changed to accommodate this new architecture:

### YAML configuration

v1 allowed multiple config sources (files and environment variables). v2 accepts a single YAML config file.

If you used environment variables to override config values in v1, move those values into the YAML file located at `$AB_DATA_PATH/config.yaml`.

### Key renames and nesting

Some configuration keys were renamed for clarity. The most notable changes are:

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

### `global_config` nesting

In v1, values defined at the root level were implicitly global/shared across profiles. In v2, you must explicitly nest these shared options under a `global_config` key.

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

### Provider-first schema

v2 is provider-agnostic. Users can select which library and list providers to use through the config.

Each profile must declare its [`library_provider`](./configuration.md#library_provider) and [`list_provider`](./configuration.md#list_provider), and provider-specific settings must be nested under a [`provider_config:`](./configuration.md#provider-settings) key.

AniBridge currently supports these built-in providers (with more planned):

- Library providers: Plex (`plex`), Jellyfin (`jellyfin`)
- List providers: AniList (`anilist`), MyAnimeList (`mal`)

Users can also load 3rd-party providers that implement the [library interface](https://github.com/anibridge/anibridge-library-interface) or [list interface](https://github.com/anibridge/anibridge-list-interface) by including the full Python module path in [`provider_modules`](./configuration.md#provider_modules).

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
    providers:
      plex:
        url: ...
        token: ...
        user: ...
        sections: []
        genres: []
      anilist:
        token: ...
```

</div>

## Mapping schema

Significant changes were made to the mapping schema in v2 to increase flexibility under the new provider-agnostic architecture. As a result, all custom mappings from v1 are incompatible with v2. Users must recreate any custom mappings using the new schema defined in the [AniBridge Mappings repository](https://github.com/anibridge/anibridge-mappings).

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
anilist:1:s1: # Specify the AniList provider
  tmdb:12345:s1:
    "1-12": "1-12" # AniList 1-12 maps to TMDB 1-12
  tvdb:67890:s1:
    "1-12": "1-12" # AniList 1-12 maps to TVDB 1-12
```

</div>

The old format cannot be converted automatically due to the v2 schema requiring new data (both a source and target episode range).

## Database

The local database schema had to be overhauled to support the new provider-agnostic architecture. As a result, it was decided to reset the database for v2. Migration from v1 to v2 is not supported, users must start with a fresh database.

The v2 release resets the database migration history and uses a new SQLite filename (`plexanibridge.db` → `anibridge.db`).

As a result, all existing sync history and pins will be lost when upgrading from v1 to v2.

## Platform and runtime

For users running AniBridge in Docker, please switch to the new v2 image: `ghcr.io/anibridge/anibridge:v2`.

For users running from source, ensure your Python environment is upgraded to at least Python 3.14, as v2 requires this version or higher.
