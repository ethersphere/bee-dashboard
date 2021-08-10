import React, { ReactElement, ReactNode } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
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
      <Tabs value={v} onChange={handleChange}>
        {values.map(({ label }, idx) => (
          <Tab key={idx} label={label} />
        ))}
      </Tabs>
      {values.map(({ component }, idx) => (
        <TabPanel key={idx} value={v} index={idx}>
          {component}
        </TabPanel>
      ))}
    </div>
  )
}
