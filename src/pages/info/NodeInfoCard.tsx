import { ReactElement, useContext } from 'react'
import Globe from 'remixicon-react/GlobalLineIcon'
import Search from 'remixicon-react/SearchLineIcon'
import Settings from 'remixicon-react/Settings2LineIcon'

import { useNavigate } from 'react-router'
import Card from '../../components/Card'
import { CheckState, Context as BeeContext } from '../../providers/Bee'
import { ROUTES } from '../../routes'

export default function NodeInfoCard(): ReactElement {
  const { debugApiHealth, debugApiReadiness, status } = useContext(BeeContext)
  const navigate = useNavigate()

  if (debugApiHealth && !debugApiReadiness) {
    return (
      <Card
        buttonProps={{ iconType: Settings, children: 'Open node setup', onClick: () => navigate(ROUTES.STATUS) }}
        icon={<Globe />}
        title="Starting up..."
        subtitle="Your Bee node is currently launching."
        status="loading"
      />
    )
  }

  if (status.all === CheckState.ERROR) {
    return (
      <Card
        buttonProps={{ iconType: Settings, children: 'Open node setup', onClick: () => navigate(ROUTES.STATUS) }}
        icon={<Globe />}
        title="Your node is not connected…"
        subtitle="You are not connected to Swarm."
        status="error"
      />
    )
  }

  if (status.all === CheckState.WARNING) {
    return (
      <Card
        buttonProps={{ iconType: Settings, children: 'Open node setup', onClick: () => navigate(ROUTES.STATUS) }}
        icon={<Globe />}
        title="Your node is running…"
        subtitle="Connection to Swarm might not be optimal."
        status="error"
      />
    )
  }

  return (
    <Card
      buttonProps={{ iconType: Search, children: 'Access Content', onClick: () => navigate(ROUTES.DOWNLOAD) }}
      icon={<Globe />}
      title="Your node is connected."
      subtitle="You are connected to Swarm."
      status="ok"
    />
  )
}
