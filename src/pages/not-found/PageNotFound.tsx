import { ReactElement } from 'react'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Typography } from '@material-ui/core'

export default function PageNotFound(): ReactElement {
  return (
    <div>
      <HistoryHeader>Page not found</HistoryHeader>
      <Typography>
        The given url is invalid. Please go back or <a href="/">navigate to Home screen.</a>
      </Typography>
    </div>
  )
}
