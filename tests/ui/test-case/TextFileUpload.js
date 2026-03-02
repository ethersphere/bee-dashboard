const path = require('path')
const { selectStampAndUpload } = require('../helpers')
const { Assert, Click } = require('../library')

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function testTextFileUpload(page) {
  await Click.elementWithText(page, 'a', 'Files')
  await Click.elementWithTextAndUpload(page, 'button', 'Add File', path.resolve(__dirname, '../test-data/text.txt'))
  await assertUploadPreview(page)
  await selectStampAndUpload(page)
  await assertDownloadPreview(page)
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertUploadPreview(page) {
  await Assert.elementWithTextExists(page, 'p', 'Filename: text.txt')
  await Assert.elementWithTextExists(page, 'p', 'Kind: text/plain')
  await Assert.elementWithTextExists(page, 'p', 'Size: 1.64 KB')
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertDownloadPreview(page) {
  assertUploadPreview(page)
  await Assert.elementWithTextExists(page, 'p', 'Swarm Hash: c6e8a03e[…]327a88c4')
}

module.exports = { testTextFileUpload }
