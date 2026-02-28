/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef, type FormEvent } from 'react'
import io from 'socket.io-client'
import { fetchClientChatAPI } from '~/apis/client/chat.api'
import { API_ROOT } from '~/utils/constants'
import type { Message } from '~/interfaces/chat.interface'
import { useAuth } from '~/contexts/client/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const useChat = () => {
  const { accountUser } = useAuth()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')

  const socketRef = useRef<ReturnType<typeof io> | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const { dispatchAlert } = useAlertContext()

  // Logic kết nối Socket và lấy lịch sử chat. Sẽ chỉ chạy khi người dùng MỞ cửa sổ chat
  useEffect(() => {
    if (!isOpen) return

    if (!accountUser) {
      setIsLoading(false)
      setMessages([])
      return
    }

    // Đã đăng nhập, tiến hành thiết lập chat
    const setupChat = async () => {
      try {
        setIsLoading(true)

        // Lấy lịch sử chat
        const res = await fetchClientChatAPI()
        if (res.code === 200) {
          setMessages(res.chat.messages)
        }

        // Kết nối socket, gửi kèm cookie xác thực
        const socket = io(API_ROOT, {
          transportOptions: {
            polling: { withCredentials: true }
          }
        })

        // Lưu socket vào ref để dùng chung trong component, tránh việc tạo nhiều kết nối khi re-render
        socketRef.current = socket

        // Yêu cầu join phòng (backend sẽ tự đọc cookie để biết user_id)
        socket.emit('USER_CLIENT_JOIN_ROOM')

        // Lắng nghe tin nhắn mới từ server
        socket.on('SERVER_RETURN_MESSAGE', (newMessage: Message & { user_id: string }) => {
          setMessages((prevMessages) => [...prevMessages, newMessage])
        })

      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Lỗi khi khởi tạo chat', severity: 'error' }
        })
      } finally {
        setIsLoading(false)
      }
    }

    setupChat()

    // Cleanup: Ngắt kết nối socket khi đóng cửa sổ chat
    return () => {
      socketRef.current?.disconnect()
    }
  }, [isOpen, accountUser, dispatchAlert])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !socketRef.current || !accountUser) return

    socketRef.current.emit('USER_CLIENT_SEND_MESSAGE', newMessage)

    setNewMessage('')
  }

  // Tự động cuộn khi có tin nhắn mới
  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  return {
    setIsOpen,
    handleSubmit,
    isLoading,
    isOpen,
    accountUser,
    messages,
    messagesEndRef,
    newMessage,
    setNewMessage
  }
}

export default useChat