import { Tab, Tabs } from '@mui/material'
import React, { ReactElement, ReactNode } from 'react'
import { makeStyles } from 'tss-react/mui'

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

const useStyles = makeStyles()(theme => ({
  root: {
    flexGrow: 1,
  },
  content: {
    marginTop: theme.spacing(2),
  },
}))

interface TabsValues {
  component: ReactNode
  label: ReactNode
}

interface Props {
  values: TabsValues[]
  index?: number
  indexChanged?: (index: number) => void
}

export default function SimpleTabs({ values, index, indexChanged }: Props): ReactElement {
  const { classes } = useStyles()
  const [value, setValue] = React.useState<number>(index || 0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
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
      <div className={classes.content}>
        {values.map(({ component }, idx) => (
          <TabPanel key={idx} value={v} index={idx}>
            {component}
          </TabPanel>
        ))}
      </div>
    </div>
  )
}
