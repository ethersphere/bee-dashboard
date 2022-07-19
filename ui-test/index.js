/* eslint-disable no-console */
import puppeteer from 'puppeteer'
import { testFolderUpload } from './test-case/FolderUpload'
import { testImageFileUpload } from './test-case/ImageFileUpload'
import { testTextFileUpload } from './test-case/TextFileUpload'
import { testWebsiteUpload } from './test-case/WebsiteUpload'

const VIEWPORT = { width: 1366, height: 768 }

const testCases = [testImageFileUpload, testWebsiteUpload, testFolderUpload, testTextFileUpload]

async function main() {
  const page = await preparePage()
  const beforeAll = Date.now()
  for (const testCase of testCases) {
    const before = Date.now()
    console.log('\x1b[34m…\x1b[0m', 'Running', testCase.name)
    await testCase(page)
    const delta = Date.now() - before
    console.log('\x1b[32m✔\x1b[0m', testCase.name, 'passed in', delta, 'ms')
  }
  const delta = Date.now() - beforeAll
  console.log('\x1b[32m✔✔✔\x1b[0m', 'All', testCases.length, 'tests passed in', delta, 'ms')
}

/**
 * @returns {Promise<puppeteer.Page>}
 */
async function preparePage() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [`--window-size=${VIEWPORT.width},${VIEWPORT.height}`],
  })
  const page = await browser.newPage()
  await page.goto('http://localhost:3001' || process.env.BEE_DASHBOARD_HOST, { waitUntil: 'networkidle0' })

  return page
}

try {
  await main()
} catch (error) {
  console.error(error)
}
