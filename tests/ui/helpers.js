const axios = require('axios')
const { Assert, Click, sleep, Wait } = require('./library')

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 * @returns {Promise<string>} Swarm hash
 */
async function selectStampAndUpload(page) {
  await Click.elementWithText(page, 'button', 'Add Postage Stamp')
  // select the first available stamp
  await page.click('[role="combobox"]') // Click the select trigger
  await page.click('[role="option"]') // Click first option in the dropdown
  await Wait.forEnabledStateXPath(page, 'button', 'Proceed With Selected Stamp')
  // seems necessary, even though button is enabled by the previous step, it is only highlighted and not clicked
  await sleep(500)
  await Click.elementWithText(page, 'button', 'Proceed With Selected Stamp')
  await Click.elementWithText(page, 'button', 'Upload To Your Node')
  // Wait for upload to complete
  await sleep(100)
  // check if the upload was successful
  await Assert.elementWithTextExists(page, 'button', 'Download')
  await Assert.elementWithTextExists(page, 'button', 'Update Feed')

  // get the swarm hash
  return page.url().split('/').pop()
}

async function assertUploadedContentAtPath(swarmHash, path, contentType) {
  const response = await axios.get(`http://localhost:1633/bzz/${swarmHash}/${encodeURI(path)}`)

  if (response.status !== 200) {
    throw new Error(`Expected 200 OK, got ${response.status}`)
  }

  if (response.headers['content-type'] !== contentType) {
    throw new Error(`Expected content-type ${contentType}, got ${response.headers['content-type']}`)
  }

  const { data } = response

  if (data.length === 0) {
    throw new Error(`Expected non-empty data, got ${data}`)
  }
}

module.exports = { selectStampAndUpload, assertUploadedContentAtPath }
