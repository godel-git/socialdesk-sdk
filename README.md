# socialdesk-node

[![npm version](https://img.shields.io/npm/v/socialdesk-node.svg)](https://www.npmjs.com/package/socialdesk-node)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue.svg)](https://www.typescriptlang.org/)

SDK oficial de [Socialdesk](https://socialdesk.cr) para Node.js.

- Tipado completo en TypeScript
- Helper para parsear webhooks
- Cliente HTTP pre-autenticado

## Ejemplo

```typescript
import { WebhookHelper, EventType } from 'socialdesk-node';

app.post('/webhook', async (req, res) => {
  const webhook = new WebhookHelper(req.body);
  const client = webhook.createClient();

  if (webhook.isEventType(EventType.DirectMessage)) {
    await client.sendHintMessage({
      text: 'El cliente preguntó por precios',
      message_id: webhook.getMessageId(),
      conversation_id: webhook.getConversationId(),
      quick_replies: [
        { text: 'El Plan Básico cuesta $79/mes + IVA.' },
      ],
    });
  }

  res.json({ ok: true });
});
```

## Funcionalidades

| Método | Descripción |
|---|---|
| `sendHintMessage` | Envía un mensaje visible solo para el agente |
| `sendDirectMessage` | Envía un mensaje directo al participante |
| `sendHSMMessage` | Envía un mensaje con plantilla (HSM) |
| `sendHintCallback` | Ejecuta un callback de un hint message |
| `assignConversation` | Asigna una conversación a un agente o equipo |
| `addLabel` | Agrega una etiqueta a una conversación |

## Documentación

[socialdesk-docs.web.app](https://socialdesk-docs.web.app)

## Licencia

MIT
