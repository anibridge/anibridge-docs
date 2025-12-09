---
icon: material/docker
---

# Docker

## Requirements

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- AMD64 or ARM64 CPU architecture (or build the image yourself for other architectures)

## Setup

### Docker Compose

```yaml title="compose.yaml"
--8<-- "docs/assets/snippets/compose.yaml"
```

To start the container, run:

```shell
docker compose -f compose.yaml up -d
```

### Docker CLI

```shell
docker run \
    --name anibridge \
    -e PUID=1000 \
    -e PGID=1000 \
    -e UMASK=022 \
    -e TZ=Etc/UTC \
    -p 4848:4848 \
    -v /path/to/anibridge/data:/config \
    ghcr.io/anibridge/anibridge:2
```

!!! tip "Environment Variables"

    While configuring the Docker environment variables are not required, they are highly recommended to improve file permission handling and debugging.

    Setting the `PUID` and `PGID` variables allows AniBridge to run with the same permissions as the user running the container, which is important if you want to access files on the host system. You can find your user ID and group ID by running `id -u` and `id -g` in the terminal.

    The `UMASK` variable sets the default file permissions for new files created by the container. A common value is `022`, which gives read and execute permissions to everyone, but only write permissions to the owner.

    The `TZ` variable sets the timezone for the container, which is useful for logging and scheduling tasks. You can search for your timezone in the [list of tz database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) Wikipedia page.

    ```yaml
    environment:
      PUID: 1000
      PGID: 1000
      UMASK: 022
      TZ: "Etc/UTC"
    ```

!!! tip "Image Tags"

    You can pin the Docker image to a specific version or branch by changing `latest` to a specific tag. Some available tags are:

    - `vX.Y.Z`, `X.Y.Z`: A specific version from the [releases page](https://github.com/anibridge/anibridge/releases) (e.g. `v2.0.0`)
    - `vX.Y`, `X.Y`: The latest release in a specific minor version series (e.g. `v2.0` for the latest `2.0.x` release)
    - `vX`, `X`: The latest release in a specific major version series (e.g. `v2` for the latest `2.x.x` release)
    - `beta`: The latest beta release (may be unstable)
    - `alpha`: The latest alpha release (may be unstable)
    - `main`: The latest commit on the `main` branch, which is usually tied to the latest release
    - `develop`: The latest commit on the `develop` branch (may be unstable)
    - `experimental`: The latest commit on the `experimental` branch (may be unstable)
    - `latest`: The latest stable release

    For more advanced users, you can also easily build an image from source yourself. Example building from the `develop` branch:

    ```yaml
    services:
      anibridge:
        build: https://github.com/anibridge/anibridge.git#develop
    ```
