import { ReactElement } from 'react'
import { useNavigate } from 'react-router'

import { HistoryHeader } from '../../components/HistoryHeader'
import { ROUTES } from '../../routes'

import { PostageStampStandardCreation } from './PostageStampStandardCreation'

export function CreatePostageStampBasicPage(): ReactElement {
  const navigate = useNavigate()

  function onFinished() {
    navigate(ROUTES.ACCOUNT_STAMPS)
  }

  return (
    <div>
      <HistoryHeader>Buy new postage stamp batch</HistoryHeader>
      <PostageStampStandardCreation onFinished={onFinished} />
    </div>
  )
}
