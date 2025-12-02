---
icon: material/wrench
---

# Source

## Requirements

- [Python 3.14+](https://www.python.org/downloads/)
- [uv](https://docs.astral.sh/uv/getting-started/installation/)
- [SQLite3](https://www.sqlite.org/download.html)
- [Git](https://git-scm.com/downloads)

## Setup

!!! tip

    Have a look at [the configuration page](../configuration.md) for a detailed list of configurable environment variables.

```shell
git clone https://github.com/anibridge/anibridge.git
cd anibridge

# Setup environment
uv sync
uv run ab-deps-install
uv run ab-build

# Run AniBridge
uv run ab-start
```
