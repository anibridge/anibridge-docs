(() => {
  const AUTH_URL = "https://anilist.co/api/v2/oauth/authorize";
  const DEFAULT_CLIENT_ID = "34003";

  const registry = window.AniBridgeOAuth;
  if (!registry || typeof registry.registerProvider !== "function") return;

  const { utils } = registry;

  function makeAuthUrl(opts = {}) {
    const clientId = opts.clientId ?? DEFAULT_CLIENT_ID;
    const url = utils.buildUrl(AUTH_URL, {
      client_id: clientId,
      response_type: "token",
    });
    return { url };
  }

  registry.registerProvider("anilist", {
    displayName: "AniList",
    logoUrl: "https://cdn.simpleicons.org/anilist",
    customArgs: [
      { name: "clientId", label: "Client ID", default: DEFAULT_CLIENT_ID },
    ],
    tokenLabel: "Access token",
    tokenStorageKey: "anilist_access_token",
    makeAuthUrl,
    getTokenFromCallback: (url) => utils.getTokenFromHash(url, "Access token"),
  });
})();
