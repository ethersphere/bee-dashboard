import type { ReactElement } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'

interface Props {
  code: string
  language: string
  showLineNumbers?: boolean
}

const CodeBlock = (props: Props): ReactElement => {
  return (
    <div style={{ textAlign: 'left' }}>
      <SyntaxHighlighter language={props.language} showLineNumbers={props.showLineNumbers}>
        {props.code}
      </SyntaxHighlighter>
    </div>
  )
}

export default CodeBlock
