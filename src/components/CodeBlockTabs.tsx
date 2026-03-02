import { ReactElement, useContext } from 'react'

import { Context } from '../providers/Platform'

import CodeBlock from './CodeBlock'
import TabsContainer from './TabsContainer'

interface Props {
  linux: string
  mac: string
  showLineNumbers?: boolean
}

export default function CodeBlockTabs(props: Props): ReactElement {
  const { platform, setPlatform } = useContext(Context)

  return (
    <TabsContainer
      index={platform}
      indexChanged={setPlatform}
      values={[
        {
          label: 'Linux',
          component: <CodeBlock showLineNumbers={props.showLineNumbers} language="bash" code={props.linux} />,
        },
        {
          label: 'macOS',
          component: <CodeBlock showLineNumbers={props.showLineNumbers} language="bash" code={props.mac} />,
        },
      ]}
    />
  )
}
