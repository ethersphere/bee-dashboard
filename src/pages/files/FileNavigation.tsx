import { Tab, Tabs } from '@mui/material'
import React, { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'

import { ROUTES } from '../../routes'

export enum FileOrigin {
  Upload = 'UPLOAD',
  Download = 'DOWNLOAD',
  Feed = 'FEED',
}

interface Props {
  active: FileOrigin
}

const useStyles = makeStyles()(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(4),
  },
  leftTab: {
    marginRight: theme.spacing(0.5),
  },
  rightTab: {
    marginLeft: theme.spacing(0.5),
  },
}))

export function FileNavigation({ active }: Props): ReactElement {
  const { classes } = useStyles()
  const navigate = useNavigate()

  function onChange(_event: React.SyntheticEvent, newValue: number) {
    navigate(newValue === 1 ? ROUTES.DOWNLOAD : ROUTES.UPLOAD)
  }

  return (
    <div className={classes.root}>
      <Tabs value={active === FileOrigin.Upload ? 0 : 1} onChange={onChange} variant="fullWidth">
        <Tab className={classes.leftTab} key={FileOrigin.Upload} label="Upload" />
        <Tab className={classes.rightTab} key={FileOrigin.Download} label="Download" />
      </Tabs>
    </div>
  )
}
