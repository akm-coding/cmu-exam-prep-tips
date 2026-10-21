// Client-side helpers. A student can store their own free Gemini key in this
// browser; it is sent only to this app's API routes, which pass it to Google.

const KEY_STORAGE = "cmu-prep:user-api-key";

export function getUserKey(): string {
  try {
    return localStorage.getItem(KEY_STORAGE) ?? "";
  } catch {
    return "";
  }
}

export function setUserKey(key: string) {
  try {
    if (key) localStorage.setItem(KEY_STORAGE, key);
    else localStorage.removeItem(KEY_STORAGE);
  } catch {
    // Storage blocked (private mode): the key just won't be remembered.
  }
}

export function postJson(url: string, body: unknown) {
  const key = getUserKey();
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(key ? { "x-user-api-key": key } : {}) },
    body: JSON.stringify(body),
  });
}
