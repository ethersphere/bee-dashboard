const puppeteer = require('puppeteer')
const { selectStampAndUpload, assertUploadedContentAtPath } = require('../helpers')
const { Click } = require('../library')

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function testUnicodeWebsiteUpload(page) {
  await Click.elementWithText(page, 'a', 'Files')
  await Click.elementWithTextAndUpload(page, 'button', 'Add Website', 'test-data/test-unicode-website—𝖆𝖆🙇\\𝖈𝖈')
  const swarmHash = await selectStampAndUpload(page)
  await assertUploadedContentAtPath(swarmHash, 'index.html', 'text/html; charset=utf-8')
  await assertUploadedContentAtPath(swarmHash, '—𝖆𝖆🙇/𝖈𝖈.txt', 'text/plain; charset=utf-8')
}

module.exports = { testUnicodeWebsiteUpload }
