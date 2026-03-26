(() => {
  const PLEX_PIN_CREATE_URL = "https://plex.tv/api/v2/pins?strong=true";
  const PLEX_PIN_STATUS_BASE_URL = "https://plex.tv/api/v2/pins";
  const PLEX_AUTH_URL = "https://app.plex.tv/auth";
  const DEFAULT_PRODUCT = "AniBridge";

  const registry = window.AniBridgeOAuth;
  if (!registry || typeof registry.registerProvider !== "function") return;

  const { utils } = registry;

  function randomClientIdentifier() {
    return `anibridge-${utils.randomUrlSafe(24)}`;
  }

  function normalizeRedirectBase(rawValue) {
    if (!rawValue) {
      return `${window.location.origin}${window.location.pathname}`;
    }

    try {
      const url = new URL(rawValue, window.location.href);
      url.search = "";
      url.hash = "";
      return url.toString();
    } catch {
      return `${window.location.origin}${window.location.pathname}`;
    }
  }

  function buildPlexHeaders(opts = {}) {
    const clientIdentifier =
      opts.clientIdentifier || opts.clientId || randomClientIdentifier();
    const product = opts.product || DEFAULT_PRODUCT;

    return {
      "X-Plex-Product": product,
      "X-Plex-Client-Identifier": clientIdentifier,
      Accept: "application/json",
    };
  }

  function readPinResponse(data) {
    const payload = data?.pin || data || {};
    return {
      id: payload.id,
      code: payload.code,
      token: payload.authToken || payload.auth_token,
    };
  }

  async function createPin(opts = {}) {
    const headers = buildPlexHeaders(opts);
    const response = await fetch(PLEX_PIN_CREATE_URL, {
      method: "POST",
      headers,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Failed to create Plex PIN (${response.status} ${response.statusText}): ${text}`,
      );
    }

    const data = await response.json();
    const pin = readPinResponse(data);
    if (!pin.id || !pin.code) {
      throw new Error("Plex PIN response is missing required fields.");
    }

    return pin;
  }

  function buildAuthUrl(pin, opts = {}) {
    const redirectBase = normalizeRedirectBase(
      opts.redirectUri || opts.forwardUrl,
    );
    const callbackUrl = utils.buildUrl(redirectBase, {
      callback: "plex",
      code: String(pin.id),
    });

    const hashParams = new URLSearchParams({
      clientID: opts.clientIdentifier || opts.clientId,
      code: pin.code,
      forwardUrl: callbackUrl,
      "context[device][product]": opts.product || DEFAULT_PRODUCT,
    });

    return `${PLEX_AUTH_URL}#?${hashParams.toString()}`;
  }

  async function makeAuthUrl(opts = {}) {
    const mergedOpts = {
      clientIdentifier:
        opts.clientIdentifier || opts.clientId || randomClientIdentifier(),
      product: opts.product || DEFAULT_PRODUCT,
      redirectUri: opts.redirectUri,
    };

    const pin = await createPin(mergedOpts);
    const url = buildAuthUrl(pin, mergedOpts);

    return {
      url,
      redirectUri: normalizeRedirectBase(mergedOpts.redirectUri),
    };
  }

  async function exchangeToken(opts = {}) {
    const pinId = opts.code;
    if (!pinId) {
      throw new Error("Missing Plex PIN identifier.");
    }

    const headers = buildPlexHeaders(opts);
    const response = await fetch(
      `${PLEX_PIN_STATUS_BASE_URL}/${encodeURIComponent(pinId)}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Failed to fetch Plex PIN status (${response.status} ${response.statusText}): ${text}`,
      );
    }

    const data = await response.json();
    const pin = readPinResponse(data);

    if (!pin.token) {
      throw new Error(
        "Plex authentication is not complete yet. Approve the sign-in request and try again.",
      );
    }

    return {
      token: pin.token,
      tokenLabel: "Plex token",
      raw: data,
    };
  }

  registry.registerProvider("plex", {
    displayName: "Plex",
    logoUrl: "https://cdn.simpleicons.org/plex",
    customArgs: [
      {
        name: "clientIdentifier",
        label: "Client Identifier",
        default: randomClientIdentifier(),
      },
      { name: "product", label: "Product", default: DEFAULT_PRODUCT },
      {
        name: "redirectUri",
        label: "Redirect URI",
        default: `${window.location.origin}${window.location.pathname}`,
      },
    ],
    tokenLabel: "Plex token",
    tokenStorageKey: "plex_token",
    makeAuthUrl,
    exchangeToken,
  });
})();
