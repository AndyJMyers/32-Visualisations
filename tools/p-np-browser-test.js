/* Run with CHROME_PATH and NODE_PATH after starting the local server. */
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH,
    headless: true,
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' });
    const state = await page.evaluate(() => {
      setSeason('autumn');
      visualizerSelect.value = 'pnp';
      visualizerSelect.dispatchEvent(new Event('change'));
      drawAutumnFrame(visualizer.getContext('2d'));
      return {
        count: visualizerSelect.options.length,
        selected: visualizerSelect.value,
        forms: Array.from(fireworkFormSelect.options, option => option.value),
      };
    });
    assert.equal(state.count, 31);
    assert.equal(state.selected, 'pnp');
    assert.deepEqual(state.forms, ['blueprint', 'chalk', 'clockwork', 'cosmos']);
    assert.deepEqual(errors, []);
    if (process.env.PNP_BROWSER_PREVIEW) await page.screenshot({ path: process.env.PNP_BROWSER_PREVIEW });
    console.log('P = NP? loads and renders in the browser with four alchemies.');
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
