---
icon: material/map
---

# Custom Mappings

AniBridge allows you to define mappings to supplement the [upstream mappings database](https://github.com/anibridge/anibridge-mappings). This feature is particularly helpful for correcting entries that are missing or incorrectly mapped in the default database.

Below is an example mappings file. You can use [the JSON schema](https://github.com/anibridge/anibridge-mappings/blob/HEAD/mappings.schema.json) or the [anibridge-mappings database](https://github.com/anibridge/anibridge-mappings) as reference.

```yaml title="mappings.yaml"
--8<-- "docs/assets/snippets/mappings.yaml"
```

!!! info "Mappings Schema Overview"

    For a more detailed explanation of the mappings schema, please refer to the [anibridge-mappings repository](https://github.com/anibridge/anibridge-mappings). However, here's a brief overview of the key concepts:

    - **Descriptors**: 'Descriptors' are the keys in the mappings file that identify the source and target entries. They follow a specific format that includes the provider, ID, and optionally the 'scope (e.g. season of a show). A descriptor looks like this: `provider:id:scope`, where the scope is optional. For example, `tvdb_show:12345:s1` refers to season 1 of the show with ID 12345 on TVDB.
    - **Mapping Structure**: The mappings are structured as a nested dictionary, where the top-level keys are the source descriptors and the values are dictionaries of target descriptors and their corresponding episode mappings. For example, in the mapping `tvdb_show:12345:s1`, the source is `tvdb_show:12345:s1`, and the target is `anilist:67890`. A source descriptor can have multiple target descriptors, allowing you to map a single source entry to multiple targets if needed.
    - **Episode Mappings**: The episode mappings are defined as strings that specify how episodes correspond between the source and target. For example, `1-12` means that episodes 1 through 12 on the source correspond to episodes 1 through 12 on the target. The episode mappings can also include more complex patterns, such as `1-12,14,16-20` or `1-12|2` - read more about episode mapping syntax in the [anibridge-mappings repository](https://github.com/anibridge/anibridge-mappings).

??? info "Merging Behavior"

    Custom mappings *merge* with the upstream mappings, they do not override them. This means that if you add a custom mapping for a series that is already in the upstream database, only the fields specified in the custom mapping will be updated. The remaining pre-existing fields will remain unchanged.

    Explicitly setting a field to `null` in your custom mapping will remove that field from the merged result. This allows you to effectively "delete" fields from the upstream mapping if needed.

??? info "Mapping Direction"

    The mapping direction is determined by the keys in the mappings file. For example, if you have a mapping like this:

    ```yaml
    tvdb_show:12345:s1:
      anilist:67890:
        1-12: "1-12"
    ```

    This means that the series with ID `12345` on TVDB maps to the series with ID `67890` on AniList, and the episodes 1-12 on TVDB correspond to episodes 1-12 on AniList.

    It is important that the source key (in this case, `tvdb_show:12345:s1`) is valid for your library provider, and the target key (in this case, `anilist:67890`) is valid for the list provider you are using. If it is not, the mapping won't be used.

    Mappings are unidirectional, so ensure that you order your mappings correctly. For example, if you want to map to AniList, the target key should always be an AniList descriptor (e.g. `anilist:67890`), and the source key should be a descriptor from your library provider (e.g. `tvdb_show:12345:s1`).

??? example "Including Other Mapping Files"

    You can include other mapping files (local or remote) using the `$includes` key. This allows you to modularize your custom mappings or leverage community-maintained mapping files.

    ```yaml title="mappings.yaml"
    $includes:
      - "https://example.com/mappings.json"
      - "/path/to/mappings.yaml"
      - "./relative/path/to/mappings.yml"
    ```

??? example "JSON Format for Mappings"

    The mappings file can also be written in JSON format. Here is the same example in JSON:

    ```json title="mappings.json"
    --8<-- "docs/assets/snippets/mappings.json"
    ```

## Local Mappings

AniBridge will look for a custom mappings file with the name `mappings.(json|yaml|yml)(.zst)?` in the `$AB_DATA_PATH` directory (defaults to `./data` or `/config` in Docker). The file extension determines the format of the file (YAML or JSON).

## Community Mappings

If you want to contribute your custom mappings to the community, you can submit a pull request to the [anibridge-mappings](https://github.com/anibridge/anibridge-mappings) repository. Your pull request should modify the [`mappings.edits.yaml`](https://github.com/anibridge/anibridge-mappings/blob/HEAD/mappings.edits.yaml) file.

[LuceoEtzio/anibridge-custom-mappings](https://github.com/LuceoEtzio/anibridge-custom-mappings) is a repository maintained by [@LuceoEtzio](https://github.com/LuceoEtzio) that contains alternative order TMDB and TVDB show mappings (e.g. Absolute Order, DVD Order, etc.). Use the `$includes` feature to adopt these mappings into your setup.

## Special Thanks

Special thanks to [@LuceoEtzio](https://github.com/LuceoEtzio) for being the #1 contributor of the community mappings. His **4k+** contributions are the reason AniBridge works.

[<img src="https://avatars.githubusercontent.com/u/40282884?s=64&v=4" alt="LuceoEtzio" style="margin-right: 4px; border-radius: 50%; vertical-align: middle;">](https://github.com/LuceoEtzio)
