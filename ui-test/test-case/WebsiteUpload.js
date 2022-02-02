import puppeteer from 'puppeteer'
import { selectStampAndUpload } from '../helpers'
import { Assert, Click } from '../library'

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
export async function testWebsiteUpload(page) {
  await Click.elementWithText(page, 'a', 'Files')
  await Click.elementWithTextAndUpload(page, 'button', 'Add Website', 'test-data/test-website')
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
  await Assert.elementWithTextExists(page, 'p', 'Size: 390.10 kB')
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function assertDownloadPreview(page) {
  await assertUploadPreview(page)
  await Assert.elementWithTextExists(page, 'p', 'Swarm Hash: ed73af53[…]02ca597e')
  await Assert.elementWithTextExists(page, 'h6', '3 items')
}
