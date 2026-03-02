const path = require('path')
const { selectStampAndUpload } = require('../helpers')
const { Assert, Click } = require('../library')

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function testWebsiteUpload(page) {
  await Click.elementWithText(page, 'a', 'Files')
  await Click.elementWithTextAndUpload(
    page,
    'button',
    'Add Website',
    path.resolve(__dirname, '../test-data/test-website'),
  )
  await assertUploadPreview(page)
  await selectStampAndUpload(page)
  await assertDownloadPreview(page)
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertUploadPreview(page) {
  await Assert.elementWithTextExists(page, 'p', 'Folder Name: test-website')
  await Assert.elementWithTextExists(page, 'p', 'Kind: Website')
  await Assert.elementWithTextExists(page, 'p', 'Size: 390.10 KB')
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertDownloadPreview(page) {
  await assertUploadPreview(page)
  await Assert.elementWithTextExists(page, 'p', 'Swarm Hash: d7fc1259[…]ac11e6f7')
  await Assert.elementWithTextExists(page, 'p', 'Folder Name: test-website')
  await Assert.elementWithTextExists(page, 'p', 'Kind: Website')
  await Assert.elementWithTextExists(page, 'h6', '3 items')
}

module.exports = { testWebsiteUpload }
