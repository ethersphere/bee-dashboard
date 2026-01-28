import { ReactElement } from 'react'
import { HistoryHeader } from '../../components/HistoryHeader'
import { Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { ROUTES } from 'src/routes'

export default function PageNotFound(): ReactElement {
  return (
    <div>
      <HistoryHeader>Page not found</HistoryHeader>
      <Typography>
        The given url is invalid. Please go back or <Link to={ROUTES.INFO}>navigate to Home screen.</Link>
      </Typography>
    </div>
  )
}
