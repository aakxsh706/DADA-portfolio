const path = require('path');
const fs = require('fs');
/**
 * Re-captures real screenshots of the live client websites into public/projects/.
 *
 * Usage (Playwright is not a project dependency — run it ad hoc):
 *   npx -y playwright@latest install chromium   # once
 *   node scripts/capture-project-screenshots.cjs
 *
 * Output: public/projects/<slug>/{desktop-fold,mobile-fold}.jpg (+ PNG originals in .captures/)
 * Convert / resize afterwards with any tool (macOS: `sips -s format jpeg -Z 1920 in.png --out out.jpg`).
 */
const { chromium } = require('playwright');
const out = process.argv[2] || path.join(__dirname, '..', '.captures');
fs.mkdirSync(out, { recursive: true });
const sites = [
  { slug: 'ss-builders', url: 'https://ssbuilders18.com/' },
  { slug: 'belin-dentistry', url: 'https://www.drbelinsdentistry.com/' },
];
async function settle(page) {
  await page.evaluate(async () => {
    const h = document.body.scrollHeight; let y = 0;
    while (y < h) { window.scrollTo(0, y); y += 600; await new Promise(r => setTimeout(r, 120)); }
    window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
  });
}
(async () => {
  const browser = await chromium.launch();
  const report = {};
  for (const s of sites) {
    report[s.slug] = {};
    for (const vp of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844, mobile: true }]) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2, isMobile: !!vp.mobile, hasTouch: !!vp.mobile });
      const page = await ctx.newPage();
      try {
        await page.goto(s.url, { waitUntil: 'load', timeout: 90000 });
        await page.waitForTimeout(4000);
        await settle(page);
        await page.screenshot({ path: path.join(out, `${s.slug}-${vp.name}-fold.png`) });
        await page.screenshot({ path: path.join(out, `${s.slug}-${vp.name}-full.png`), fullPage: true });
        if (vp.name === 'desktop') {
          report[s.slug] = await page.evaluate(() => {
            const cs = getComputedStyle(document.body);
            const meta = (n) => document.querySelector(`meta[name="${n}"],meta[property="${n}"]`)?.getAttribute('content') || null;
            const fonts = new Set();
            document.querySelectorAll('h1,h2,h3,p,a,button,span').forEach(el => fonts.add(getComputedStyle(el).fontFamily));
            const colors = {};
            document.querySelectorAll('*').forEach(el => { const c = getComputedStyle(el); for (const k of [c.backgroundColor, c.color]) { if (c && k && k !== 'rgba(0, 0, 0, 0)') colors[k] = (colors[k] || 0) + 1; } });
            const top = Object.entries(colors).sort((a, b) => b[1] - a[1]).slice(0, 12);
            return { title: document.title, description: meta('description'), ogImage: meta('og:image'), themeColor: meta('theme-color'), bodyBg: cs.backgroundColor, bodyColor: cs.color, fonts: [...fonts].slice(0, 8), topColors: top, h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()).slice(0, 3), height: document.body.scrollHeight, logo: [...document.querySelectorAll('img')].slice(0, 6).map(i => ({ src: i.currentSrc || i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight })) };
          });
        }
      } catch (e) { report[s.slug].error = String(e); }
      await ctx.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})();
