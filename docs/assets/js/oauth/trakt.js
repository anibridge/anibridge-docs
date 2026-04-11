(() => {
  const AUTH_URL = "https://trakt.tv/oauth/authorize";
  const TOKEN_URL = "https://api.trakt.tv/oauth/token";
  const DEFAULT_CLIENT_ID =
    "fab91d3719c4206245850c46022ba5a571677ee62a886cfd8da8fc93db4e9f7c";
  const DEFAULT_REDIRECT_URI = `${window.location.origin}?callback=trakt`;

  const registry = window.AniBridgeOAuth;
  if (!registry || typeof registry.registerProvider !== "function") return;

  const { utils } = registry;

  function makeAuthUrl(opts = {}) {
    const clientId = opts.clientId ?? DEFAULT_CLIENT_ID;
    const redirectUri = opts.redirectUri ?? DEFAULT_REDIRECT_URI;
    const url = utils.buildUrl(AUTH_URL, {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
    });

    return { url, redirectUri };
  }

  async function exchangeToken(opts = {}) {
    const clientId = opts.clientId ?? DEFAULT_CLIENT_ID;
    const redirectUri = opts.redirectUri ?? DEFAULT_REDIRECT_URI;
    const { code } = opts;

    if (!code) throw new Error("Missing authorization code.");

    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: clientId,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Token exchange failed (${response.status} ${response.statusText}): ${errorText}`,
      );
    }

    return response.json();
  }

  registry.registerProvider("trakt", {
    displayName: "Trakt",
    logoUrl: "https://cdn.simpleicons.org/trakt",
    customArgs: [
      { name: "clientId", label: "Client ID", default: DEFAULT_CLIENT_ID },
      {
        name: "redirectUri",
        label: "Redirect URI",
        default: DEFAULT_REDIRECT_URI,
      },
    ],
    tokenLabel: "Refresh token",
    tokenStorageKey: "trakt_refresh_token",
    makeAuthUrl,
    exchangeToken: async (opts) => {
      const data = await exchangeToken(opts);
      return {
        token: data?.refresh_token,
        tokenLabel: "Refresh token",
        raw: data,
      };
    },
  });
})();
