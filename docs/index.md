---
icon: material/home
---

# Introduction

# <a href="https://anibridge.eliasbenb.dev"><img src="./assets/images/logo.png" alt="Logo" width="32" style="vertical-align: middle;"/></a> AniBridge

The smart way to keep your anime lists perfectly synchronized.

[![Discord Shield](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fdiscord.com%2Fapi%2Finvites%2Fey8kyQU9aD%3Fwith_counts%3Dtrue&query=%24.approximate_member_count&style=for-the-badge&logo=discord&label=Discord%20Users&labelColor=%23313338&color=%235865f2&cacheSeconds=10800)](https://discord.gg/ey8kyQU9aD) [![GitHub Shield](https://img.shields.io/github/stars/anibridge/anibridge?style=for-the-badge&logo=github&label=GitHub%20Stars&labelColor=%2324292e&color=%23f0f0f0)](https://github.com/anibridge/anibridge) [![Docker Pulls](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fghcr-badge.eliasbenb.dev%2Fapi%2Feliasbenb%2Fanibridge%2Fanibridge&query=downloadCount&style=for-the-badge&logo=docker&label=Docker%20Pulls&color=2496ed)](https://github.com/anibridge/anibridge/pkgs/container/anibridge)

[Quick Start Docker](./quick-start/docker.md) | [Quick Start Source](./quick-start/source.md) | [Configuration](./configuration.md)

## Key Features

- **🔄 Comprehensive Synchronization**: Automatically synchronizes watch status, progress, ratings, reviews, and start/completion dates between your anime library and list.
- **🎯 Smart Content Matching**: Uses a [curated mappings database](https://github.com/anibridge/anibridge-mappings) with fuzzy title search fallback and support for custom mapping overrides.
- **⚡ Optimized Performance**: Intelligent batch processing, rate limiting, and caching to minimize API usage while maximizing sync speed.
- **👥 Multi-User & Multi-Profile**: Define multiple profiles with separate settings targeting different users or libraries.
- **🖥️ Web Dashboard**: Intuitive web interface with a real-time sync timeline, profile management, custom mapping editor, and log viewer.
- **🛡️ Safe & Reliable**: Built-in dry run mode for testing and automatic backups with restoration through the web UI for easy recovery.
- **🐳 Easy Deployment**: Docker-ready with easy YAML-based configuration.

```mermaid
flowchart LR
    User1([👤 User 1])
    User2([👤 User 2])
    User3([👤 User 3])
    Library[(📺 Media Library)]
    AniBridge[<img src='./assets/images/logo.png' /> AniBridge]
    List[(📱 Anime List)]
    Mappings[(🗺️ anibridge-mappings)]

    User1 -->|Watches episodes| Library
    User2 -->|Watches movies| Library
    User3 -->|Rates & reviews| Library

    Library -->|Watch data & ratings| AniBridge
    List -->|Current anime lists| AniBridge

    AniBridge -->|ID lookups| Mappings

    AniBridge -->|Intelligent sync| List
```

<!---
https://mermaid.live/edit#pako:eNp1k91u0zAYhm_F-g7YJqX5bZcogkljRQJpldAQQqLpgZu4iYVjR7ZD17W9BoQ44HAn3ABnaDfFLgEnJSRFkCPb7_P9vJ_jLaQiIxDDiol1WmCp0fVNwpH53ioivdP54_3nb-0aeYuzXvGHij9UgqESdMo1XUosN_PTx_svD2hGMoq7s7PFAbnk9LmkWU7mT2mZIyXTZyeF1pWKHUfitZ1TXdTL2qRNBdeEazsVpUMYxWpJ-NJ5zcjtnxzOyxeXUycTqXJMMoeJXNgVz0-Qc9EXWnS9Kd029r2RStIedF3NcFVRnqsG-Prw88cnhLnpuwkflb-1hh0MDY1GF7t3WKcFUYhUVJkRq11ndzDDI7AUH-k_saDFbrA20BMkicHWQ-5owH1KlGGNmwCsmx53ve3edUtf1VKaaTa-jHdmjo_hv26njXk1RUyID3Vl0G5C_yHNVTFG86aC2vB01xYGC3LDQKxlTSwoiSxxs4VtkyMBXZCSJBCbZUZWuGY6gYTvTViF-Xshyi5SijovIF5hpsyuroxpMqU4l7hHCM-IvBI11xCf-20KiLdwC7Efhvb4PAonFmwg9lzXDscT343CsesH4yDaW3DXFnPtyAvdMPInnucHodEsMP-wFnJ2eD_tM7IA11q8MS4Ptfe_AKwuJIs
--->
