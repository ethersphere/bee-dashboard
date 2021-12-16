/* eslint-disable @typescript-eslint/no-empty-function */

import { createContext, ReactChild, ReactElement, useState } from 'react'
import { SwarmFile } from '../utils/SwarmFile'

export type UploadOrigin = { origin: 'UPLOAD' | 'FEED'; uuid?: string }

export const defaultUploadOrigin: UploadOrigin = { origin: 'UPLOAD' }

interface ContextInterface {
  files: SwarmFile[]
  setFiles: (files: SwarmFile[]) => void
  uploadOrigin: UploadOrigin
  setUploadOrigin: (uploadOrigin: UploadOrigin) => void
}

const initialValues: ContextInterface = {
  files: [],
  setFiles: () => {},
  uploadOrigin: defaultUploadOrigin,
  setUploadOrigin: () => {},
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

export function Provider({ children }: Props): ReactElement {
  const [files, setFiles] = useState<SwarmFile[]>(initialValues.files)
  const [uploadOrigin, setUploadOrigin] = useState<UploadOrigin>(initialValues.uploadOrigin)

  return <Context.Provider value={{ files, setFiles, uploadOrigin, setUploadOrigin }}>{children}</Context.Provider>
}
