---
icon: simple/unraid
---

# Unraid

AniBridge is available in the official Community Applications (CA) catalog.

<https://ca.unraid.net/apps?app=vvkups&q=AniBridge>

1. Open **Apps** in the Unraid web UI.
2. Search for `AniBridge`.
3. Open the app and click **Install**.
4. Confirm the default values (or customize them), then click **Apply**.

By default, the template configures:

- Image: `ghcr.io/anibridge/anibridge:v2`
- Web UI: `http://[IP]:[PORT:4848]/`
- Container port: `4848` (TCP)
- App data path: `/mnt/user/appdata/anibridge` -> `/config`

After install, open the Web UI from the container page (or browse to `http://<your-unraid-ip>:4848`).

??? tip "Choosing a Release Channel"

    The official CA template supports these tags/channels:

    - `v2`: stable v2 releases
    - `latest`: latest stable release (not pinned to a specific major version)
    - `beta`: latest beta release (may be unstable)
    - `alpha`: latest alpha release (may be unstable)
    - `main`: main branch
    - `develop`: development branch
    - `experimental`: experimental branch

??? note "File Permissions"

    _Only use if your setup requires more advanced file permission handling._

    The CA template exposes `PUID`, `PGID`, and `UMASK` as advanced variables:

    - `PUID`: user ID used by the container (default `99`)
    - `PGID`: group ID used by the container (default `100`)
    - `UMASK`: default file creation mask (default `022`)
