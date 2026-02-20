import { Component, ErrorInfo, ReactElement } from 'react'

interface Props {
  children: ReactElement
  errorReporting?: (err: Error) => void
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  private errorReporting?: (err: Error) => void

  constructor(props: Props) {
    super(props)
    this.errorReporting = props.errorReporting
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): { error: Error } {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (this.errorReporting) {
      this.errorReporting(error)
    }

    // eslint-disable-next-line no-console
    console.error({ error, errorInfo })
  }

  render(): ReactElement {
    if (this.state.error) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. Error: {this.state.error.message}</h1>
    }

    return this.props.children
  }
}
