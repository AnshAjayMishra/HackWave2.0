import type { Metadata } from 'next'
import ChatbotClient from './ChatbotClient'

export const metadata: Metadata = {
  title: 'Chat with Janvaani - Voice AI Assistant',
  description: 'Get instant help with municipal services through our intelligent voice-based AI assistant.',
}

export default function ChatbotPage() {
  return <ChatbotClient />
}