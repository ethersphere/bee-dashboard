const puppeteer = require('puppeteer')
const { selectStampAndUpload, assertUploadedContentAtPath } = require('../helpers')
const { Click } = require('../library')

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function testWebsiteRegression02(page) {
  await Click.elementWithText(page, 'a', 'Files')
  await Click.elementWithTextAndUpload(page, 'button', 'Add Website', 'test-data/website-regression-02')
  const swarmHash = await selectStampAndUpload(page)
  await assertUploadedContentAtPath(swarmHash, 'index.html', 'text/html; charset=utf-8')
  await assertUploadedContentAtPath(swarmHash, 'assets/1.png', 'image/png')
  await assertUploadedContentAtPath(swarmHash, 'assets/2.png', 'image/png')
}

module.exports = { testWebsiteRegression02 }
