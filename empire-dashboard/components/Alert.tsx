import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

export type AlertType = 'danger' | 'warning' | 'success' | 'info'

interface AlertProps {
  type?: AlertType
  title?: string
  message: string
  className?: string
}

const alertStyles = {
  danger: {
    bg: 'bg-red-50',
    border: 'border-danger-200',
    text: 'text-danger-800',
    icon: XCircle,
    iconColor: 'text-danger-600',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-success-200',
    text: 'text-success-800',
    icon: CheckCircle,
    iconColor: 'text-success-600',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-primary-200',
    text: 'text-primary-800',
    icon: Info,
    iconColor: 'text-primary-600',
  },
}

export function Alert({ type = 'info', title, message, className = '' }: AlertProps) {
  const style = alertStyles[type]
  const Icon = style.icon

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && <h4 className={`font-semibold ${style.text} mb-1`}>{title}</h4>}
          <p className={style.text}>{message}</p>
        </div>
      </div>
    </div>
  )
}
