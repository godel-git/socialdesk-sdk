// ── Event Types ──

export enum EventType {
  DirectMessage = 'DIRECT_MESSAGE',
  ReplyMessage = 'REPLY_MESSAGE',
  HSMMessage = 'HSM_MESSAGE',
  ReplyMessageCallback = 'REPLY_MESSAGE_CALLBACK',
  ConversationFinalized = 'CONVERSATION_FINALIZED',
}

export enum MessageDirection {
  Incoming = 'INCOMING',
  Outgoing = 'OUTGOING',
}

export enum SenderType {
  Participant = 'PARTICIPANT',
  Extension = 'EXTENSION',
  Agent = 'AGENT',
}

export enum AttachmentType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  TEXT = 'TEXT',
  CONTACTS = 'CONTACTS',
}

// ── Webhook Payload Interfaces ──

export interface MessageSender {
  name: string;
  profile_id: string;
  picture: string;
  type: SenderType;
}

export interface Participant {
  id: string;
  name: string;
  picture: string;
  channelInstances?: string[];
}

export interface Agent {
  id: string;
  name: string;
  picture: string;
}

export interface Attachment {
  type: AttachmentType;
  url?: string;
  fileName?: string;
}

export interface Interaction {
  label: string;
  config: unknown;
}

export interface QuickReply {
  text: string;
  attachments?: Attachment[];
}

export interface Callback {
  id: string;
  label: string;
  value: string;
}

export interface DirectMessagePayload {
  id: string;
  direction: MessageDirection;
  sender: MessageSender;
  text: string;
  attachments: Attachment[];
  interactions: Interaction[];
  send_at: string;
  conversation: {
    id: string;
    topic: string;
    participants: Participant[];
    agents: Agent[];
    context: any;
  };
}

export interface ReplyMessagePayload {
  id: string;
  text: string;
  callbacks: Callback[];
  quick_replies: QuickReply[];
  send_at: string;
  conversation: {
    id: string;
    context: any;
  };
  message: {
    id: string;
    direction: MessageDirection;
    text: string;
    attachments: Attachment[];
    send_at: string;
  };
  sender: MessageSender;
}

export interface ReplyMessageCallbackPayload {
  id: string;
  label: string;
  value: any;
  conversation: {
    id: string;
    context: any;
  };
  message: {
    id: string;
    direction: MessageDirection;
    text: string;
    attachments: Attachment[];
    send_at: string;
  };
}

export interface HSMMessagePayload {
  id: string;
  direction: MessageDirection;
  text: string;
  rawText: string;
  to: string;
  parameters: any;
  externalTemplateId: string;
  send_at: string;
  conversation: {
    id: string;
    topic: string;
    participants: Participant[];
    agents: Agent[];
    context: any;
  };
  attachments: Attachment[];
}

export interface ConversationFinalizedPayload {
  id: string;
  conversation: {
    id: string;
    context: any;
    closedBySchedule?: boolean;
  };
  message: {
    id: string;
    direction: MessageDirection;
    text: string;
    send_at: string;
  };
}

export type WebhookPayload =
  | DirectMessagePayload
  | ReplyMessagePayload
  | ReplyMessageCallbackPayload
  | HSMMessagePayload
  | ConversationFinalizedPayload;

export interface WebhookEvent {
  type: EventType;
  payload: WebhookPayload;
  channel_instance: string;
  instance: {
    type: string;
    id: string;
    settings?: string;
  };
  access_token: string;
  event_id: string;
  event_time: string;
}

// ── API Request Interfaces ──

export interface HintMessageOptions {
  text?: string;
  attachments?: Attachment[];
  interactions?: Interaction[];
  message_id: string;
  conversation_id: string;
  callbacks?: Callback[];
  quick_replies?: QuickReply[];
  application_context?: Record<string, any>;
}

export interface DirectMessageOptions {
  text?: string;
  attachments?: Attachment[];
  interactions?: Interaction[];
  message_id: string;
  conversation_id: string;
  application_context?: Record<string, any>;
}

export interface HSMMessageOptions {
  channel_id: string;
  account_contact_id?: string;
  contact?: {
    account_id: string;
    first_name?: string;
    last_name?: string;
    phone: string;
    email?: string;
    image_url?: string;
  };
  raw_text: string;
  parameters?: any[];
  external_template_id?: string;
  assign_entity?: 'USER' | 'TEAM';
  assign_entity_id?: string;
  conversation_id?: string;
  send_at?: string;
}

export interface AssignConversationOptions {
  conversation_id: string;
  account_id?: string;
  entity: 'USER' | 'TEAM';
  entity_id: string;
  force_assign?: boolean;
}

export interface AddLabelOptions {
  conversation_id: string;
  account_id?: string;
  labelKey: string;
}
