export type CommonsPhoto = {
  thumbnailUrl: string;
  sourceUrl: string;
  fileName: string;
  creator: string;
  license: string;
};

const photoCache = new Map<string, Promise<CommonsPhoto[]>>();

function stripMarkup(value: string | undefined): string {
  return (value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#160;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function findCommonsPhotos(searchName: string, limit = 3): Promise<CommonsPhoto[]> {
  const normalizedName = `${searchName.toLocaleLowerCase()}:${limit}`;
  const cached = photoCache.get(normalizedName);
  if (cached) return cached;

  const parameters = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: searchName,
    gsrnamespace: '6',
    gsrlimit: String(limit),
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '720',
    format: 'json',
    origin: '*',
  });
  const request = fetch(`https://commons.wikimedia.org/w/api.php?${parameters.toString()}`)
    .then((response) => response.ok ? response.json() : null)
    .then((data) => {
      const pages = Object.values(data?.query?.pages ?? {}) as {
        title?: string;
        imageinfo?: {
          thumburl?: string;
          descriptionurl?: string;
          extmetadata?: {
            Artist?: { value?: string };
            LicenseShortName?: { value?: string };
          };
        }[];
      }[];
      return pages.flatMap((page) => {
        const info = page.imageinfo?.[0];
        const thumbnailUrl = info?.thumburl;
        const sourceUrl = info?.descriptionurl;
        const license = stripMarkup(info?.extmetadata?.LicenseShortName?.value);
        if (!thumbnailUrl || !sourceUrl || !license) return [];
        return [{
          thumbnailUrl,
          sourceUrl,
          fileName: (page.title ?? 'Wikimedia Commons image').replace(/^File:/, ''),
          creator: stripMarkup(info?.extmetadata?.Artist?.value) || 'Creator listed on source page',
          license,
        }];
      });
    })
    .catch(() => []);
  photoCache.set(normalizedName, request);
  return request;
}
