import axios, { AxiosInstance } from 'axios';
import {
  AddLabelOptions,
  AssignConversationOptions,
  DirectMessageOptions,
  HintCallbackOptions,
  HintMessageOptions,
  HSMMessageOptions,
} from './types';

export class SocialdeskClient {
  private http: AxiosInstance;

  constructor(
    private accessToken: string,
    baseURL: string = 'https://api.socialdesk.com',
  ) {
    this.http = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Send a hint message visible only to the agent.
   */
  async sendHintMessage(options: HintMessageOptions): Promise<{ success: boolean }> {
    const { data } = await this.http.post('/web-api/messages/reply', {
      text: options.text,
      attachments: options.attachments ?? [],
      interactions: options.interactions ?? [],
      message_id: options.message_id,
      conversation_id: options.conversation_id,
      callbacks: options.callbacks ?? [],
      quick_replies: options.quick_replies ?? [],
      send_as_direct_message: false,
      application_context: options.application_context,
    });
    return data;
  }

  /**
   * Send a direct message to the end participant (requires "automatic replies" permission).
   */
  async sendDirectMessage(options: DirectMessageOptions): Promise<{ success: boolean }> {
    const { data } = await this.http.post('/web-api/messages/reply', {
      text: options.text,
      attachments: options.attachments ?? [],
      interactions: options.interactions ?? [],
      message_id: options.message_id,
      conversation_id: options.conversation_id,
      callbacks: [],
      quick_replies: [],
      send_as_direct_message: true,
      application_context: options.application_context,
    });
    return data;
  }

  /**
   * Execute a hint callback action.
   */
  async sendHintCallback(options: HintCallbackOptions): Promise<{ success: boolean }> {
    const { data } = await this.http.post('/web-api/messages/reply/callback', {
      callback_id: options.callback_id,
      message_id: options.message_id,
      reply_id: options.reply_id,
      conversation_id: options.conversation_id,
      app_instance: options.app_instance,
      callback_value: options.callback_value,
    });
    return data;
  }

  /**
   * Send an HSM (template) message to a participant.
   */
  async sendHSMMessage(options: HSMMessageOptions): Promise<{ success: boolean }> {
    const body: Record<string, any> = {
      channel_id: options.channel_id,
      raw_text: options.raw_text,
    };

    // Identificar destinatario: account_contact_id O contact, no ambos
    if (options.account_contact_id) {
      body.account_contact_id = options.account_contact_id;
    } else if (options.contact) {
      body.contact = options.contact;
    }

    if (options.parameters) body.parameters = options.parameters;
    if (options.external_template_id) body.external_template_id = options.external_template_id;
    if (options.assign_entity) body.assign_entity = options.assign_entity;
    if (options.assign_entity_id) body.assign_entity_id = options.assign_entity_id;
    if (options.conversation_id) body.conversation_id = options.conversation_id;
    if (options.send_at) body.send_at = options.send_at;

    const { data } = await this.http.post('/web-api/messages/HSM', body);
    return data;
  }

  /**
   * Assign a conversation to an agent or team.
   */
  async assignConversation(options: AssignConversationOptions): Promise<{ success: boolean }> {
    const { data } = await this.http.post('/web-api/conversations/assign', {
      conversation_id: options.conversation_id,
      account_id: options.account_id ?? null,
      entity: options.entity,
      entity_id: options.entity_id,
      force_assign: options.force_assign ?? false,
    });
    return data;
  }

  /**
   * Add a label to a conversation.
   */
  async addLabel(options: AddLabelOptions): Promise<{ success: boolean }> {
    const { data } = await this.http.post('/web-api/conversations/labels/add', {
      conversation_id: options.conversation_id,
      account_id: options.account_id,
      labelKey: options.labelKey,
    });
    return data;
  }
}
