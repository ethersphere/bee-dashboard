const puppeteer = require('puppeteer')
const { selectStampAndUpload, assertUploadedContentAtPath } = require('../helpers')
const { Click } = require('../library')

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function testReactWebsiteUpload(page) {
  await Click.elementWithText(page, 'a', 'Files')
  await Click.elementWithTextAndUpload(page, 'button', 'Add Website', 'test-data/test-react-website')
  const swarmHash = await selectStampAndUpload(page)
  await assertUploadedContentAtPath(swarmHash, 'index.html', 'text/html; charset=utf-8')
  await assertUploadedContentAtPath(swarmHash, 'asset-manifest.json', 'application/json')
  await assertUploadedContentAtPath(swarmHash, 'static/css/main.073c9b0a.css', 'text/css; charset=utf-8')
  await assertUploadedContentAtPath(swarmHash, 'static/css/main.073c9b0a.css.map', '')
  await assertUploadedContentAtPath(swarmHash, 'static/js/787.28cb0dcd.chunk.js', 'application/javascript')
  await assertUploadedContentAtPath(swarmHash, 'static/js/787.28cb0dcd.chunk.js.map', '')
  await assertUploadedContentAtPath(
    swarmHash,
    'static/media/logo.6ce24c58023cc2f8fd88fe9d219db6c6.svg',
    'image/svg+xml',
  )
}

module.exports = { testReactWebsiteUpload }
