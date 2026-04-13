---
icon: material/head-cog
---

# AI Usage

This document outlines where AI is used, where it is explicitly avoided, and how its usage varies across the AniBridge repositories.

For each repository group, this document provides a brief description of its purpose, a summary of where AI is and isn't used, and a rough estimate of the percentage of AI-generated code (excluding tests).

---

### `anibridge/anibridge`

The main repository containing the backend, frontend, core application logic, and deployment configuration.

AI was used heavily during the [v2 migration and refactor](../v2-breaking-changes.md). Since then, usage has decreased significantly as the codebase has stabilized. It is most prevalent in the frontend and least prevalent in core synchronization logic and provider integrations.

| AI is used for                    | AI is NOT used for            |
| --------------------------------- | ----------------------------- |
| Test generation                   | Core sync logic               |
| Debugging and optimization        | Provider integrations         |
| Implementation review             | Database design               |
| Frontend integrations and styling | API design                    |
| Web services                      | Web layout                    |
|                                   | Containerization / deployment |

> _AI-generated code: ~40%_

---

### `anibridge/anibridge-utils`

Shared helpers and utilities used across the project. Because these are foundational to how everything else behaves, all core implementations are written and maintained by hand. AI is primarily used for reviewing and refactoring existing code, as well as generating tests.

| AI is used for        | AI is NOT used for   |
| --------------------- | -------------------- |
| Test generation       | Core implementations |
| Implementation review |                      |
| Refactor suggestions  |                      |

> _AI-generated code: ~20%_

---

### `anibridge/anibridge-library-base`

### `anibridge/anibridge-list-base`

These repositories define the base classes and interfaces that all library and list providers implement. All hand-coded.

> _AI-generated code: ~0%_

---

### `anibridge/anibridge-plex-provider`

### `anibridge/anibridge-jellyfin-provider`

### `anibridge/anibridge-emby-provider`

### `anibridge/anibridge-anilist-provider`

### `anibridge/anibridge-mal-provider`

### `anibridge/anibridge-trakt-provider`

Each provider follows the interfaces defined in the `anibridge-library-base` / `anibridge-list-base` repositories. Becuase a lot of the code is shared, AI is used to adapt logic between providers.

| AI is used for                       | AI is NOT used for     |
| ------------------------------------ | ---------------------- |
| Test generation                      | Core provider logic    |
| Debugging                            | API interactions       |
| Feature adaptation between providers | Data modeling          |
|                                      | Feature implementation |

> _AI-generated code: ~30%_

---

### `anibridge/anibridge-mappings`

### `anibridge/anibridge-metadata`

ETL pipelines that process and normalize data from several external APIs. This is the most AI-assisted part of the project.

| AI is used for           | AI is NOT used for |
| ------------------------ | ------------------ |
| Test generation          | Validation logic   |
| Data normalization logic | Schema design      |
| Architectural decisions  | API design         |
| ETL orchestration        |                    |

> _AI-generated code: ~80%_

---

### `anibridge/anibridge-docs`

Documentation for the AniBridge project. All docs are done by hand.

> _AI-generated code: ~0%_
