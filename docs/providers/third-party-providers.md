---
icon: material/apps
---

# Third-Party Providers

AniBridge can load additional library (what you watch) and list (where your progress is tracked) providers as Python modules letting you extend the supported providers beyond those built-in.

This page covers how to install and configure third-party provider modules, as well as direct developers to resources for building their own.

## Install a provider module

1. Install the package into the same environment as AniBridge:

   ```shell
   pip install <pypi-package-name> # git+https://github.com/<user>/anibridge-<provider>-provider.git # You can also install from Git
   ```

2. Register the module in `config.yaml` via [`provider_modules`](../configuration.md#provider_modules).

   ```yaml
   provider_modules:
     - <package-module-name> # e.g., anibridge_xyz_provider
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
- **Pick a namespace**: Register your provider with the decorator in the SDKs and set a (`@library_provider` or `@list_provider`). The namespace is what users put in their config's `NAMESPACE` constant claass provider variable `library_provider` / `list_provider`. It should be all lowercase and unique.
- **Expose configuration**: Accept a `config: dict | None` in your provider `__init__` and document the keys (host URL, tokens, library filters, etc.).
- **Ship to users**: Publish to PyPI or provide a Git URL. Users load the module via `provider_modules` and set the namespace in their profiles.
