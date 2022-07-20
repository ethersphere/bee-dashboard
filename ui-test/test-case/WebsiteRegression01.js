const puppeteer = require('puppeteer')
const { selectStampAndUpload, assertUploadedContentAtPath } = require('../helpers')
const { Click } = require('../library')

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function testWebsiteRegression01(page) {
  await Click.elementWithText(page, 'a', 'Files')
  await Click.elementWithTextAndUpload(page, 'button', 'Add Website', 'test-data/website-regression-01')
  const swarmHash = await selectStampAndUpload(page)
  await assertUploadedContentAtPath(swarmHash, 'index.html', 'text/html; charset=utf-8')
  await assertUploadedContentAtPath(swarmHash, 'reset.css', 'text/css; charset=utf-8')
  await assertUploadedContentAtPath(swarmHash, 'style.css', 'text/css; charset=utf-8')
  await assertUploadedContentAtPath(swarmHash, 'assets/photo1.jpg', 'image/jpeg')
  await assertUploadedContentAtPath(swarmHash, 'assets/photo2.jpg', 'image/jpeg')
  await assertUploadedContentAtPath(swarmHash, 'assets/photo3.jpg', 'image/jpeg')
  await assertUploadedContentAtPath(swarmHash, 'assets/photo4.jpg', 'image/jpeg')
}

module.exports = { testWebsiteRegression01 }
