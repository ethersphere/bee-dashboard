const puppeteer = require('puppeteer')
const { Assert, Click, sleep, Wait } = require('./library')

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 */
async function selectStampAndUpload(page) {
  await Click.elementWithText(page, 'button', 'Add Postage Stamp')
  // select the first available stamp
  await Click.elementWithClass(page, 'div', '.MuiSelect-select')
  await Click.elementWithClass(page, 'li', '.MuiListItem-button')
  await Wait.forEnabledStateXPath(page, 'button', 'Proceed With Selected Stamp')
  // seems necessary, even though button is enabled by the previous step, it is only highlighted and not clicked
  await sleep(500)
  await Click.elementWithText(page, 'button', 'Proceed With Selected Stamp')
  await Click.elementWithText(page, 'button', 'Upload To Your Node')
  // check if the upload was successful
  await Assert.elementWithTextExists(page, 'button', 'Download')
  await Assert.elementWithTextExists(page, 'button', 'Update Feed')
}

module.exports = { selectStampAndUpload }
