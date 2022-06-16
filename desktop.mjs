#!/usr/bin/env node

import envPaths from 'env-paths'
import open  from 'open'

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const paths = envPaths('bee-desktop')
const apiKey = await readFile(join(paths.data, 'api-key.txt'), {encoding: 'utf-8'})
const url = `http://localhost:3001/?v=${apiKey}#/`

console.log('Opening: ' + url)
await open(url)
