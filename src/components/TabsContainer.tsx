import React, { ReactElement, ReactNode } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Tab, Tabs } from '@material-ui/core'

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && children}
    </div>
  )
}

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}))

interface TabsValues {
  component: ReactNode
  label: string
}

interface Props {
  values: TabsValues[]
  index?: number
  indexChanged?: (index: number) => void
}

export default function SimpleTabs({ values, index, indexChanged }: Props): ReactElement {
  const classes = useStyles()
  const [value, setValue] = React.useState<number>(index || 0)

  const handleChange = (event: React.ChangeEvent<Record<string, never>>, newValue: number) => {
    if (indexChanged) indexChanged(newValue)
    else setValue(newValue)
  }

  const v = index !== undefined ? index : value

  return (
    <div className={classes.root}>
      <Tabs value={v} onChange={handleChange} variant="fullWidth">
        {values.map(({ label }, idx) => (
          <Tab key={idx} label={label} />
        ))}
      </Tabs>
      <div style={{ marginTop: 16 }}>
        {values.map(({ component }, idx) => (
          <TabPanel key={idx} value={v} index={idx}>
            {component}
          </TabPanel>
        ))}
      </div>
    </div>
  )
}
