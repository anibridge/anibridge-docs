---
icon: material/frequently-asked-questions
---

# FAQ

## Why are there no mappings for X?

While AniBridge aims to cover as many titles as possible (and we are proud to say we have one of the most comprehensive mapping databases available), there are still some titles that may not be mapped. If you get a "not found" message for one of your titles, it could be due to several reasons:

- The title is very new or obscure and has not yet been added to the mapping database.
- The title is uncorrectable due to mismatches across databases (see [anibridge/anibridge-mappings#known-issues](https://github.com/anibridge/anibridge-mappings#known-issues)).
- We just missed it!

If you find a title that is not mapped, please consider submitting a pull request to the [anibridge/anibridge-mappings](https://github.com/anibridge/anibridge-mappings) repository with your corrections or additions.

## 401 Unauthorized when using webhooks with HTTP Basic Authentication

If you are attempting to use webhooks with AniBridge and have enabled HTTP Basic Authentication for the web UI, you may encounter `401 Unauthorized` errors.

To resolve this, ensure that you include the appropriate credentials in the webhook URL (or request header if available). Example webhook URL: `http://username:password@<your-server-host>:<port>/webhook/<provider>`.

You may need to encode special characters in your username or password using [URL encoding](https://meyerweb.com/eric/tools/dencoder/). For example, if your password is `p@ssw0rd`, you would encode it as `p%40ssw0rd`.

## Why is my Plex repeat count incorrect?

AniBridge relies on your Plex server to provide accurate `viewCount` attributes when calculating the repeat count. It is a known issue that Plex may not always update this count reliably or in a way users might expect.

Certain actions can make the `viewCount` behave unexpectedly or become corrupted. Common causes include deleting and re-adding items, syncing play history across multiple devices, and manually marking an item as watched/unwatched.

If you notice discrepancies in repeat counts, consider querying your Plex server directly to verify the `viewCount` values for specific items. If the counts are incorrect at the source, AniBridge will reflect those inaccuracies. See [#174](https://github.com/anibridge/anibrige/issues/174) for more details.

_Note: the `viewCount` attribute **is not** equivalent to the number of items under "View Play History" in the Plex UI._
