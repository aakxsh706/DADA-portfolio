import { ImageResponse } from 'next/og';
import { siteConfig } from '@/data/site-config';

export const alt = `${siteConfig.name} — freelance web design & development studio`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Loads Space Grotesk as TTF for the image renderer; falls back silently. */
async function loadHeadingFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap',
      { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0' } },
    ).then((r) => r.text());
    const match = css.match(/src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/);
    if (!match) return null;
    return await fetch(match[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const font = await loadHeadingFont();
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          background: '#101010',
          color: '#F5F2EB',
          fontFamily: font ? 'Space Grotesk' : 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, letterSpacing: 4 }}>
          <span>{siteConfig.name.toUpperCase()}</span>
          <span style={{ color: '#999999' }}>{siteConfig.location.toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 112, fontWeight: 700, lineHeight: 0.92, letterSpacing: -5 }}>
          <span>WE BUILD DIGITAL</span>
          <span>
            EXPERIENCES THAT
          </span>
          <span style={{ display: 'flex' }}>
            STAND OUT<span style={{ color: '#D7FF45' }}>.</span>
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#999999' }}>
          <span>Web design · Development · Interactive experiences</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 12, height: 12, borderRadius: 999, background: '#D7FF45' }} />
            {siteConfig.availability}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: 'Space Grotesk', data: font, weight: 700, style: 'normal' }] : undefined,
    },
  );
}
