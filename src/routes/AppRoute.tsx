import type { JSXElementConstructor, ReactElement } from 'react'
import { Route, RouteComponentProps } from 'react-router-dom'

interface Props {
  component: JSXElementConstructor<RouteComponentProps>
  layout: JSXElementConstructor<RouteComponentProps>
  exact?: boolean
  path: string
}

const AppRoute = ({ component: Component, layout: Layout, exact, path }: Props): ReactElement => (
  <Route
    exact={exact}
    path={path}
    render={props => (
      <Layout {...props}>
        <Component {...props} />
      </Layout>
    )}
  />
)

export default AppRoute
