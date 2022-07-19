const puppeteer = require('puppeteer')

const SLEEP_MS = 500
const SLEEP_ITERATIONS = 20

const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 * @param {string} selector XPath selector
 */
async function waitForElementXPath(page, selector) {
  for (let i = 0; i < SLEEP_ITERATIONS; i++) {
    const [element] = await page.$x(selector)

    if (element) {
      return element
    }
    await sleep(SLEEP_MS)
  }

  return null
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 * @param {string} selector CSS selector
 */
async function waitForElementCss(page, selector) {
  for (let i = 0; i < SLEEP_ITERATIONS; i++) {
    const element = await page.$(selector)

    if (element) {
      return element
    }
    await sleep(SLEEP_MS)
  }

  return null
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 * @param {string} elementType HTML tag name, e.g. `a`, `button`, `div`,
 * @param {string} text e.g. `"Submit"`
 */
function waitForEnabledStateXPath(page, elementType, text) {
  return waitForElementXPath(page, `//${elementType}[contains(., '${text}')][not(@disabled)]`)
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 * @param {string} elementType HTML tag name, e.g. `a`, `button`, `div`,
 * @param {string} text e.g. `"Submit"`
 */
async function clickElementWithText(page, elementType, text) {
  const element = await waitForElementXPath(page, `//${elementType}[contains(., '${text}')]`)

  if (!element) {
    throw Error(`clickElementWithText: Could not find <${elementType}> containing "${text}"`)
  }

  if (element) {
    await element.click()
  }
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 * @param {string} elementType HTML tag name, e.g. `a`, `button`, `div`,
 * @param {string} text e.g. `"Submit"`
 * @param {string} filePath e.g. `"test-data/text.txt"`
 */
async function clickElementWithTextAndUpload(page, elementType, text, filePath) {
  const [fileChooser] = await Promise.all([page.waitForFileChooser(), clickElementWithText(page, elementType, text)])
  await fileChooser.accept([filePath])
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 * @param {string} elementType HTML tag name, e.g. `a`, `button`, `div`,
 * @param {string} cssClass CSS class with the dot, e.g. '.MuiSelect-select'
 */
async function clickElementWithClass(page, elementType, cssClass) {
  const element = await waitForElementCss(page, `${elementType}${cssClass}`)

  if (!element) {
    throw Error(`clickElementWithClass: Could not find <${elementType}> with class ${cssClass}`)
  }

  if (element) {
    await element.click()
  }
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 * @param {string} elementType HTML tag name, e.g. `a`, `button`, `div`,
 * @param {string} text e.g. `"Submit"`
 */
async function assertElementWithTextExists(page, elementType, text) {
  const element = await waitForElementXPath(page, `//${elementType}[contains(., '${text}')]`)

  if (!element) {
    throw Error(`assertElementWithTextExists: Could not find <${elementType}> containing "${text}"`)
  }

  return true
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 * @param {string} elementType HTML tag name, e.g. `a`, `button`, `div`,
 * @param {string} attribute HTML attribute, e.g. `alt` or `id`
 * @param {string} value Expected value of the attribute
 * @param {string} property Property to return from the queried HTML element
 * @returns {Promise<string>}
 */
async function queryElementPropertyByAttribute(page, elementType, attribute, value, property) {
  const element = await waitForElementXPath(page, `//${elementType}[contains(@${attribute}, "${value}")]`)

  return page.evaluate((element, property) => element[property], element, property)
}

/**
 * @param {puppeteer.Page} page Puppeteer Page object returned by `browser.newPage()`
 * @param {string} alt `<img>` `alt` to look for
 */
function queryImgSrcByAlt(page, alt) {
  return queryElementPropertyByAttribute(page, 'img', 'alt', alt, 'src')
}

module.exports = {
  sleep,
  Assert: {
    elementWithTextExists: assertElementWithTextExists,
  },
  Click: {
    elementWithText: clickElementWithText,
    elementWithClass: clickElementWithClass,
    elementWithTextAndUpload: clickElementWithTextAndUpload,
  },
  Query: {
    elementPropertyByAttribute: queryElementPropertyByAttribute,
    imgSrcByAlt: queryImgSrcByAlt,
  },
  Wait: {
    forElementCss: waitForElementCss,
    forElementXPath: waitForElementXPath,
    forEnabledStateXPath: waitForEnabledStateXPath,
  },
}
