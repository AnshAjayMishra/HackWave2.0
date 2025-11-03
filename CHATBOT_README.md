# Janvaani Chatbot - Voice AI Assistant

A modern, minimal chatbot interface for municipal services that integrates seamlessly with your application's black and teal theme.

## 🎨 **Design Features**

### **Theme Integration**
- **Color Scheme**: Matches your app's black and teal theme perfectly
- **Minimal Design**: Clean, modern interface with subtle gradients
- **Responsive Layout**: Works seamlessly on all device sizes
- **Dark/Light Mode**: Supports both themes automatically

### **UI Components**
- **Shadcn/ui**: Professional, accessible components
- **Lucide Icons**: Clean, consistent iconography
- **Tailwind CSS**: Responsive design with custom theme variables
- **Smooth Animations**: Subtle hover effects and transitions

## 🚀 **Features**

### **Core Functionality**
- **Real-time Chat**: Instant message exchange
- **Quick Actions**: Pre-defined municipal service queries
- **Voice Input**: Microphone button for voice recording (ready for implementation)
- **Typing Indicators**: Shows when assistant is responding
- **Message History**: Timestamps and conversation flow
- **Session Management**: Clear chat and history options

### **Quick Actions**
- **Services**: Information about municipal services
- **Complaints**: Register new complaints
- **Profile**: User profile assistance
- **General**: General municipal information

### **User Experience**
- **Enter to Send**: Quick message sending
- **Auto-scroll**: Automatically scrolls to latest messages
- **Responsive Input**: Textarea that grows with content
- **Status Indicators**: Online status and typing indicators

## 🛠️ **Technical Implementation**

### **Frontend Architecture**
- **React Hooks**: useState, useEffect, useRef for state management
- **TypeScript**: Full type safety and IntelliSense
- **Component Structure**: Modular, reusable components
- **State Management**: Local state with React hooks

### **API Integration Ready**
- **Endpoint**: `/api/chat` for message processing
- **Methods**: POST for sending messages, GET for chat history
- **Data Structure**: Flexible message format for your backend
- **Error Handling**: Graceful fallbacks and error states

## 📡 **API Endpoints**

### **POST /api/chat**
Send a message and get a response from the assistant.

**Request Body:**
```json
{
  "message": "What services do you offer?",
  "userId": "user123",
  "sessionId": "session456"
}
```

**Response:**
```json
{
  "message": "I can help you with various municipal services...",
  "timestamp": "2024-01-23T20:30:00.000Z",
  "sessionId": "session456",
  "userId": "user123",
  "metadata": {
    "service": "municipal_assistant",
    "version": "1.0.0",
    "confidence": 0.95
  }
}
```

### **GET /api/chat**
Retrieve chat history for a user or session.

**Query Parameters:**
- `userId`: User identifier
- `sessionId`: Session identifier

**Response:**
```json
{
  "history": [
    {
      "id": "1",
      "message": "Hello! How can I help you?",
      "sender": "bot",
      "timestamp": "2024-01-23T20:30:00.000Z",
      "sessionId": "session456"
    }
  ],
  "userId": "user123",
  "sessionId": "session456"
}
```

## 🔧 **Implementation Guide**

### **1. Backend Integration**
Replace the placeholder responses in `/api/chat/route.ts` with your actual chatbot logic:

```typescript
// Example: Integrate with OpenAI, Azure, or your custom AI model
const aiResponse = await callYourAIModel(message)
const response = {
  message: aiResponse.text,
  timestamp: new Date().toISOString(),
  sessionId,
  userId,
  metadata: {
    confidence: aiResponse.confidence,
    intent: aiResponse.intent,
    entities: aiResponse.entities
  }
}
```

### **2. Voice Integration**
Implement voice recording in the `toggleVoiceRecording` function:

```typescript
const toggleVoiceRecording = async () => {
  if (!isRecording) {
    // Start recording
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    // Implement your voice recording logic
  } else {
    // Stop recording and process audio
    // Send audio to your speech-to-text service
  }
}
```

### **3. Database Integration**
Add database operations for chat persistence:

```typescript
// Save messages to database
await saveMessageToDatabase({
  userId,
  sessionId,
  message,
  sender: 'user',
  timestamp: new Date()
})

// Retrieve chat history
const history = await getChatHistory(userId, sessionId)
```

### **4. Authentication Integration**
Connect with your existing auth system:

```typescript
// Get user from your auth context
const { user } = useUser()

// Include user info in API calls
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: inputValue,
    userId: user?.id,
    sessionId: sessionId
  })
})
```

## 🎯 **Customization Options**

### **Styling**
- **Colors**: Update theme variables in `globals.css`
- **Layout**: Modify card dimensions and spacing
- **Animations**: Customize hover effects and transitions
- **Typography**: Adjust font sizes and weights

### **Functionality**
- **Quick Actions**: Add/remove/modify quick action buttons
- **Message Types**: Support for images, files, or rich content
- **Voice Features**: Integrate with speech recognition services
- **Multi-language**: Add language selection and localization

### **Integration**
- **WebSocket**: Real-time updates for live chat
- **Push Notifications**: Alert users of new messages
- **Analytics**: Track user interactions and satisfaction
- **A/B Testing**: Test different response strategies

## 🔒 **Security Considerations**

### **Input Validation**
- **Message Length**: Limit message size to prevent abuse
- **Content Filtering**: Sanitize user input for XSS protection
- **Rate Limiting**: Prevent spam and abuse
- **User Authentication**: Verify user identity for sensitive operations

### **Data Privacy**
- **Message Encryption**: Encrypt sensitive conversations
- **Data Retention**: Implement message retention policies
- **User Consent**: Get permission for data collection
- **GDPR Compliance**: Handle data deletion requests

## 📱 **Mobile Optimization**

### **Responsive Design**
- **Touch-friendly**: Large touch targets for mobile devices
- **Keyboard Handling**: Optimized for mobile keyboards
- **Voice Input**: Easy access to microphone functionality
- **Performance**: Optimized for slower mobile connections

### **Progressive Web App**
- **Offline Support**: Cache chat history for offline access
- **Push Notifications**: Alert users of new messages
- **Install Prompt**: Allow users to install as app
- **Background Sync**: Sync messages when online

## 🚀 **Future Enhancements**

### **AI Capabilities**
- **Intent Recognition**: Better understanding of user queries
- **Context Awareness**: Remember conversation context
- **Personalization**: Learn from user preferences
- **Multi-turn Dialogs**: Handle complex service requests

### **Integration Features**
- **Service APIs**: Connect to actual municipal systems
- **Payment Processing**: Handle service payments
- **Document Upload**: Process official documents
- **Appointment Booking**: Schedule service appointments

### **Analytics & Insights**
- **User Behavior**: Track interaction patterns
- **Service Usage**: Monitor popular queries
- **Satisfaction Metrics**: Measure user satisfaction
- **Performance Monitoring**: Track response times

## 📝 **Usage Examples**

### **Basic Chat Flow**
1. User types: "I need help with water bill"
2. Assistant responds with water bill information
3. User asks follow-up questions
4. Assistant provides detailed guidance

### **Quick Action Flow**
1. User clicks "Complaints" quick action
2. Assistant asks for complaint details
3. User provides information
4. Assistant confirms and processes complaint

### **Voice Interaction Flow**
1. User clicks microphone button
2. User speaks their query
3. Speech is converted to text
4. Assistant processes and responds

---

**Ready for Integration**: The chatbot is fully functional with placeholder responses and ready for you to implement your backend logic at `/api/chat`.

**Built with ❤️ for Janvaani - Voice-Based AI Assistant for Municipal Services** 