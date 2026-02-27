---
icon: material/tools
---

# Developers Guide

AniBridge can load additional library and list providers as Python modules letting you extend the supported providers beyond those built-in.

This page covers how to install and configure third-party provider classes, as well as direct developers to resources for building their own.

## Install a provider class

1. Install the package into the same environment as AniBridge:

   ```shell
   pip install <pypi-package-name> # git+https://github.com/<user>/anibridge-<provider>-provider.git # You can also install from Git
   ```

2. Register the module in `config.yaml` via [`provider_classes`](../configuration.md#provider_classes).

   ```yaml
   provider_classes:
     - <package-module-name>.<class-name> # e.g., anibridge_xyz_provider.XyzProvider
   ```

3. Set `library_provider` / `list_provider` to the provider namespace exposed by the module (e.g., `plex`, `anilist`).

   ```yaml
   library_provider: xyz # Depends on what the implementation defines the namespace as
   library_provider_config:
     xyz:
       config_key: config_value
   ```

## Build your own provider

- **Start from the template**: [anibridge-provider-template](https://github.com/anibridge/anibridge-provider-template) ships minimal library and list providers you can rename and extend.
- **Use the SDKs**: Base classes live in [anibridge-library-base](https://github.com/anibridge/anibridge-library-base) and [anibridge-list-base](https://github.com/anibridge/anibridge-list-base).
- **Pick a namespace**: Define a `NAMESPACE` constant in your provider class. This is the value that users set in their profile's `library_provider` / `list_provider` field. It should be all lowercase and unique.
- **Expose configuration**: Accept a `config: dict | None` in your provider `__init__` and document the keys (host URL, tokens, library filters, etc.).
- **Ship to users**: Publish to PyPI or provide a Git URL. Users load the module via `provider_classes` and set the namespace in their profiles.

!!! tip API references

    For more details on implementing providers, see the API references:

    - [Library Provider API](./library-provider-api.md)
    - [List Provider API](./list-provider-api.md)
