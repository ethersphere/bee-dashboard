declare module 'react-identicons' {
  interface Props {
    string: string
    size?: number
    padding?: number
    bg?: string
    fg?: string
    palette?: string[]
    count?: number
    getColor?: () => string
  }

  const Identicon = (props: Props): JSXElementConstructor => ReactNode //eslint-disable-line @typescript-eslint/no-unused-vars
  export default Identicon
}
