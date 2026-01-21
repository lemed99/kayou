import { createEffect, createSignal, For, Show } from 'solid-js';

import { Button, Drawer, Tooltip } from '@exowpee/solidly';
import { DynamicVirtualList, DynamicVirtualListHandle } from '@exowpee/solidly-pro';
import {
  ArrowLeftIcon,
  CheckIcon,
  DotsHorizontalIcon,
  FaceSmileIcon,
  PaperclipIcon,
  PhoneIcon,
  SearchMdIcon,
  Send01Icon,
  VideoRecorderIcon,
} from '@exowpee/solidly/icons';

import BlocksDocPage from '../../../components/BlocksDocPage';
import { useIsMobile } from '../../../utils/useIsMobile';

// Types
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'other';
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: string[];
  isTyping?: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline?: boolean;
}

// Sample data generators
const generateId = () => Math.random().toString(36).substring(2, 9);

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
};

// Auto-reply messages for simulation
const autoReplies = [
  "That's interesting! Tell me more.",
  'I see what you mean.',
  'Great point! 👍',
  'Let me think about that...',
  'Sounds good to me!',
  'I agree with you on this.',
  'That makes sense.',
  'Thanks for sharing!',
  "I'll get back to you on that.",
  'Interesting perspective!',
];

// ============================================================================
// Variant 1: Modern Chat Interface
// ============================================================================
const ModernChatInterface = () => {
  const [messages, setMessages] = createSignal<Message[]>([
    {
      id: '1',
      content: 'Hey! How are you doing today?',
      sender: 'other',
      senderName: 'Sarah Chen',
      timestamp: new Date(Date.now() - 3600000),
      status: 'read',
    },
    {
      id: '2',
      content: "I'm doing great, thanks! Just finished that project we discussed.",
      sender: 'user',
      senderName: 'You',
      timestamp: new Date(Date.now() - 3500000),
      status: 'read',
    },
    {
      id: '3',
      content:
        "That's awesome! Can't wait to see the results. When can we schedule a review?",
      sender: 'other',
      senderName: 'Sarah Chen',
      timestamp: new Date(Date.now() - 3400000),
      status: 'read',
    },
    {
      id: '4',
      content:
        'How about tomorrow at 2 PM? I can share my screen and walk you through everything.',
      sender: 'user',
      senderName: 'You',
      timestamp: new Date(Date.now() - 3300000),
      status: 'delivered',
    },
  ]);

  const [inputValue, setInputValue] = createSignal('');
  const [isOtherTyping, setIsOtherTyping] = createSignal(false);
  let listHandle: DynamicVirtualListHandle | undefined;

  const scrollToBottom = () => {
    if (listHandle && messages().length > 0) {
      listHandle.scrollToIndex(messages().length - 1, 'smooth');
    }
  };

  // Scroll to bottom on mount and when messages change
  createEffect(() => {
    messages();
    setTimeout(scrollToBottom, 100);
  });

  const sendMessage = () => {
    const content = inputValue().trim();
    if (!content) return;

    const newMessage: Message = {
      id: generateId(),
      content,
      sender: 'user',
      senderName: 'You',
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');

    // Simulate message being sent
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, status: 'sent' } : m)),
      );
    }, 500);

    // Simulate delivery
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, status: 'delivered' } : m)),
      );
    }, 1000);

    // Simulate typing indicator and auto-reply
    setTimeout(() => {
      setIsOtherTyping(true);
    }, 1500);

    setTimeout(() => {
      setIsOtherTyping(false);
      const reply: Message = {
        id: generateId(),
        content: autoReplies[Math.floor(Math.random() * autoReplies.length)],
        sender: 'other',
        senderName: 'Sarah Chen',
        timestamp: new Date(),
        status: 'read',
      };
      setMessages((prev) => [...prev, reply]);

      // Mark user's message as read
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, status: 'read' } : m)),
      );
    }, 3000);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div class="flex h-full flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 font-semibold text-white">
              SC
            </div>
            <span class="absolute right-0 bottom-0 size-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" />
          </div>
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Sarah Chen</h2>
            <p class="text-sm text-green-600 dark:text-green-400">Online</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <PhoneIcon class="size-5" />
          </button>
          <button class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <VideoRecorderIcon class="size-5" />
          </button>
          <button class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <DotsHorizontalIcon class="size-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div class="flex-1 overflow-hidden">
        <DynamicVirtualList
          ref={(handle) => (listHandle = handle)}
          items={() => messages()}
          rootHeight={450}
          estimatedRowHeight={80}
          overscanCount={3}
          containerWidth="100%"
          containerPadding={16}
        >
          {(message) => (
            <div
              class={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                class={`max-w-[70%] ${
                  message.sender === 'user'
                    ? 'rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-white'
                    : 'rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 text-gray-900 dark:bg-gray-800 dark:text-white'
                }`}
              >
                <p class="text-sm leading-relaxed">{message.content}</p>
                <div
                  class={`mt-1 flex items-center justify-end gap-1 text-xs ${
                    message.sender === 'user'
                      ? 'text-blue-200'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <span>{formatTime(message.timestamp)}</span>
                  <Show when={message.sender === 'user'}>
                    <Show when={message.status === 'sending'}>
                      <span class="size-3 animate-pulse rounded-full bg-blue-300" />
                    </Show>
                    <Show when={message.status === 'sent'}>
                      <CheckIcon class="size-3" />
                    </Show>
                    <Show when={message.status === 'delivered'}>
                      <div class="flex -space-x-1">
                        <CheckIcon class="size-3" />
                        <CheckIcon class="size-3" />
                      </div>
                    </Show>
                    <Show when={message.status === 'read'}>
                      <div class="flex -space-x-1 text-blue-300">
                        <CheckIcon class="size-3" />
                        <CheckIcon class="size-3" />
                      </div>
                    </Show>
                  </Show>
                </div>
              </div>
            </div>
          )}
        </DynamicVirtualList>

        {/* Typing Indicator */}
        <Show when={isOtherTyping()}>
          <div class="px-6 py-2">
            <div class="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
              <div class="flex gap-1">
                <span
                  class="size-2 animate-bounce rounded-full bg-gray-400"
                  style={{ 'animation-delay': '0ms' }}
                />
                <span
                  class="size-2 animate-bounce rounded-full bg-gray-400"
                  style={{ 'animation-delay': '150ms' }}
                />
                <span
                  class="size-2 animate-bounce rounded-full bg-gray-400"
                  style={{ 'animation-delay': '300ms' }}
                />
              </div>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                Sarah is typing...
              </span>
            </div>
          </div>
        </Show>
      </div>

      {/* Input */}
      <div class="border-t border-gray-200 p-4 dark:border-gray-700">
        <div class="flex items-end gap-3">
          <button class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <PaperclipIcon class="size-5" />
          </button>
          <div class="flex-1">
            <input
              type="text"
              value={inputValue()}
              onInput={(e) => setInputValue(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-400"
            />
          </div>
          <button class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <FaceSmileIcon class="size-5" />
          </button>
          <Button
            color="blue"
            size="sm"
            class="gap-2 rounded-xl px-4"
            onClick={sendMessage}
            disabled={!inputValue().trim()}
          >
            <Send01Icon class="size-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Variant 2: Slack-style Messaging
// ============================================================================
const SlackStyleChat = () => {
  const [messages, setMessages] = createSignal<Message[]>([
    {
      id: '1',
      content: 'Good morning team! 🌅 Ready for the standup?',
      sender: 'other',
      senderName: 'Alex Rivera',
      senderAvatar: 'AR',
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: '2',
      content: 'Morning! Yes, let me grab my coffee first ☕',
      sender: 'other',
      senderName: 'Jordan Lee',
      senderAvatar: 'JL',
      timestamp: new Date(Date.now() - 7100000),
    },
    {
      id: '3',
      content:
        "I've pushed the latest changes to the feature branch. Could use a review when someone has time.",
      sender: 'user',
      senderName: 'You',
      timestamp: new Date(Date.now() - 7000000),
    },
    {
      id: '4',
      content: "I'll take a look after standup! 👀",
      sender: 'other',
      senderName: 'Alex Rivera',
      senderAvatar: 'AR',
      timestamp: new Date(Date.now() - 6900000),
      reactions: ['👍', '🙏'],
    },
    {
      id: '5',
      content:
        'Also, reminder that we have the client demo at 3 PM. Please be prepared with your sections.',
      sender: 'other',
      senderName: 'Jordan Lee',
      senderAvatar: 'JL',
      timestamp: new Date(Date.now() - 3600000),
    },
  ]);

  const [inputValue, setInputValue] = createSignal('');
  const [isTyping, setIsTyping] = createSignal(false);
  let listHandle: DynamicVirtualListHandle | undefined;

  const scrollToBottom = () => {
    if (listHandle && messages().length > 0) {
      listHandle.scrollToIndex(messages().length - 1, 'smooth');
    }
  };

  createEffect(() => {
    messages();
    setTimeout(scrollToBottom, 100);
  });

  const sendMessage = () => {
    const content = inputValue().trim();
    if (!content) return;

    const newMessage: Message = {
      id: generateId(),
      content,
      sender: 'user',
      senderName: 'You',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');

    // Simulate response
    setTimeout(() => setIsTyping(true), 1000);
    setTimeout(() => {
      setIsTyping(false);
      const responders = [
        { name: 'Alex Rivera', avatar: 'AR' },
        { name: 'Jordan Lee', avatar: 'JL' },
      ];
      const responder = responders[Math.floor(Math.random() * responders.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          content: autoReplies[Math.floor(Math.random() * autoReplies.length)],
          sender: 'other',
          senderName: responder.name,
          senderAvatar: responder.avatar,
          timestamp: new Date(),
        },
      ]);
    }, 2500);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-green-500',
      'bg-teal-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div class="flex h-full flex-col bg-white dark:bg-gray-900">
      {/* Channel Header */}
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-3 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <span class="text-xl font-bold text-gray-900 dark:text-white">#</span>
          <h2 class="font-semibold text-gray-900 dark:text-white">engineering-team</h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">3 members</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <SearchMdIcon class="size-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div class="flex-1 overflow-hidden">
        <DynamicVirtualList
          ref={(handle) => (listHandle = handle)}
          items={() => messages()}
          rootHeight={450}
          estimatedRowHeight={90}
          overscanCount={3}
          containerWidth="100%"
          containerPadding={16}
        >
          {(message) => (
            <div class="group mb-4 flex gap-3 rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <div
                class={`flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white ${getAvatarColor(message.senderName)}`}
              >
                {message.senderAvatar || message.senderName.charAt(0)}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-baseline gap-2">
                  <span class="font-semibold text-gray-900 dark:text-white">
                    {message.senderName}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p class="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                  {message.content}
                </p>
                <Show when={message.reactions && message.reactions.length > 0}>
                  <div class="mt-2 flex gap-1">
                    <For each={message.reactions}>
                      {(reaction) => (
                        <button class="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                          <span>{reaction}</span>
                          <span class="text-xs text-gray-500">1</span>
                        </button>
                      )}
                    </For>
                  </div>
                </Show>
              </div>
              <div class="flex items-start gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Tooltip content="Add reaction">
                  <button class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700">
                    <FaceSmileIcon class="size-4" />
                  </button>
                </Tooltip>
              </div>
            </div>
          )}
        </DynamicVirtualList>

        {/* Typing Indicator */}
        <Show when={isTyping()}>
          <div class="px-6 py-2 text-sm text-gray-500 dark:text-gray-400">
            <span class="font-medium">Someone</span> is typing...
          </div>
        </Show>
      </div>

      {/* Input */}
      <div class="border-t border-gray-200 p-4 dark:border-gray-700">
        <div class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800">
          <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <PaperclipIcon class="size-5" />
          </button>
          <input
            type="text"
            value={inputValue()}
            onInput={(e) => setInputValue(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message #engineering-team"
            class="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none dark:text-white"
          />
          <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <FaceSmileIcon class="size-5" />
          </button>
          <button
            onClick={sendMessage}
            disabled={!inputValue().trim()}
            class="rounded bg-green-600 p-1.5 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send01Icon class="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Variant 3: WhatsApp-style with Conversations List
// ============================================================================
const WhatsAppStyle = () => {
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = createSignal(false);

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      lastMessage: "That's awesome! Can't wait to see it.",
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: '2',
      name: 'Engineering Team',
      lastMessage: 'Alex: Ready for standup?',
      lastMessageTime: new Date(Date.now() - 1800000),
      unreadCount: 3,
      isOnline: false,
    },
    {
      id: '3',
      name: 'Jordan Lee',
      lastMessage: 'You: Sounds good!',
      lastMessageTime: new Date(Date.now() - 7200000),
      unreadCount: 0,
      isOnline: true,
    },
  ];

  const [selectedConversation, setSelectedConversation] = createSignal<Conversation | undefined>(
    conversations[0],
  );
  const [messages, setMessages] = createSignal<Message[]>([
    {
      id: '1',
      content: 'Hey! How are you?',
      sender: 'other',
      senderName: 'Sarah Chen',
      timestamp: new Date(Date.now() - 3600000),
      status: 'read',
    },
    {
      id: '2',
      content: "I'm good! Working on that new feature.",
      sender: 'user',
      senderName: 'You',
      timestamp: new Date(Date.now() - 3500000),
      status: 'read',
    },
    {
      id: '3',
      content: "That's awesome! Can't wait to see it.",
      sender: 'other',
      senderName: 'Sarah Chen',
      timestamp: new Date(Date.now() - 300000),
      status: 'read',
    },
  ]);

  const [inputValue, setInputValue] = createSignal('');
  const [isTyping, setIsTyping] = createSignal(false);
  let listHandle: DynamicVirtualListHandle | undefined;

  const scrollToBottom = () => {
    if (listHandle && messages().length > 0) {
      listHandle.scrollToIndex(messages().length - 1, 'smooth');
    }
  };

  createEffect(() => {
    messages();
    setTimeout(scrollToBottom, 100);
  });

  const sendMessage = () => {
    const content = inputValue().trim();
    if (!content) return;

    const newMessage: Message = {
      id: generateId(),
      content,
      sender: 'user',
      senderName: 'You',
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, status: 'delivered' } : m)),
      );
    }, 800);

    setTimeout(() => setIsTyping(true), 1500);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          content: autoReplies[Math.floor(Math.random() * autoReplies.length)],
          sender: 'other',
          senderName: selectedConversation()?.name || 'User',
          timestamp: new Date(),
        },
      ]);
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, status: 'read' } : m)),
      );
    }, 3000);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const ConversationsList = () => (
    <div class="flex h-full flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div class="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Chats</h2>
        <button class="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
          <DotsHorizontalIcon class="size-5" />
        </button>
      </div>

      {/* Search */}
      <div class="shrink-0 p-3">
        <div class="relative">
          <SearchMdIcon class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search or start new chat"
            class="w-full rounded-lg bg-gray-100 py-2 pr-4 pl-10 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div class="flex-1 overflow-y-auto">
        <For each={conversations}>
          {(conversation) => (
            <button
              onClick={() => {
                setSelectedConversation(conversation);
                if (isMobile()) setIsDrawerOpen(false);
              }}
              class={`flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedConversation()?.id === conversation.id
                  ? 'bg-gray-100 dark:bg-gray-700'
                  : ''
              }`}
            >
              <div class="relative">
                <div class="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-green-500 font-semibold text-white">
                  {conversation.name.charAt(0)}
                </div>
                <Show when={conversation.isOnline}>
                  <span class="absolute right-0 bottom-0 size-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-800" />
                </Show>
              </div>
              <div class="min-w-0 flex-1 text-left">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900 dark:text-white">
                    {conversation.name}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(conversation.lastMessageTime)}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <p class="truncate text-sm text-gray-500 dark:text-gray-400">
                    {conversation.lastMessage}
                  </p>
                  <Show when={conversation.unreadCount > 0}>
                    <span class="flex size-5 items-center justify-center rounded-full bg-green-500 text-xs font-medium text-white">
                      {conversation.unreadCount}
                    </span>
                  </Show>
                </div>
              </div>
            </button>
          )}
        </For>
      </div>
    </div>
  );

  return (
    <div class="flex h-full bg-gray-100 dark:bg-gray-900">
      {/* Desktop Conversations List */}
      <Show when={!isMobile()}>
        <div class="w-80 shrink-0 border-r border-gray-200 dark:border-gray-700">
          <ConversationsList />
        </div>
      </Show>

      {/* Mobile Conversations Drawer */}
      <Show when={isMobile()}>
        <Drawer
          show={isDrawerOpen()}
          onClose={() => setIsDrawerOpen(false)}
          position="left"
        >
          <div class="w-72">
            <ConversationsList />
          </div>
        </Drawer>
      </Show>

      {/* Chat Area */}
      <div class="flex flex-1 flex-col">
        {/* Chat Header */}
        <div class="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-3 sm:px-6 dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-center gap-2 sm:gap-3">
            {/* Mobile menu button */}
            <Show when={isMobile()}>
              <button
                onClick={() => setIsDrawerOpen(true)}
                class="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <ArrowLeftIcon class="size-5" />
              </button>
            </Show>
            <div class="relative">
              <div class="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-green-500 font-semibold text-white">
                {selectedConversation()?.name.charAt(0)}
              </div>
              <Show when={selectedConversation()?.isOnline}>
                <span class="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-green-500 dark:border-gray-800" />
              </Show>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">
                {selectedConversation()?.name}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {selectedConversation()?.isOnline ? 'online' : 'last seen recently'}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1 sm:gap-2">
            <button class="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
              <SearchMdIcon class="size-5" />
            </button>
            <button class="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
              <DotsHorizontalIcon class="size-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          class="flex-1 overflow-hidden"
          style={{
            'background-image':
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        >
          <DynamicVirtualList
            ref={(handle) => (listHandle = handle)}
            items={() => messages()}
            rootHeight={400}
            estimatedRowHeight={70}
            overscanCount={3}
            containerWidth="100%"
            containerPadding={16}
          >
            {(message) => (
              <div
                class={`mb-2 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  class={`relative max-w-[65%] rounded-lg px-3 py-2 shadow-sm ${
                    message.sender === 'user'
                      ? 'rounded-br-none bg-green-100 dark:bg-green-900'
                      : 'rounded-bl-none bg-white dark:bg-gray-700'
                  }`}
                >
                  <p class="text-sm text-gray-800 dark:text-gray-100">
                    {message.content}
                  </p>
                  <div class="mt-1 flex items-center justify-end gap-1">
                    <span class="text-[10px] text-gray-500 dark:text-gray-400">
                      {formatTime(message.timestamp)}
                    </span>
                    <Show when={message.sender === 'user'}>
                      <Show when={message.status === 'sending'}>
                        <span class="text-gray-400">○</span>
                      </Show>
                      <Show when={message.status === 'delivered'}>
                        <CheckIcon class="size-3 text-gray-400" />
                      </Show>
                      <Show when={message.status === 'read'}>
                        <div class="flex -space-x-1.5">
                          <CheckIcon class="size-3 text-blue-500" />
                          <CheckIcon class="size-3 text-blue-500" />
                        </div>
                      </Show>
                    </Show>
                  </div>
                </div>
              </div>
            )}
          </DynamicVirtualList>

          <Show when={isTyping()}>
            <div class="px-6 py-2">
              <div class="inline-flex max-w-[65%] items-center gap-2 rounded-lg rounded-bl-none bg-white px-3 py-2 shadow-sm dark:bg-gray-700">
                <div class="flex gap-1">
                  <span
                    class="size-1.5 animate-bounce rounded-full bg-gray-400"
                    style={{ 'animation-delay': '0ms' }}
                  />
                  <span
                    class="size-1.5 animate-bounce rounded-full bg-gray-400"
                    style={{ 'animation-delay': '150ms' }}
                  />
                  <span
                    class="size-1.5 animate-bounce rounded-full bg-gray-400"
                    style={{ 'animation-delay': '300ms' }}
                  />
                </div>
              </div>
            </div>
          </Show>
        </div>

        {/* Input */}
        <div class="border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-center gap-2">
            <button class="rounded-full p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700">
              <FaceSmileIcon class="size-6" />
            </button>
            <button class="rounded-full p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700">
              <PaperclipIcon class="size-6" />
            </button>
            <input
              type="text"
              value={inputValue()}
              onInput={(e) => setInputValue(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message"
              class="flex-1 rounded-full border-none bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={sendMessage}
              class="rounded-full bg-green-500 p-2.5 text-white transition-colors hover:bg-green-600"
            >
              <Send01Icon class="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Code Examples
// ============================================================================
const modernChatCode = `import { createSignal, createEffect, Show } from 'solid-js';
import { Button } from '@exowpee/solidly';
import { DynamicVirtualList, DynamicVirtualListHandle } from '@exowpee/solidly-pro';
import { Send01Icon, PaperclipIcon, FaceSmileIcon } from '@exowpee/solidly/icons';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'other';
  senderName: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export default function ModernChat() {
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [inputValue, setInputValue] = createSignal('');
  const [isTyping, setIsTyping] = createSignal(false);
  let listHandle: DynamicVirtualListHandle | undefined;

  // Auto-scroll to bottom when messages change
  createEffect(() => {
    messages();
    if (listHandle) {
      listHandle.scrollToIndex(messages().length - 1, 'smooth');
    }
  });

  const sendMessage = () => {
    const content = inputValue().trim();
    if (!content) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender: 'user',
      senderName: 'You',
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');

    // Simulate message delivery and response
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => m.id === newMessage.id ? { ...m, status: 'delivered' } : m)
      );
    }, 1000);

    // Simulate typing indicator and reply
    setTimeout(() => setIsTyping(true), 1500);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        content: 'Thanks for the message!',
        sender: 'other',
        senderName: 'Sarah',
        timestamp: new Date(),
      }]);
    }, 3000);
  };

  return (
    <div class="flex h-full flex-col">
      {/* Header */}
      <div class="flex items-center gap-3 border-b p-4">
        <div class="size-10 rounded-full bg-violet-500" />
        <div>
          <h2 class="font-semibold">Sarah Chen</h2>
          <p class="text-sm text-green-600">Online</p>
        </div>
      </div>

      {/* Messages with DynamicVirtualList */}
      <div class="flex-1 overflow-hidden">
        <DynamicVirtualList
          ref={(handle) => (listHandle = handle)}
          items={() => messages()}
          rootHeight={450}
          estimatedRowHeight={80}
          overscanCount={3}
        >
          {(message) => (
            <div class={\`mb-4 flex \${message.sender === 'user' ? 'justify-end' : 'justify-start'}\`}>
              <div class={\`max-w-[70%] rounded-2xl px-4 py-3 \${
                message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }\`}>
                <p>{message.content}</p>
                <div class="mt-1 text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                  <Show when={message.sender === 'user' && message.status === 'read'}>
                    ✓✓
                  </Show>
                </div>
              </div>
            </div>
          )}
        </DynamicVirtualList>

        <Show when={isTyping()}>
          <div class="px-6">Sarah is typing...</div>
        </Show>
      </div>

      {/* Input */}
      <div class="flex items-center gap-3 border-t p-4">
        <button><PaperclipIcon class="size-5" /></button>
        <input
          value={inputValue()}
          onInput={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          class="flex-1 rounded-xl border px-4 py-3"
        />
        <Button onClick={sendMessage} disabled={!inputValue().trim()}>
          <span class="flex items-center gap-2"><Send01Icon class="size-4" /> Send</span>
        </Button>
      </div>
    </div>
  );
}`;

const slackStyleCode = `import { createSignal, For } from 'solid-js';
import { DynamicVirtualList } from '@exowpee/solidly-pro';
import { Send01Icon, FaceSmileIcon } from '@exowpee/solidly/icons';

interface Message {
  id: string;
  content: string;
  senderName: string;
  senderAvatar: string;
  timestamp: Date;
  reactions?: string[];
}

export default function SlackStyleChat() {
  const [messages, setMessages] = createSignal<Message[]>([]);

  const getAvatarColor = (name: string) => {
    const colors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div class="flex h-full flex-col">
      {/* Channel Header */}
      <div class="flex items-center gap-2 border-b px-6 py-3">
        <span class="text-xl font-bold">#</span>
        <h2 class="font-semibold">engineering-team</h2>
      </div>

      {/* Messages */}
      <DynamicVirtualList
        items={() => messages()}
        rootHeight={450}
        estimatedRowHeight={90}
      >
        {(message) => (
          <div class="group flex gap-3 rounded-lg px-2 py-2 hover:bg-gray-50">
            <div class={\`size-9 rounded-lg \${getAvatarColor(message.senderName)} text-white flex items-center justify-center\`}>
              {message.senderAvatar}
            </div>
            <div class="flex-1">
              <div class="flex items-baseline gap-2">
                <span class="font-semibold">{message.senderName}</span>
                <span class="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p class="mt-0.5 text-sm">{message.content}</p>
              {message.reactions?.length > 0 && (
                <div class="mt-2 flex gap-1">
                  <For each={message.reactions}>
                    {(reaction) => (
                      <button class="rounded-full border px-2 py-0.5 text-sm">
                        {reaction} 1
                      </button>
                    )}
                  </For>
                </div>
              )}
            </div>
            <button class="opacity-0 group-hover:opacity-100">
              <FaceSmileIcon class="size-4" />
            </button>
          </div>
        )}
      </DynamicVirtualList>
    </div>
  );
}`;

const whatsappStyleCode = `import { createSignal, For, Show } from 'solid-js';
import { DynamicVirtualList } from '@exowpee/solidly-pro';
import { Send01Icon, SearchMdIcon } from '@exowpee/solidly/icons';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  unreadCount: number;
  isOnline?: boolean;
}

export default function WhatsAppStyle() {
  const [conversations] = createSignal<Conversation[]>([
    { id: '1', name: 'Sarah Chen', lastMessage: 'Hey!', unreadCount: 2, isOnline: true },
    { id: '2', name: 'Team Chat', lastMessage: 'Meeting at 3', unreadCount: 0 },
  ]);
  const [selectedConversation, setSelectedConversation] = createSignal(conversations()[0]);
  const [messages, setMessages] = createSignal([]);

  return (
    <div class="flex h-full">
      {/* Sidebar */}
      <div class="w-80 border-r">
        <div class="p-3">
          <input placeholder="Search chats" class="w-full rounded-lg bg-gray-100 px-4 py-2" />
        </div>
        <For each={conversations()}>
          {(conv) => (
            <button
              onClick={() => setSelectedConversation(conv)}
              class={\`flex w-full items-center gap-3 px-4 py-3 \${
                selectedConversation()?.id === conv.id ? 'bg-gray-100' : ''
              }\`}
            >
              <div class="relative">
                <div class="size-12 rounded-full bg-teal-500" />
                <Show when={conv.isOnline}>
                  <span class="absolute bottom-0 right-0 size-3 rounded-full bg-green-500" />
                </Show>
              </div>
              <div class="flex-1 text-left">
                <span class="font-medium">{conv.name}</span>
                <p class="truncate text-sm text-gray-500">{conv.lastMessage}</p>
              </div>
              <Show when={conv.unreadCount > 0}>
                <span class="rounded-full bg-green-500 px-2 text-xs text-white">
                  {conv.unreadCount}
                </span>
              </Show>
            </button>
          )}
        </For>
      </div>

      {/* Chat */}
      <div class="flex flex-1 flex-col">
        <DynamicVirtualList
          items={() => messages()}
          rootHeight={400}
          estimatedRowHeight={70}
        >
          {(message) => (
            <div class={\`mb-2 flex \${message.sender === 'user' ? 'justify-end' : 'justify-start'}\`}>
              <div class={\`max-w-[65%] rounded-lg px-3 py-2 \${
                message.sender === 'user' ? 'bg-green-100' : 'bg-white'
              }\`}>
                <p>{message.content}</p>
              </div>
            </div>
          )}
        </DynamicVirtualList>

        <div class="flex items-center gap-2 border-t p-3">
          <input placeholder="Type a message" class="flex-1 rounded-full bg-white px-4 py-2" />
          <button class="rounded-full bg-green-500 p-2.5 text-white">
            <Send01Icon class="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}`;

export default function InAppMessagesPage() {
  return (
    <BlocksDocPage
      title="In-App Messages"
      description="Real-time messaging interfaces with virtualized message lists using DynamicVirtualList. Features message sending, delivery status, typing indicators, and auto-scrolling."
      category="Messaging"
      isPro
      variants={[
        {
          id: 'modern',
          title: 'Modern Chat',
          description:
            'Clean chat interface with message status indicators, typing animation, and auto-scroll to latest messages.',
          component: ModernChatInterface,
          code: modernChatCode,
        },
        {
          id: 'slack',
          title: 'Slack-style',
          description:
            'Channel-based messaging with user avatars, timestamps, and reaction support.',
          component: SlackStyleChat,
          code: slackStyleCode,
        },
        {
          id: 'whatsapp',
          title: 'WhatsApp-style',
          description:
            'Split-view with conversation list, online status indicators, and message read receipts.',
          component: WhatsAppStyle,
          code: whatsappStyleCode,
        },
      ]}
      usedComponents={[
        {
          name: 'DynamicVirtualList',
          path: '/components/dynamic-virtual-list',
          isPro: true,
        },
        { name: 'Button', path: '/components/button' },
        { name: 'TextInput', path: '/components/text-input' },
        { name: 'Tooltip', path: '/components/tooltip' },
      ]}
      relatedBlocks={[
        {
          name: 'Notifications',
          path: '/blocks/settings/notifications',
          description: 'Notification preferences and settings',
        },
        {
          name: 'Profile',
          path: '/blocks/settings/profile',
          description: 'User profile management',
        },
      ]}
    />
  );
}

// Export components for iframe preview
export { ModernChatInterface, SlackStyleChat, WhatsAppStyle };
