/* eslint-disable no-console */
const path = require('path')
const handler = require('serve-handler')
const http = require('http')
const puppeteer = require('puppeteer')
const { testFolderUpload } = require('./test-case/FolderUpload')
const { testImageFileUpload } = require('./test-case/ImageFileUpload')
const { testTextFileUpload } = require('./test-case/TextFileUpload')
const { testWebsiteUpload } = require('./test-case/WebsiteUpload')

const VIEWPORT = { width: 1366, height: 768 }

const testCases = [testTextFileUpload, testImageFileUpload, testFolderUpload, testWebsiteUpload]

async function main() {
  const server = prepareServer()
  const { browser, page } = await preparePage()
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
  await page.close()
  await browser.close()
  server.close()
}

/**
 * @returns {Promise<{ browser: puppeteer.Browser, page: puppeteer.Page }>}
 */
async function preparePage() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [`--window-size=${VIEWPORT.width},${VIEWPORT.height}`],
  })
  const page = await browser.newPage()
  await page.goto('http://localhost:8080' || process.env.PORT, { waitUntil: 'networkidle0' })

  return { browser, page }
}

function prepareServer() {
  const serverConfig = {
    public: 'build',
    trailingSlash: false,
    rewrites: [{ source: '**', destination: '/index.html' }],
  }

  const server = http.createServer((request, response) => {
    return handler(request, response, serverConfig)
  })
  server.listen(8080)

  return server
}

main()
