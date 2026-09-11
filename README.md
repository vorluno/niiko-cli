# niiko-cli

La API de acciones de niiko desde la terminal. **Generada** del mismo plan que los SDK, la referencia y el
servidor MCP (plan `9a8b80d285ff`): una acción nueva aparece al regenerar, y este repositorio no se edita a mano.

```bash
npm i -g niiko-cli
niiko login --key nk_…            # guarda la llave (0600) en ~/.config/niiko/config.json
niiko actions                     # las acciones abiertas, con su propósito
niiko describe miira.lead_create
niiko run miira.lead_create --input '{ … }'
```

La salida es siempre JSON. El desenlace va en el **código de salida**: `0` hecho · `2` negada (el motivo, con
nombre, va en la salida) · `3` esperando una firma humana · `1` error de la CLI o del transporte. Así
`niiko run … && siguiente` hace lo correcto sin parsear nada.

La llave también se lee de `NIIKO_API_KEY` (y la URL de `NIIKO_URL`), para scripts que no deban tocar la
configuración de la persona. Cada `run` manda una `Idempotency-Key` (o la que le pases con
`--idempotency-key`): reintentar lo mismo no duplica el efecto.

## Las acciones de hoy

- `miira.lead_create` — Crea un lead nuevo en el CRM del workspace a partir de sus datos de contacto. Si ya existe uno que encaja, no lo duplica: contesta `ambiguous` con los candidatos.
- `crm.call_logged` — Anota en la ficha de un cliente, dicho por su nombre, lo que se habló en una llamada; opcionalmente deja creado el seguimiento con su fecha. No lee nada ni llama a nadie.
- `crm.owner_assigned` — Cambia de quién es un cliente, diciendo el nombre del cliente y el nombre (o correo) del miembro del equipo. Si alguno de los dos es ambiguo, se niega con la lista.
- `crm.stage_moved` — Mueve el negocio abierto de un cliente a otra etapa del pipeline, diciendo el nombre del cliente y el de la etapa. No crea negocios: sin uno abierto se niega, y con varios se niega con la lista.
- `kiipu.invoice_proposed` — Deja preparada una factura como BORRADOR para un cliente dicho por su nombre, con sus líneas e impuestos. NO la emite, NO la numera y NO cuenta como deuda: una persona la revisa y la emite en Kiipu. No crea el cliente si no existe.
- `crm.task_created` — Crea un recordatorio (tarea con fecha y hora) sobre un cliente dicho por su nombre. No anota una llamada: para eso está crm.call_logged. No crea el cliente si no existe.
- `crm.deal_created` — Abre un negocio nuevo en el pipeline para un cliente dicho por su nombre, con título, valor opcional en USD, etapa opcional (por nombre; sin ella, la primera) y responsable opcional. No comprueba si ya tiene otros abiertos: devuelve cuántos quedan para que se vea un duplicado. No lo gana ni lo pierde: eso es crm.stage_moved.
- `crm.note_added` — Guarda una nota en la ficha de un cliente dicho por su nombre: algo que hay que saber la próxima vez, sin llamada ni fecha. Para una llamada está crm.call_logged; para un recordatorio con fecha, crm.task_created.
- `crm.contact_added` — Añade una persona (nombre, y opcionalmente correo, teléfono y cargo) a la ficha de un cliente dicho por su nombre. No la hace contacto principal ni crea el cliente. Si ya había alguien con ese correo o teléfono, lo dice en la respuesta pero no lo impide.
- `miira.broadcast_quoted` — Presupuesta mandar el MISMO mensaje de WhatsApp a varios clientes dichos por su nombre (hasta 50). NO envía nada: dice, por cliente, si le llega el texto tal cual (ventana de 24 h abierta, gratis), si hace falta una plantilla aprobada y cuánto cuesta, o por qué no se le puede escribir. Devuelve un presupuesto firmado que vale 15 minutos; para enviar, llama a miira.broadcast_sent con él. Enséñale el presupuesto a la persona antes.
- `miira.broadcast_sent` — Envía la difusión de WhatsApp presupuestada por miira.broadcast_quoted, exactamente a quienes y como dijo el presupuesto. Si algo cambió (ventana, consentimiento, tarifa) se niega con el presupuesto nuevo para confirmarlo otra vez. Cuesta dinero cuando hay plantillas: no lo llames sin que la persona haya visto el coste.
- `kiipu.draft_voided` — Anula un BORRADOR de factura (uno creado con kiipu.invoice_proposed y todavía no emitido), por su id o por el nombre del cliente si es su único borrador. No anula facturas emitidas: eso es de una persona en Kiipu.
- `kiipu.payment_reported` — Deja en la cola de aprobación de Kiipu el aviso de que un cliente (por su nombre) pagó cierto monto de una factura abierta. NO aplica el pago ni toca saldos: una persona lo revisa contra el banco y lo aplica. Si el cliente tiene varias facturas abiertas hay que decir el número.

Hacen falta **dos** permisos para cada una: una llave con su alcance, y que el dueño del workspace la haya
encendido. Referencia completa: https://developers.niiko.org
