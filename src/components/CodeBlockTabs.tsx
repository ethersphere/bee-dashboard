import { ReactElement, useContext } from 'react'
import TabsContainer from './TabsContainer'
import CodeBlock from './CodeBlock'
import { Context } from '../providers/Platform'

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
