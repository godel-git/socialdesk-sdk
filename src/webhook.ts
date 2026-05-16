import {
  ConversationFinalizedPayload,
  DirectMessagePayload,
  EventType,
  HSMMessagePayload,
  ReplyMessageCallbackPayload,
  ReplyMessagePayload,
  WebhookEvent,
  WebhookPayload,
} from './types';
import { SocialdeskClient } from './client';

/**
 * Helper class to parse and extract data from Socialdesk webhook events.
 */
export class WebhookHelper {
  constructor(private event: WebhookEvent) {}

  /** Get the event type. */
  getEventType(): EventType {
    return this.event.type;
  }

  /** Get the raw payload. */
  getPayload(): WebhookPayload {
    return this.event.payload;
  }

  /** Get the access token to call the API. */
  getAccessToken(): string {
    return this.event.access_token;
  }

  /** Get the channel instance ID. */
  getChannelInstance(): string {
    return this.event.channel_instance;
  }

  /** Get the app instance ID. */
  getInstanceId(): string {
    return this.event.instance.id;
  }

  /** Get the parsed app settings from event.extension_settings. */
  getSettings<T = any>(): T {
    return (this.event.extension_settings ?? {}) as T;
  }

  /** Get the conversation ID from any event type. */
  getConversationId(): string {
    const payload = this.event.payload;
    if ('conversation' in payload && payload.conversation) {
      return payload.conversation.id;
    }
    return '';
  }

  /** Get the message ID from any event type. */
  getMessageId(): string {
    const payload = this.event.payload;
    const type = this.event.type;

    if (type === EventType.DirectMessage || type === EventType.HSMMessage) {
      return (payload as DirectMessagePayload).id;
    }
    if (type === EventType.ReplyMessage || type === EventType.ReplyMessageCallback) {
      return (payload as ReplyMessagePayload | ReplyMessageCallbackPayload).message.id;
    }
    if (type === EventType.ConversationFinalized) {
      return (payload as ConversationFinalizedPayload).message.id;
    }
    return '';
  }

  /** Get the message text from any event type. */
  getMessageText(): string {
    const payload = this.event.payload;
    const type = this.event.type;

    if (type === EventType.DirectMessage) {
      return (payload as DirectMessagePayload).text;
    }
    if (type === EventType.HSMMessage) {
      return (payload as HSMMessagePayload).text;
    }
    if (type === EventType.ReplyMessage || type === EventType.ReplyMessageCallback) {
      return (payload as ReplyMessagePayload | ReplyMessageCallbackPayload).message.text;
    }
    if (type === EventType.ConversationFinalized) {
      return (payload as ConversationFinalizedPayload).message.text;
    }
    return '';
  }

  /** Get the full conversation context from any event type. */
  getConversationContext<T = any>(): T {
    const payload = this.event.payload;
    if ('conversation' in payload && payload.conversation) {
      return (payload.conversation as any).context ?? ({} as T);
    }
    return {} as T;
  }

  /** Get the application_context for this app from the conversation context (assistants.{appInstanceId}). */
  getApplicationContext<T = any>(): T {
    const context = this.getConversationContext<Record<string, any>>();
    const appInstanceId = this.getInstanceId();
    return (context?.assistants?.[appInstanceId] ?? {}) as T;
  }

  /** Check if the event is a specific type. */
  isEventType(type: EventType): boolean {
    return this.event.type === type;
  }

  /** Create a SocialdeskClient pre-authenticated with the event's access token. */
  createClient(baseURL?: string): SocialdeskClient {
    return new SocialdeskClient(this.event.access_token, baseURL);
  }
}
