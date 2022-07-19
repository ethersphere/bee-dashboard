const puppeteer = require('puppeteer')
const { Assert, Click } = require('../library')
const { selectStampAndUpload } = require('../helpers')

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function testImageFileUpload(page) {
  await Click.elementWithText(page, 'a', 'Files')
  await Click.elementWithTextAndUpload(page, 'button', 'Add File', 'test-data/1337x1337.jpg')
  await assertUploadPreview(page)
  await selectStampAndUpload(page)
  await assertDownloadPreview(page)
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertUploadPreview(page) {
  await Assert.elementWithTextExists(page, 'p', 'Filename: 1337x1337.jpg')
  await Assert.elementWithTextExists(page, 'p', 'Kind: image/jpeg')
  await Assert.elementWithTextExists(page, 'p', 'Size: 116.88 kB')
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertDownloadPreview(page) {
  await assertUploadPreview(page)
  await Assert.elementWithTextExists(page, 'p', 'Swarm Hash: 5de1d879[…]3427432d')
}

module.exports = { testImageFileUpload }
