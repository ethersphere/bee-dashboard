const puppeteer = require('puppeteer')
const { selectStampAndUpload } = require('../helpers')
const { Assert, Click } = require('../library')

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function testFolderUpload(page) {
  await Click.elementWithText(page, 'a', 'Files')
  await Click.elementWithTextAndUpload(page, 'button', 'Add Folder', 'test-data/test-folder')
  await assertUploadPreview(page)
  await selectStampAndUpload(page)
  await assertDownloadPreview(page)
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertDownloadPreview(page) {
  await assertUploadPreview(page)
  await Assert.elementWithTextExists(page, 'p', 'Swarm Hash: 89ef8f3e[…]504e5d1c')
  await Assert.elementWithTextExists(page, 'p', 'Folder Name: test-folder')
  await Assert.elementWithTextExists(page, 'p', 'Kind: Folder')
  await Assert.elementWithTextExists(page, 'h6', '4 items')
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertUploadPreview(page) {
  await Assert.elementWithTextExists(page, 'p', 'Folder Name: test-folder')
  await Assert.elementWithTextExists(page, 'p', 'Kind: Folder')
  await Assert.elementWithTextExists(page, 'p', 'Size: 6.56 kB')
}

module.exports = { testFolderUpload }
