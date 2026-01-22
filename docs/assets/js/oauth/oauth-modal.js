(() => {
  const REGISTRY_KEY = "AniBridgeOAuth";
  const QUERY_PARAM = "generate_token";
  const CALLBACK_PARAM = "callback";
  const MODAL_ID = "anibridge-oauth-modal";
  const LOCATION_WATCHER_FLAG = "__anibridgeOauthLocationWatcherInstalled";

  const utils = {
    normalizeId(value) {
      return (value ?? "").trim().toLowerCase();
    },
    buildUrl(base, params) {
      const query = new URLSearchParams(params).toString();
      return query ? `${base}?${query}` : base;
    },
    getQueryParam(name, url = window.location.href) {
      return new URL(url).searchParams.get(name);
    },
    getHashParam(name, url = window.location.href) {
      const hash = new URL(url).hash.replace(/^#/, "");
      return new URLSearchParams(hash).get(name);
    },
    getTokenFromHash(url = window.location.href, tokenLabel = "Access token") {
      const token = utils.getHashParam("access_token", url);
      if (!token) return null;
      return {
        token,
        tokenLabel,
        tokenType: utils.getHashParam("token_type", url),
        expiresIn: utils.getHashParam("expires_in", url),
      };
    },
    randomUrlSafe(byteLength = 64) {
      const bytes = new Uint8Array(byteLength);
      crypto.getRandomValues(bytes);
      let binary = "";
      for (const byte of bytes) binary += String.fromCharCode(byte);
      return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
    },
    pkcePlain(byteLength = 64) {
      const verifier = utils.randomUrlSafe(byteLength).slice(0, 96);
      return { verifier, challenge: verifier };
    },
  };

  function getRegistry() {
    if (!window[REGISTRY_KEY]) {
      window[REGISTRY_KEY] = {
        providers: {},
        utils,
        registerProvider(id, provider = {}) {
          const normalized = utils.normalizeId(id);
          if (!normalized) return;
          this.providers[normalized] = { id: normalized, ...provider };
        },
        getProvider(id) {
          return this.providers[utils.normalizeId(id)];
        },
        listProviders() {
          return Object.values(this.providers);
        },
      };
    } else if (!window[REGISTRY_KEY].utils) {
      window[REGISTRY_KEY].utils = utils;
    }

    return window[REGISTRY_KEY];
  }

  const storage = {
    get(key) {
      return sessionStorage.getItem(key);
    },
    set(key, value) {
      if (value != null) sessionStorage.setItem(key, value);
    },
    remove(...keys) {
      keys.forEach((key) => sessionStorage.removeItem(key));
    },
    getJson(key) {
      const v = this.get(key);
      if (!v) return null;
      try {
        return JSON.parse(v);
      } catch (e) {
        return null;
      }
    },
    setJson(key, value) {
      try {
        this.set(key, JSON.stringify(value));
      } catch (e) {}
    },
  };

  const getProviderIdFromUrl = () =>
    utils.normalizeId(utils.getQueryParam(QUERY_PARAM));
  const getCallbackProviderFromUrl = () =>
    utils.normalizeId(utils.getQueryParam(CALLBACK_PARAM));
  const getAuthCodeFromUrl = () => utils.getQueryParam("code");

  function removeSearchParams(url, ...names) {
    let changed = false;
    names.flat().forEach((name) => {
      if (url.searchParams.has(name)) {
        url.searchParams.delete(name);
        changed = true;
      }
    });
    return changed;
  }

  function updateUrl(mutator) {
    const url = new URL(window.location.href);
    const changed = mutator(url);
    if (changed) window.history.replaceState({}, "", url.toString());
  }

  function removeGenerateTokenParam() {
    updateUrl((url) => {
      return removeSearchParams(url, QUERY_PARAM);
    });
  }

  function removeCallbackParams() {
    updateUrl((url) => {
      const hasCallback =
        url.searchParams.has(CALLBACK_PARAM) || url.searchParams.has("code");
      const hasHashToken = url.hash?.includes("access_token");
      if (!hasCallback && !hasHashToken) return false;

      const changed = removeSearchParams(url, CALLBACK_PARAM, "code", "state");
      if (hasHashToken) url.hash = "";
      return changed || hasHashToken;
    });
  }

  const displayNameFor = (id, provider) =>
    provider?.displayName || (id ? id.toUpperCase() : "the provider");

  function el(tag, { className, text, attrs } = {}, ...children) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        if (value != null) node.setAttribute(key, value);
      });
    }
    if (children.length) node.append(...children);
    return node;
  }

  function createProviderHeader(providerId, provider) {
    const name = displayNameFor(providerId, provider);
    const wrapper = el("div", { className: "oauth-modal__provider" });

    if (provider?.logoUrl) {
      const img = el("img", {
        className: "oauth-modal__provider-logo",
        attrs: { src: provider.logoUrl, alt: `${name} logo` },
      });
      wrapper.append(img);
    } else {
      const initials = (
        (name.match(/\b\w/g) || []).slice(0, 2).join("") ||
        providerId.slice(0, 2)
      ).toUpperCase();
      const badge = el("div", {
        className: "oauth-modal__provider-badge",
        text: initials,
      });
      wrapper.append(badge);
    }

    const text = el("div", {
      className: "oauth-modal__provider-name",
      text: name,
    });
    wrapper.append(text);
    return wrapper;
  }

  function createCustomArgsSection(providerId, provider) {
    const defs = provider?.customArgs;
    if (!Array.isArray(defs) || defs.length === 0) return null;

    const storageKey = `${providerId}_auth_args`;
    const existing = storage.getJson(storageKey) || {};

    const details = el("details", { className: "oauth-modal__advanced" });
    const summary = el("summary", { text: "Advanced options" });
    const container = el("div", { className: "oauth-modal__advanced-content" });

    defs.forEach((def) => {
      const name = def.name;
      const label = el("label", {
        className: "oauth-modal__field-label",
        text: def.label || name,
      });
      let input;
      const type = def.type || "text";
      if (type === "textarea") {
        input = el("textarea", {
          className: "oauth-modal__field",
          attrs: { name },
        });
        input.rows = def.rows || 3;
      } else {
        input = el("input", {
          className: "oauth-modal__field",
          attrs: { type, name, placeholder: def.placeholder || "" },
        });
      }
      input.value = existing[name] ?? def.default ?? "";
      container.append(label, input);
    });

    details.append(summary, container);

    function read() {
      const values = {};
      for (const field of container.querySelectorAll("[name]")) {
        values[field.getAttribute("name")] = field.value;
      }
      storage.setJson(storageKey, values);
      return values;
    }

    return { element: details, read, storageKey };
  }

  function createBackdrop() {
    return el(
      "div",
      {
        className: "oauth-modal-backdrop",
        attrs: {
          id: MODAL_ID,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "oauth-modal-title",
        },
      },
      el("div", { className: "oauth-modal" }),
    );
  }

  function createConfirmModal(providerId, provider) {
    const displayName = displayNameFor(providerId, provider);
    const backdrop = createBackdrop();
    const modal = backdrop.firstElementChild;

    const providerHeader = createProviderHeader(providerId, provider);
    const customSection = createCustomArgsSection(providerId, provider);

    const closeButton = el("button", {
      className: "oauth-modal__close",
      text: "\u00d7",
      attrs: { type: "button", "aria-label": "Close" },
    });
    const title = el("h2", {
      text: "Confirm OAuth workflow",
      attrs: { id: "oauth-modal-title" },
    });
    const description = el("p", {
      text:
        "You are about to begin an OAuth workflow. After confirming, you will be redirected to " +
        `${displayName} and asked to sign in in order to generate a token for AniBridge to use.`,
    });
    const disclaimer = el("p", {
      className: "oauth-modal__disclaimer",
      text: "Do not share this token with anyone. Keep it private.",
    });
    const cancelButton = el("button", {
      className: "oauth-modal__cancel",
      text: "Cancel",
      attrs: { type: "button" },
    });
    const confirmButton = el("button", {
      className: "oauth-modal__confirm",
      text: "Continue",
      attrs: { type: "button" },
    });
    const actions = el(
      "div",
      { className: "oauth-modal__actions" },
      cancelButton,
      confirmButton,
    );

    if (customSection) modal.append(customSection.element);
    modal.append(
      closeButton,
      providerHeader,
      title,
      description,
      disclaimer,
      actions,
    );
    return {
      backdrop,
      closeButton,
      cancelButton,
      confirmButton,
      readCustomArgs: customSection?.read,
      customArgsStorageKey: customSection?.storageKey,
    };
  }

  function createTokenModal(providerId, provider) {
    const displayName = displayNameFor(providerId, provider);
    const backdrop = createBackdrop();
    const modal = backdrop.firstElementChild;

    const providerHeader = createProviderHeader(providerId, provider);

    const closeButton = el("button", {
      className: "oauth-modal__close",
      text: "\u00d7",
      attrs: { type: "button", "aria-label": "Close" },
    });
    const title = el("h2", {
      text: "OAuth token",
      attrs: { id: "oauth-modal-title" },
    });
    const status = el("p", {
      className: "oauth-modal__status",
      text: `Generating token for ${displayName}…`,
    });
    const outputLabel = el("label", {
      className: "oauth-modal__label",
      text: provider?.tokenLabel ?? "Token",
    });
    const outputField = el("textarea", {
      className: "oauth-modal__token",
    });
    outputField.readOnly = true;
    outputField.rows = 9;
    const output = el(
      "div",
      { className: "oauth-modal__output" },
      outputLabel,
      outputField,
    );
    output.hidden = true;
    const disclaimer = el("p", {
      className: "oauth-modal__disclaimer",
      text: "Do not share this token with anyone. Keep it private.",
    });
    const copyButton = el("button", {
      className: "oauth-modal__copy",
      text: "Copy",
      attrs: { type: "button" },
    });
    copyButton.disabled = true;
    const doneButton = el("button", {
      className: "oauth-modal__confirm",
      text: "Close",
      attrs: { type: "button" },
    });
    const actions = el(
      "div",
      { className: "oauth-modal__actions" },
      copyButton,
      doneButton,
    );

    modal.append(
      closeButton,
      providerHeader,
      title,
      status,
      output,
      disclaimer,
      actions,
    );
    return {
      backdrop,
      closeButton,
      doneButton,
      copyButton,
      status,
      output,
      outputField,
      outputLabel,
    };
  }

  function openModal(backdrop, onClose, { initialFocus } = {}) {
    if (document.getElementById(MODAL_ID)) return false;

    const controller =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    const signal = controller?.signal;
    const previouslyFocused = document.activeElement;

    const listeners = [];
    const on = (target, eventName, handler, options = undefined) => {
      target.addEventListener(eventName, handler, options);
      listeners.push(() =>
        target.removeEventListener(eventName, handler, options),
      );
    };

    const close = () => {
      if (controller) controller.abort();
      listeners.splice(0).forEach((off) => off());
      backdrop.remove();
      document.body.classList.remove("oauth-modal-open");
      try {
        if (
          previouslyFocused &&
          typeof previouslyFocused.focus === "function"
        ) {
          previouslyFocused.focus();
        }
      } catch {}
      onClose?.();
    };

    on(
      backdrop,
      "click",
      (event) => {
        if (event.target === backdrop) close();
      },
      signal ? { signal } : undefined,
    );

    on(
      document,
      "keydown",
      (event) => {
        if (event.key === "Escape") close();
      },
      signal ? { signal } : undefined,
    );

    document.body.append(backdrop);
    document.body.classList.add("oauth-modal-open");

    if (initialFocus && typeof initialFocus.focus === "function") {
      initialFocus.focus();
    }
    return close;
  }

  function showModal(providerId, provider) {
    const {
      backdrop,
      cancelButton,
      confirmButton,
      closeButton,
      readCustomArgs,
      customArgsStorageKey,
    } = createConfirmModal(providerId, provider);

    const close = openModal(backdrop, removeGenerateTokenParam, {
      initialFocus: closeButton,
    });
    if (!close) return;

    async function handleConfirm() {
      confirmButton.disabled = true;
      confirmButton.textContent = "Redirecting…";

      try {
        const opts = readCustomArgs?.() ?? {};
        const result = await provider.makeAuthUrl(opts);
        if (!result?.url) throw new Error("Provider did not return a URL.");

        if (result.codeVerifier) {
          const storageKey =
            provider.storageKey ?? `${providerId}_code_verifier`;
          storage.set(storageKey, result.codeVerifier);
        }
        if (result.redirectUri) {
          const redirectKey =
            provider.redirectUriStorageKey ?? `${providerId}_redirect_uri`;
          storage.set(redirectKey, result.redirectUri);
        }

        window.location.href = result.url;
      } catch (error) {
        confirmButton.disabled = false;
        confirmButton.textContent = "Continue";
        console.error(error);
        alert("Unable to start OAuth. Please try again.");
      }
    }

    cancelButton.addEventListener("click", close);
    closeButton.addEventListener("click", close);
    confirmButton.addEventListener("click", handleConfirm);
  }

  function showTokenModal(providerId, provider) {
    const modal = createTokenModal(providerId, provider);
    const close = openModal(modal.backdrop, removeCallbackParams, {
      initialFocus: modal.closeButton,
    });
    if (!close) return null;

    modal.closeButton.addEventListener("click", close);
    modal.doneButton.addEventListener("click", close);
    modal.copyButton.addEventListener("click", async () => {
      if (!modal.outputField.value) return;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(modal.outputField.value);
        } else {
          modal.outputField.focus();
          modal.outputField.select();
          document.execCommand("copy");
          modal.outputField.setSelectionRange(0, 0);
        }
        modal.copyButton.textContent = "Copied";
        setTimeout(() => {
          modal.copyButton.textContent = "Copy";
        }, 1500);
      } catch (error) {
        console.error(error);
      }
    });

    return modal;
  }

  function setToken(modal, provider, tokenInfo) {
    modal.outputLabel.textContent =
      tokenInfo.tokenLabel ?? provider.tokenLabel ?? "Token";
    modal.outputField.value = tokenInfo.token;
    modal.output.hidden = false;
    modal.copyButton.disabled = false;
    modal.status.textContent = "Token generated. Copy it and keep it secure.";

    if (provider.tokenStorageKey) {
      storage.set(provider.tokenStorageKey, tokenInfo.token);
    }
  }

  function tryOpenModal() {
    const providerId = getProviderIdFromUrl();
    if (!providerId) return;

    const provider = getRegistry().getProvider(providerId);
    if (!provider || typeof provider.makeAuthUrl !== "function") return;

    showModal(providerId, provider);
  }

  async function tryHandleCallback() {
    const providerId = getCallbackProviderFromUrl();
    if (!providerId) return false;

    const provider = getRegistry().getProvider(providerId);
    if (
      !provider ||
      (!provider.exchangeToken && !provider.getTokenFromCallback)
    ) {
      return false;
    }

    const code = getAuthCodeFromUrl();
    const storedArgs = storage.getJson(`${providerId}_auth_args`) || {};
    const tokenFromCallback = provider.getTokenFromCallback?.(
      window.location.href,
      storedArgs,
    );
    if (!code && !tokenFromCallback?.token) return false;

    const modal = showTokenModal(providerId, provider);
    if (!modal) return false;

    try {
      if (tokenFromCallback?.token) {
        setToken(modal, provider, tokenFromCallback);
        return true;
      }

      const verifierKey = provider.storageKey ?? `${providerId}_code_verifier`;
      const redirectKey =
        provider.redirectUriStorageKey ?? `${providerId}_redirect_uri`;
      const codeVerifier = storage.get(verifierKey);
      const redirectUri =
        storage.get(redirectKey) ??
        (() => {
          const url = new URL(window.location.href);
          removeSearchParams(url, "code", "state");
          url.hash = "";
          return url.toString();
        })();

      const result = await provider.exchangeToken({
        code,
        codeVerifier,
        redirectUri,
        ...storedArgs,
      });

      if (!result?.token) throw new Error("Provider did not return a token.");
      setToken(modal, provider, result);
      storage.remove(verifierKey, redirectKey, `${providerId}_auth_args`);
      return true;
    } catch (error) {
      console.error(error);
      modal.status.textContent =
        "Unable to generate a token. Please try again.";
      modal.status.classList.add("oauth-modal__status--error");
      return true;
    }
  }

  function setupLocationWatcher() {
    if (window[LOCATION_WATCHER_FLAG]) return;
    window[LOCATION_WATCHER_FLAG] = true;

    const run = () => {
      tryHandleCallback();
      tryOpenModal();
    };

    ["DOMContentLoaded", "load", "popstate"].forEach((eventName) => {
      window.addEventListener(eventName, run);
    });

    const patchHistory = (method) => {
      const original = history[method];
      if (original.__anibridgeOauthPatched) return;
      history[method] = function patched(...args) {
        original.apply(this, args);
        window.dispatchEvent(new Event("anibridge:locationchange"));
      };
      history[method].__anibridgeOauthPatched = true;
    };

    patchHistory("pushState");
    patchHistory("replaceState");
    window.addEventListener("anibridge:locationchange", run);
  }

  getRegistry();
  setupLocationWatcher();
})();
