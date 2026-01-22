---
icon: simple/quicklook
---

# Mappings Querying Language

AniBridge provides a Booru-like querying language for searching the mappings database and AniList API. You can use this language on the [Mappings Page](../web/screenshots.md#mappings) of the web interface or through the API at:

```
/api/mappings?q=<query>
```

## Basic Syntax

The querying language supports a wide range of operators to build flexible and complex queries. The web UI includes a search bar with query suggestions to help you construct valid queries.

**Escaping Reserved Characters:** Certain characters have special meanings in the querying language (e.g., commas, parentheses). To include these characters as literal values, wrap the value in double quotes. E.g. `foo:"bar,baz"` treats `bar,baz` as a single literal value rather than a list of two values.

### Search Terms

- **Fielded search:** `foo:bar` → Search for `bar` in field `foo`
- **AniList search:** `"foo"` → Search AniList API for the bare term `foo`

### Boolean Operators

- **AND:** `foo bar` → Search for results matching both `foo` _and_ `bar`
- **OR (prefix):** `~foo ~bar baz` → Search for `(foo OR bar) AND baz` _(tilde marks OR terms within an AND group)_
- **OR (infix):** `foo | bar baz` → Search for `foo OR (bar AND baz)` _(pipe creates OR between AND expressions)_
- **NOT:** `-foo` → Exclude results matching `foo`

### Grouping

- `(foo | bar) baz` → Search for `(foo OR bar) AND baz`

## IN Lists

- `foo:bar,baz,qux` → Search for mappings where field `foo` matches any of the values `bar`, `baz`, or `qux`

_Note: IN lists are not supported for all fields. The web UI will only suggest an IN list when it is supported for the selected field. See [`/api/mappings/query-capabilities`](../web/api.md) for details on which fields support IN lists._

### Ranges

- `foo:<10` → Search where `foo` is less than 10
- `foo:100..210` → Search where `foo` is between 100 and 210

### Wildcards

Use `*` for any sequence of characters and `?` for a single character. Matching is case-insensitive.

- `foo:bar*` → Search for mappings where field `foo` starts with `bar`
- `foo:*bar` → Search for mappings where field `foo` ends with `bar`
- `foo:b?r` → Search for mappings where field `foo` matches `b?r` (e.g., `bar`, `ber`, `bir`, etc.)

### Querying JSON fields

For fields that store JSON dictionaries, you can use the following syntax:

- `foo:bar` → Search for mappings where the JSON field `foo` contains the key `bar` or the value `bar`
- `foo:bar*` → Search for mappings where the JSON field `foo` contains a key starting with `bar` or a value starting with `bar`. All other wildcard patterns are also supported.

## Supported Database Fields

When querying the local mappings database, there are three categories of fields you can use: **source nodes**, **target nodes**, and **edges**.

A node represents an identifier for an entry in some source (e.g., AniList, TMDB, TVDB, IMDb). An edge represents an episode mapping between two nodes. To illustrate:

```yaml
anilist:9999: # Source node
  tvdb_show:8888:s1: # Target node
    "1-12": "1-12" # Edge
```

With these concepts in mind, here are the supported fields:

- `source.provider` → Source node provider (e.g., anilist, tvdb, tmdb_show, imdb, etc.)
- `source.id` → Source node ID
- `source.scope` → Source node scope (e.g., s0, s1, etc.)
- `target.provider` → Target node provider (e.g., anilist, tvdb, tmdb_show, imdb, etc.)
- `target.id` → Target node ID
- `target.scope` → Target node scope (e.g., s0, s1, etc.)
- `edge.source_range` → Edge source range (e.g., 1-12)
- `edge.target_range` → Edge target range (e.g., 1-12)

## Supported AniList Fields

The following fields are queried against the AniList API:

- `"foo"` → Searches AniList for the bare term `foo`.
- `anilist.title"` → Alias for `"foo"`, searches AniList for the bare term `foo`.
- `anilist.duration` → Duration in minutes
- `anilist.episodes` → Number of episodes
- `anilist.start_date` → Start date (YYYYMMDD)
- `anilist.end_date` → End date (YYYYMMDD)
- `anilist.format` → Format (e.g., TV, MOVIE, OVA, etc.)
- `anilist.status` → Status (e.g., FINISHED, RELEASING, NOT_YET_RELEASED, etc.)
- `anilist.genre` → Genre (e.g., Action, Comedy, Drama, etc.)
- `anilist.tag` → Tag (e.g., Mecha, School, Shounen, etc.)
- `anilist.average_score` → Average score (0-100)
- `anilist.popularity` → Popularity (number of AniList users with the entry in their list)

## Example Queries

```bash
"Dororo"
# Title search for "Dororo"

source.provider:anilist source.id:12345
# Source AniList ID lookup

source.provider:anilist | source.provider:mal
# Source is AniList OR MyAnimeList

target.provider:anilist target.id:>100000
# Target AniList IDs greater than 100000

-(source.id:100..200)
# Exclude IDs 100 to 200 (inclusive)

target.id:tt0*
# IDs starting with "tt0" (IMDB IDs)

source.descriptor:s0
# Look for season 0 (specials) in source nodes

edge.source_range:12-*
# Edges where source range starts at episode 12

anilist.status:RELEASING anilist.genre:Action
# Currently releasing anime in the Action genre

-anilist.format:SPECIAL,OVA
# Exclude anime in the Special or OVA formats

anilist.format:TV anilist.average_score:>80 anilist.popularity:>5000
# TV format anime with average score over 80 and popularity over 5000
```
