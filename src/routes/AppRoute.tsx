import React, { JSXElementConstructor } from 'react'
import { Route } from 'react-router-dom'

interface Props {
  component: JSXElementConstructor<any>
  layout: JSXElementConstructor<any>
  exact?: boolean
  path: string
}

const AppRoute = ({ component: Component, layout: Layout, exact, path, ...rest }: Props) => (
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
