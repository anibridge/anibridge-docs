(() => {
  const PIN_URL = "https://api.simkl.com/oauth/pin";
  const PIN_STATUS_BASE_URL = "https://api.simkl.com/oauth/pin";
  const DEFAULT_CLIENT_ID =
    "966b70652bf3ebbe46556dde9aa5a88e903790ae448c30b9866584743a6fc39e";

  const registry = window.AniBridgeOAuth;
  if (!registry || typeof registry.registerProvider !== "function") return;

  const { utils } = registry;

  function buildStatusUrl(userCode, clientId) {
    return utils.buildUrl(
      `${PIN_STATUS_BASE_URL}/${encodeURIComponent(userCode)}`,
      {
        client_id: clientId,
      },
    );
  }

  async function requestPin(opts = {}) {
    const clientId = opts.clientId ?? DEFAULT_CLIENT_ID;
    const response = await fetch(
      utils.buildUrl(PIN_URL, {
        client_id: clientId,
      }),
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to request a Simkl verification code (${response.status} ${response.statusText}): ${errorText}`,
      );
    }

    const data = await response.json();
    if (data?.result !== "OK" || !data?.user_code || !data?.verification_url) {
      throw new Error("Simkl did not return a valid verification code.");
    }

    return {
      deviceCode: data.device_code,
      userCode: data.user_code,
      verificationUrl: data.verification_url,
      expiresIn: data.expires_in,
      interval: data.interval,
      raw: data,
    };
  }

  async function makeAuthUrl(opts = {}) {
    const pin = await requestPin(opts);
    return {
      deviceCode: pin.deviceCode,
      userCode: pin.userCode,
      verificationUrl: pin.verificationUrl,
      openUrl: pin.verificationUrl,
      expiresIn: pin.expiresIn,
      pollInterval: pin.interval,
      codeLabel: "Verification code",
      helpText:
        "Open the Simkl verification page, sign in, and enter this code to authorize AniBridge.",
      statusText: "Waiting for Simkl authorization…",
    };
  }

  async function pollForToken(opts = {}) {
    const clientId = opts.clientId ?? DEFAULT_CLIENT_ID;
    const userCode = opts.userCode ?? opts.code;

    if (!userCode) {
      throw new Error("Missing Simkl verification code.");
    }

    const response = await fetch(buildStatusUrl(userCode, clientId), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to check Simkl authorization status (${response.status} ${response.statusText}): ${errorText}`,
      );
    }

    const data = await response.json();

    if (data?.result === "OK" && data?.access_token) {
      return {
        token: data.access_token,
        tokenLabel: "Token",
        raw: data,
      };
    }

    const message = String(data?.message ?? "Authorization pending");
    if (/authorization pending/i.test(message)) {
      return {
        pending: true,
        retryAfter: opts.pollInterval ?? 5,
        statusText: "Waiting for Simkl authorization…",
      };
    }

    if (/slow down/i.test(message)) {
      const retryAfter = Math.max(Number(opts.pollInterval ?? 5) || 5, 5) + 1;
      return {
        pending: true,
        retryAfter,
        statusText: "Waiting for Simkl authorization…",
      };
    }

    if (/expired/i.test(message)) {
      throw new Error(
        "The Simkl verification code expired. Start the authorization flow again.",
      );
    }

    throw new Error(`Simkl authorization failed: ${message}`);
  }

  registry.registerProvider("simkl", {
    displayName: "Simkl",
    logoUrl: "https://cdn.simpleicons.org/simkl",
    customArgs: [
      { name: "clientId", label: "Client ID", default: DEFAULT_CLIENT_ID },
    ],
    tokenLabel: "Token",
    tokenStorageKey: "simkl_access_token",
    makeAuthUrl,
    pollForToken,
  });
})();
