import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { Checkbox, InputBase, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import RegisterIcon from 'remixicon-react/AddBoxLineIcon'
import LoginIcon from 'remixicon-react/LoginBoxLineIcon'
import { SwarmButton } from '../../components/SwarmButton'
import { Horizontal } from './Horizontal'
import { Vertical } from './Vertical'

interface Props {
  fdp: FdpStorage
  onSuccessfulLogin: () => void
}

export function FdpLogin({ fdp, onSuccessfulLogin }: Props) {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [remember, setRemember] = useState<boolean>(false)
  const [sepolia, setSepolia] = useState<string>('https://sepolia.drpc.org')
  const { enqueueSnackbar } = useSnackbar()

  const inputStyle = { background: 'white', padding: '2px 8px', width: '100%' }

  useEffect(() => {
    const storedSepolia = localStorage.getItem('sepolia')

    if (storedSepolia) {
      setSepolia(storedSepolia)
    }
    const fdpCredentials = localStorage.getItem('fdpCredentials')

    if (fdpCredentials) {
      const { username, password } = JSON.parse(fdpCredentials)
      setUsername(username)
      setPassword(password)
      setRemember(true)
    }
  }, [])

  async function onLogin() {
    localStorage.setItem('sepolia', sepolia)

    if (remember) {
      localStorage.setItem('fdpCredentials', JSON.stringify({ username, password }))
    } else {
      localStorage.removeItem('fdpCredentials')
    }
    enqueueSnackbar('Logging in...', { variant: 'info' })
    try {
      await fdp.account.login(username, password)
      enqueueSnackbar('Logged in successfully', { variant: 'success' })
      onSuccessfulLogin()
    } catch {
      enqueueSnackbar('Login failed', { variant: 'error' })
    } finally {
      setUsername('')
      setPassword('')
      setRemember(false)
    }
  }

  function onRegister() {
    window.open('https://create.fairdatasociety.org/', '_blank')
  }

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: 'auto',
      }}
    >
      <Vertical gap={16} full>
        <Vertical gap={8} left full>
          <Typography variant="body2">Sepolia JSON RPC</Typography>
          <InputBase value={sepolia} onChange={e => setSepolia(e.target.value)} style={inputStyle} />
        </Vertical>
        <Vertical gap={8} left full>
          <Typography variant="body2">Username</Typography>
          <InputBase value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} />
        </Vertical>
        <Vertical gap={8} left full>
          <Typography variant="body2">Password</Typography>
          <InputBase value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} type="password" />
        </Vertical>
        <Vertical gap={8} left full>
          <Horizontal>
            <Checkbox checked={remember} onChange={e => setRemember(e.target.checked)} />
            <Typography variant="body2">Remember me</Typography>
          </Horizontal>
        </Vertical>
        <Vertical left full>
          <Horizontal gap={4}>
            <SwarmButton iconType={LoginIcon} onClick={onLogin}>
              Login
            </SwarmButton>
            <SwarmButton iconType={RegisterIcon} onClick={onRegister}>
              Registration
            </SwarmButton>
          </Horizontal>
        </Vertical>
      </Vertical>
    </div>
  )
}
