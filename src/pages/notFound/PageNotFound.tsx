import { Typography } from '@mui/material'
import { ReactElement } from 'react'
import { Link } from 'react-router-dom'

import { HistoryHeader } from '../../components/HistoryHeader'
import { ROUTES } from '../../routes'

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
