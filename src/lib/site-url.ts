export function normalizeBasePath(path = ''): string {
  const normalizedPath = path.replace(/^\/+|\/+$/g, '');

  return normalizedPath ? `/${normalizedPath}` : '';
}

export function joinUrl(base: string, path = ''): string {
  const normalizedBase = base.replace(/\/+$/g, '');
  const normalizedPath = path ? `/${path.replace(/^\/+/, '')}` : '';

  return `${normalizedBase}${normalizedPath}`;
}

export function resolveSiteUrl(siteOrigin: string, basePath = ''): string {
  return joinUrl(siteOrigin, normalizeBasePath(basePath));
}
