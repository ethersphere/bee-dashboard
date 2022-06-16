import { Component, ErrorInfo, ReactElement } from 'react'
import ItsBroken from '../layout/ItsBroken'

interface Props {
  children: ReactElement
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): { error: Error } {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error({ error, errorInfo }) // eslint-disable-line
  }

  render(): ReactElement {
    if (this.state.error) {
      return <ItsBroken message={this.state.error.message} />
    }

    return this.props.children
  }
}
