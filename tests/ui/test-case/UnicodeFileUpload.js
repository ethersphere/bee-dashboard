const path = require('path')
const { selectStampAndUpload } = require('../helpers')
const { Assert, Click } = require('../library')

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function testUnicodeFileUpload(page) {
  await Click.elementWithText(page, 'a', 'Files')
  await Click.elementWithTextAndUpload(
    page,
    'button',
    'Add File',
    path.resolve(__dirname, '../test-data/—𝖆𝖆🙇\\𝖈𝖈.txt'),
  )
  await assertUploadPreview(page)
  await selectStampAndUpload(page)
  await assertDownloadPreview(page)
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertUploadPreview(page) {
  await Assert.elementWithTextExists(page, 'p', 'Filename: —𝖆𝖆🙇\\𝖈𝖈.txt')
  await Assert.elementWithTextExists(page, 'p', 'Kind: text/plain')
  await Assert.elementWithTextExists(page, 'p', 'Size: 5.51 KB')
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertDownloadPreview(page) {
  assertUploadPreview(page)
  await Assert.elementWithTextExists(page, 'p', 'Swarm Hash: 2a3f5bfc[…]77e2a4c1')
}

module.exports = { testUnicodeFileUpload }
