(() => {
  const AUTH_URL = "https://myanimelist.net/v1/oauth2/authorize";
  const CORS_PROXY_BASE = "https://cors-proxy.anibridge.eliasbenb.dev/mal/";
  const DEFAULT_CLIENT_ID = "b11a4e1ead0db8142268906b4bb676a4";
  const DEFAULT_REDIRECT_URI = `${window.location.origin}?callback=mal`;

  const registry = window.AniBridgeOAuth;
  if (!registry || typeof registry.registerProvider !== "function") return;
  const { utils } = registry;

  function makeAuthUrl(opts = {}) {
    const clientId = opts.clientId ?? DEFAULT_CLIENT_ID;
    const redirectUri = opts.redirectUri ?? DEFAULT_REDIRECT_URI;
    const { verifier, challenge } = utils.pkcePlain();
    const url = utils.buildUrl(AUTH_URL, {
      response_type: "code",
      client_id: clientId,
      code_challenge: challenge,
      code_challenge_method: "plain",
      redirect_uri: redirectUri,
    });
    return { url, codeVerifier: verifier, redirectUri };
  }

  async function exchangeToken(opts = {}) {
    const clientId = opts.clientId ?? DEFAULT_CLIENT_ID;
    const redirectUri = opts.redirectUri ?? DEFAULT_REDIRECT_URI;
    const { code, codeVerifier } = opts;
    const proxyBase = (opts.proxyBase ?? CORS_PROXY_BASE).replace(/\/?$/, "/");

    if (!code) throw new Error("Missing authorization code.");
    if (!codeVerifier) throw new Error("Missing PKCE code verifier.");

    const params = new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
    });

    const proxyUrl = `${proxyBase}v1/oauth2/token`;
    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Token exchange failed (${response.status} ${response.statusText}): ${errorText}`,
      );
    }

    return response.json();
  }

  registry.registerProvider("mal", {
    displayName: "MyAnimeList",
    logoUrl: "https://cdn.simpleicons.org/myanimelist",
    customArgs: [
      { name: "clientId", label: "Client ID", default: DEFAULT_CLIENT_ID },
      {
        name: "redirectUri",
        label: "Redirect URI",
        default: DEFAULT_REDIRECT_URI,
      },
      { name: "proxyBase", label: "CORS Proxy Base", default: CORS_PROXY_BASE },
    ],
    storageKey: "mal_code_verifier",
    tokenLabel: "Refresh token",
    tokenStorageKey: "mal_refresh_token",
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
