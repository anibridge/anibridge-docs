---
icon: material/map
---

# Custom Mappings

AniBridge allows you to define mappings to supplement the [upstream mappings database](https://github.com/anibridge/anibridge-mappings). This feature is particularly helpful for correcting entries that are missing or incorrectly mapped in the default database.

!!! note

    Custom mappings *merge* with the upstream mappings, they do not override them. This means that if you add a custom mapping for a series that is already in the upstream database, only the fields specified in the custom mapping will be updated. The remaining pre-existing fields will remain unchanged.

Below is an example mappings file. You can use [the JSON schema](https://github.com/anibridge/anibridge-mappings/blob/HEAD/mappings.schema.json) or the [anibridge-mappings database](https://github.com/anibridge/anibridge-mappings) as reference.

```yaml title="mappings.yaml"
--8<-- "docs/assets/snippets/mappings.yaml"
```

!!! tip "Including Other Mapping Files"

    You can include other mapping files (local or remote) using the `$includes` key. This allows you to modularize your custom mappings or leverage community-maintained mapping files.

    ```yaml title="mappings.yaml"
    $includes:
      - "https://example.com/mappings.json"
      - "/path/to/mappings.yaml"
      - "./relative/path/to/mappings.yml"
    ```

??? tip "JSON Format for Mappings"

    The mappings file can also be written in JSON format. Here is the same example in JSON:

    ```json title="mappings.json"
    --8<-- "docs/assets/snippets/mappings.json"
    ```

??? tip "Zstandard compression"

    AniBridge supports loading custom mappings from [Zstandard](https://facebook.github.io/zstd/) compressed files with the `.zst` extension. This is useful for reducing file size when dealing with large mapping files.

## Local Custom Mappings

AniBridge will look for a custom mappings file with the name `mappings.(json|yaml|yml)(.zst)?` in the `$AB_DATA_PATH` directory (defaults to `./data`). The file extension determines the format of the file (YAML or JSON).

## Community Custom Mappings

There are community maintained mappings repositories that you can use to get pre-made mappings for your content. You can include these mappings in your custom mappings file using the `$includes` key as explained above.

- <a href="https://github.com/LuceoEtzio/AniBridge-Custom-Mappings">
    <img src="https://avatars.githubusercontent.com/u/40282884?s=24&v=4" alt="LuceoEtzio" style="margin-right: 4px; border-radius: 50%; vertical-align: middle;">
    <span>LuceoEtzio/AniBridge-Custom-Mappings</span>
  </a>

## Default Mappings

If you want to contribute your custom mappings to the community, you can submit a pull request to the [anibridge-mappings](https://github.com/anibridge/anibridge-mappings) repository. Your pull request should modify the [`mappings.edits.yaml`](https://github.com/anibridge/anibridge-mappings/blob/HEAD/mappings.edits.yaml) file.
