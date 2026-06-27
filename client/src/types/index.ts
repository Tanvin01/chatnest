export interface User {
  id: string
  username: string
  displayName: string
  avatar?: string
  status: 'online' | 'offline' | 'away' | 'dnd'
  createdAt: string
}

export interface Channel {
  id: string
  name: string
  description?: string
  type: 'public' | 'private' | 'dm'
  workspaceId: string
  members: string[]
  unreadCount: number
  lastMessage?: Message
  createdAt: string
}

export interface Reaction {
  emoji: string
  users: string[]
}

export interface Message {
  id: string
  channelId: string
  authorId: string
  author: Pick<User, 'id' | 'username' | 'displayName' | 'avatar'>
  content: string
  attachments?: Attachment[]
  reactions: Reaction[]
  replyToId?: string
  replyTo?: Pick<Message, 'id' | 'content' | 'author'>
  edited: boolean
  createdAt: string
  updatedAt: string
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface TypingUser {
  userId: string
  username: string
  channelId: string
}
