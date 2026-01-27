export function stringifySearch(search: Record<string, unknown>) {
  return Object.entries(search)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(toValueString(value))}`)
    .join("&");
}

export function parseSearch(search: string): Record<string, unknown> {
  const urlSearch = new URLSearchParams(search);
  return Object.fromEntries(
    [...urlSearch.entries()].map(([key, value]) => {
      value = decodeURIComponent(value);
      return [key, isJSONString(value) ? JSON.parse(value) : value];
    })
  );
}

function toValueString(value: unknown) {
  return typeof value === "string" && !isJSONString(value)
    ? value
    : JSON.stringify(value);
}

function isJSONString(value: string) {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}
