const puppeteer = require('puppeteer')
const { selectStampAndUpload, assertUploadedContentAtPath } = require('../helpers')
const { Click } = require('../library')

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function testWebsiteRegression03(page) {
  await Click.elementWithText(page, 'a', 'Files')
  await Click.elementWithTextAndUpload(page, 'button', 'Add Website', 'test-data/website-regression-03')
  const swarmHash = await selectStampAndUpload(page)
  await assertUploadedContentAtPath(swarmHash, 'index.html', 'text/html; charset=utf-8')
  await assertUploadedContentAtPath(swarmHash, 'asset-manifest.json', 'application/json')
  await assertUploadedContentAtPath(swarmHash, 'favicons/favicon-32x32.png', 'image/png')
  await assertUploadedContentAtPath(swarmHash, 'favicons/mstile-150x150.png', 'image/png')
  await assertUploadedContentAtPath(swarmHash, 'static/css/main.5d7e79b3.chunk.css', 'text/css; charset=utf-8')
  await assertUploadedContentAtPath(swarmHash, 'static/js/3.b14382bb.chunk.js', 'application/javascript')
  await assertUploadedContentAtPath(swarmHash, 'static/js/runtime-main.c39837bc.js.map', '')
  await assertUploadedContentAtPath(swarmHash, 'static/media/arrow-up.5a74c4fc.svg', 'image/svg+xml')
}

module.exports = { testWebsiteRegression03 }
