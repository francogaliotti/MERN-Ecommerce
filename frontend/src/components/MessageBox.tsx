import { Alert } from "react-bootstrap"

interface MessageBoxProps {
    variant?: string
    children: React.ReactNode
    }

const MessageBox = ({variant = 'info', children}: MessageBoxProps) => {
  return (
    <Alert variant={variant}>{children}</Alert>
  )
}

export default MessageBox
