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
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
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
}

export default function SimpleTabs({ values }: Props): ReactElement {
  const classes = useStyles()
  const [value, setValue] = React.useState<number>(0)

  const handleChange = (event: React.ChangeEvent<Record<string, never>>, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
        {values.map(({ label }, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>
      {values.map(({ component }, index) => (
        <TabPanel key={index} value={value} index={index}>
          {component}
        </TabPanel>
      ))}
    </div>
  )
}
