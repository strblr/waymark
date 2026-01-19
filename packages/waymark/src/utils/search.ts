export function toSearchString(search: Record<string, unknown>) {
  const toValueString = (value: unknown) => {
    if (typeof value === "string" && !isJSONString(value)) {
      return value;
    }
    return JSON.stringify(value);
  };
  return Object.entries(search)
    .map(([key, value]) => `${key}=${encodeURIComponent(toValueString(value))}`)
    .join("&");
}

export function parseSearchParams(search: string): Record<string, unknown> {
  const urlSearch = new URLSearchParams(search);
  return Object.fromEntries(
    [...urlSearch.entries()].map(([key, value]) => {
      value = decodeURIComponent(value);
      return [key, isJSONString(value) ? JSON.parse(value) : value];
    })
  );
}

function isJSONString(value: string) {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}
