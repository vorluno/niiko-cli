#!/usr/bin/env node
// GENERADO POR `tooling/build-cli.ts` del monorepo de niiko — NO SE EDITA A MANO.
// Plan `9a8b80d285ff`. Una acción nueva aparece aquí al regenerar; ninguna se añade editando este archivo.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
/** El catálogo, tal como estaba en el plan `9a8b80d285ff`. */
const CATALOGO = [
    {
        "accion": "miira.lead_create",
        "version": 1,
        "alcance": "miira.lead_create@1",
        "proposito": "Crea un lead nuevo en el CRM del workspace a partir de sus datos de contacto. Si ya existe uno que encaja, no lo duplica: contesta `ambiguous` con los candidatos.",
        "motivos": [
            "honeypot",
            "invalid_email",
            "disposable_email",
            "invalid_identity"
        ],
        "entrada": {
            "type": "object",
            "properties": {
                "submissionId": {
                    "type": "string",
                    "format": "uuid"
                },
                "source": {
                    "type": "string",
                    "enum": [
                        "web_form",
                        "referral",
                        "api",
                        "import",
                        "event",
                        "other"
                    ]
                },
                "name": {
                    "type": "string",
                    "maxLength": 256
                },
                "email": {
                    "type": "string",
                    "format": "email",
                    "maxLength": 320
                },
                "phone": {
                    "type": "string",
                    "maxLength": 40
                },
                "fields": {
                    "type": "object",
                    "additionalProperties": true
                },
                "consent": {
                    "type": "object",
                    "properties": {
                        "email": {
                            "type": "boolean"
                        },
                        "whatsapp": {
                            "type": "boolean"
                        },
                        "source": {
                            "type": "string",
                            "enum": [
                                "api",
                                "web_form",
                                "verbal",
                                "llamada",
                                "visita",
                                "imported"
                            ]
                        }
                    },
                    "required": [
                        "source"
                    ],
                    "additionalProperties": true
                }
            },
            "required": [
                "submissionId",
                "source"
            ]
        },
        "salida": {
            "type": "object",
            "properties": {
                "outcome": {
                    "type": "string",
                    "enum": [
                        "created",
                        "existing",
                        "ambiguous",
                        "rejected"
                    ]
                },
                "clientId": {
                    "anyOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "reason": {
                    "anyOf": [
                        {
                            "type": "string",
                            "enum": [
                                "honeypot",
                                "invalid_email",
                                "disposable_email",
                                "invalid_identity"
                            ]
                        },
                        {
                            "type": "null"
                        }
                    ]
                }
            },
            "required": [
                "outcome",
                "clientId",
                "reason"
            ]
        }
    },
    {
        "accion": "crm.call_logged",
        "version": 1,
        "alcance": "crm.call_logged@1",
        "proposito": "Anota en la ficha de un cliente, dicho por su nombre, lo que se habló en una llamada; opcionalmente deja creado el seguimiento con su fecha. No lee nada ni llama a nadie.",
        "motivos": [
            "cliente_no_encontrado",
            "cliente_ambiguo",
            "demasiados_clientes",
            "sin_permiso"
        ],
        "entrada": {
            "type": "object",
            "properties": {
                "client": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200
                },
                "summary": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 4000
                },
                "followUp": {
                    "type": "object",
                    "properties": {
                        "what": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 500
                        },
                        "dueAt": {
                            "type": "string",
                            "format": "date-time"
                        }
                    },
                    "required": [
                        "dueAt"
                    ],
                    "additionalProperties": true
                }
            },
            "required": [
                "client",
                "summary"
            ]
        },
        "salida": {
            "type": "object",
            "properties": {
                "clientId": {
                    "type": "string"
                },
                "clientName": {
                    "type": "string"
                },
                "activityId": {
                    "type": "string"
                },
                "followUpId": {
                    "anyOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "null"
                        }
                    ]
                }
            },
            "required": [
                "clientId",
                "clientName",
                "activityId",
                "followUpId"
            ]
        }
    },
    {
        "accion": "crm.owner_assigned",
        "version": 1,
        "alcance": "crm.owner_assigned@1",
        "proposito": "Cambia de quién es un cliente, diciendo el nombre del cliente y el nombre (o correo) del miembro del equipo. Si alguno de los dos es ambiguo, se niega con la lista.",
        "motivos": [
            "cliente_no_encontrado",
            "cliente_ambiguo",
            "demasiados_clientes",
            "persona_no_encontrada",
            "persona_ambigua",
            "sin_permiso"
        ],
        "entrada": {
            "type": "object",
            "properties": {
                "client": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200
                },
                "owner": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200
                }
            },
            "required": [
                "client",
                "owner"
            ]
        },
        "salida": {
            "type": "object",
            "properties": {
                "clientId": {
                    "type": "string"
                },
                "clientName": {
                    "type": "string"
                },
                "ownerUserId": {
                    "type": "string"
                },
                "ownerName": {
                    "type": "string"
                }
            },
            "required": [
                "clientId",
                "clientName",
                "ownerUserId",
                "ownerName"
            ]
        }
    },
    {
        "accion": "crm.stage_moved",
        "version": 1,
        "alcance": "crm.stage_moved@1",
        "proposito": "Mueve el negocio abierto de un cliente a otra etapa del pipeline, diciendo el nombre del cliente y el de la etapa. No crea negocios: sin uno abierto se niega, y con varios se niega con la lista.",
        "motivos": [
            "cliente_no_encontrado",
            "cliente_ambiguo",
            "demasiados_clientes",
            "sin_negocio_abierto",
            "varios_negocios",
            "etapa_no_encontrada",
            "negocio_cerrado",
            "ya_en_esa_etapa",
            "sin_permiso"
        ],
        "entrada": {
            "type": "object",
            "properties": {
                "client": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200
                },
                "stage": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 120
                },
                "lostReason": {
                    "type": "string",
                    "maxLength": 500
                }
            },
            "required": [
                "client",
                "stage"
            ]
        },
        "salida": {
            "type": "object",
            "properties": {
                "dealId": {
                    "type": "string"
                },
                "clientId": {
                    "type": "string"
                },
                "clientName": {
                    "type": "string"
                },
                "stageName": {
                    "type": "string"
                },
                "won": {
                    "type": "boolean"
                },
                "firstWon": {
                    "type": "boolean"
                }
            },
            "required": [
                "dealId",
                "clientId",
                "clientName",
                "stageName",
                "won",
                "firstWon"
            ]
        }
    },
    {
        "accion": "kiipu.invoice_proposed",
        "version": 1,
        "alcance": "kiipu.invoice_proposed@1",
        "proposito": "Deja preparada una factura como BORRADOR para un cliente dicho por su nombre, con sus líneas e impuestos. NO la emite, NO la numera y NO cuenta como deuda: una persona la revisa y la emite en Kiipu. No crea el cliente si no existe.",
        "motivos": [
            "cliente_no_encontrado",
            "cliente_ambiguo",
            "demasiados_clientes",
            "sin_permiso"
        ],
        "entrada": {
            "type": "object",
            "properties": {
                "client": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200
                },
                "lines": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "concept": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 500
                            },
                            "quantity": {
                                "type": "string",
                                "pattern": "^(?!0+(?:\\.0+)?$)\\d+(?:\\.\\d{1,3})?$"
                            },
                            "unitPriceUsd": {
                                "type": "string",
                                "pattern": "^\\d+(\\.\\d{1,2})?$"
                            },
                            "tax": {
                                "type": "string",
                                "enum": [
                                    "exempt",
                                    "itbms_7",
                                    "itbms_10",
                                    "itbms_15"
                                ],
                                "default": "exempt"
                            }
                        },
                        "required": [
                            "concept",
                            "quantity",
                            "unitPriceUsd"
                        ],
                        "additionalProperties": true
                    }
                },
                "dueAt": {
                    "type": "string",
                    "format": "date-time"
                },
                "series": {
                    "type": "string",
                    "pattern": "^[A-Za-z0-9-]{1,12}$"
                }
            },
            "required": [
                "client",
                "lines"
            ]
        },
        "salida": {
            "type": "object",
            "properties": {
                "invoiceId": {
                    "type": "string"
                },
                "clientId": {
                    "type": "string"
                },
                "clientName": {
                    "type": "string"
                },
                "status": {
                    "const": "draft"
                },
                "subtotalUsd": {
                    "type": "string"
                },
                "taxUsd": {
                    "type": "string"
                },
                "totalUsd": {
                    "type": "string"
                },
                "dueAt": {
                    "type": "string"
                },
                "series": {
                    "type": "string"
                },
                "issueAt": {
                    "const": "/kiipu/facturas"
                }
            },
            "required": [
                "invoiceId",
                "clientId",
                "clientName",
                "status",
                "subtotalUsd",
                "taxUsd",
                "totalUsd",
                "dueAt",
                "series",
                "issueAt"
            ]
        }
    },
    {
        "accion": "crm.task_created",
        "version": 1,
        "alcance": "crm.task_created@1",
        "proposito": "Crea un recordatorio (tarea con fecha y hora) sobre un cliente dicho por su nombre. No anota una llamada: para eso está crm.call_logged. No crea el cliente si no existe.",
        "motivos": [
            "cliente_no_encontrado",
            "cliente_ambiguo",
            "demasiados_clientes",
            "sin_permiso"
        ],
        "entrada": {
            "type": "object",
            "properties": {
                "client": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200
                },
                "what": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 500
                },
                "dueAt": {
                    "type": "string",
                    "format": "date-time"
                }
            },
            "required": [
                "client",
                "what",
                "dueAt"
            ]
        },
        "salida": {
            "type": "object",
            "properties": {
                "clientId": {
                    "type": "string"
                },
                "clientName": {
                    "type": "string"
                },
                "taskId": {
                    "type": "string"
                },
                "dueAt": {
                    "type": "string"
                }
            },
            "required": [
                "clientId",
                "clientName",
                "taskId",
                "dueAt"
            ]
        }
    },
    {
        "accion": "crm.deal_created",
        "version": 1,
        "alcance": "crm.deal_created@1",
        "proposito": "Abre un negocio nuevo en el pipeline para un cliente dicho por su nombre, con título, valor opcional en USD, etapa opcional (por nombre; sin ella, la primera) y responsable opcional. No comprueba si ya tiene otros abiertos: devuelve cuántos quedan para que se vea un duplicado. No lo gana ni lo pierde: eso es crm.stage_moved.",
        "motivos": [
            "cliente_no_encontrado",
            "cliente_ambiguo",
            "demasiados_clientes",
            "etapa_no_encontrada",
            "etapa_cerrada",
            "persona_no_encontrada",
            "persona_ambigua",
            "sin_permiso"
        ],
        "entrada": {
            "type": "object",
            "properties": {
                "client": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200
                },
                "title": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200
                },
                "valueUsd": {
                    "type": "string",
                    "pattern": "^\\d+(\\.\\d{1,2})?$"
                },
                "stage": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 120
                },
                "owner": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200
                }
            },
            "required": [
                "client",
                "title"
            ]
        },
        "salida": {
            "type": "object",
            "properties": {
                "dealId": {
                    "type": "string"
                },
                "clientId": {
                    "type": "string"
                },
                "clientName": {
                    "type": "string"
                },
                "title": {
                    "type": "string"
                },
                "valueUsd": {
                    "anyOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "stageName": {
                    "type": "string"
                },
                "ownerName": {
                    "anyOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "openDeals": {
                    "type": "integer",
                    "minimum": 1
                }
            },
            "required": [
                "dealId",
                "clientId",
                "clientName",
                "title",
                "valueUsd",
                "stageName",
                "ownerName",
                "openDeals"
            ]
        }
    },
    {
        "accion": "crm.note_added",
        "version": 1,
        "alcance": "crm.note_added@1",
        "proposito": "Guarda una nota en la ficha de un cliente dicho por su nombre: algo que hay que saber la próxima vez, sin llamada ni fecha. Para una llamada está crm.call_logged; para un recordatorio con fecha, crm.task_created.",
        "motivos": [
            "cliente_no_encontrado",
            "cliente_ambiguo",
            "demasiados_clientes",
            "sin_permiso"
        ],
        "entrada": {
            "type": "object",
            "properties": {
                "client": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200
                },
                "note": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 2000
                }
            },
            "required": [
                "client",
                "note"
            ]
        },
        "salida": {
            "type": "object",
            "properties": {
                "clientId": {
                    "type": "string"
                },
                "clientName": {
                    "type": "string"
                },
                "noteId": {
                    "type": "string"
                }
            },
            "required": [
                "clientId",
                "clientName",
                "noteId"
            ]
        }
    },
    {
        "accion": "crm.contact_added",
        "version": 1,
        "alcance": "crm.contact_added@1",
        "proposito": "Añade una persona (nombre, y opcionalmente correo, teléfono y cargo) a la ficha de un cliente dicho por su nombre. No la hace contacto principal ni crea el cliente. Si ya había alguien con ese correo o teléfono, lo dice en la respuesta pero no lo impide.",
        "motivos": [
            "cliente_no_encontrado",
            "cliente_ambiguo",
            "demasiados_clientes",
            "sin_permiso"
        ],
        "entrada": {
            "type": "object",
            "properties": {
                "client": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200
                },
                "name": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200
                },
                "email": {
                    "type": "string",
                    "format": "email",
                    "maxLength": 320
                },
                "phone": {
                    "type": "string",
                    "minLength": 5,
                    "maxLength": 40
                },
                "role": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 120
                }
            },
            "required": [
                "client",
                "name"
            ]
        },
        "salida": {
            "type": "object",
            "properties": {
                "clientId": {
                    "type": "string"
                },
                "clientName": {
                    "type": "string"
                },
                "contactId": {
                    "type": "string"
                },
                "possibleDuplicate": {
                    "type": "boolean"
                }
            },
            "required": [
                "clientId",
                "clientName",
                "contactId",
                "possibleDuplicate"
            ]
        }
    },
    {
        "accion": "miira.broadcast_quoted",
        "version": 1,
        "alcance": "miira.broadcast_quoted@1",
        "proposito": "Presupuesta mandar el MISMO mensaje de WhatsApp a varios clientes dichos por su nombre (hasta 50). NO envía nada: dice, por cliente, si le llega el texto tal cual (ventana de 24 h abierta, gratis), si hace falta una plantilla aprobada y cuánto cuesta, o por qué no se le puede escribir. Devuelve un presupuesto firmado que vale 15 minutos; para enviar, llama a miira.broadcast_sent con él. Enséñale el presupuesto a la persona antes.",
        "motivos": [
            "plantilla_invalida",
            "tarifas_vencidas",
            "sin_permiso"
        ],
        "entrada": {
            "type": "object",
            "properties": {
                "clients": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 200
                    }
                },
                "message": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 4096
                },
                "template": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 512
                },
                "templateValues": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "maxLength": 1024
                    }
                }
            },
            "required": [
                "clients",
                "message"
            ]
        },
        "salida": {
            "type": "object",
            "properties": {
                "rows": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "client": {
                                "type": "string"
                            },
                            "clientId": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "clientName": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "outcome": {
                                "type": "string",
                                "enum": [
                                    "free_text",
                                    "template",
                                    "needs_template",
                                    "no_phone",
                                    "suppressed",
                                    "consent_revoked",
                                    "no_marketing_consent",
                                    "quiet_hours",
                                    "not_found",
                                    "ambiguous",
                                    "too_many"
                                ]
                            },
                            "costUsd": {
                                "anyOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "null"
                                    }
                                ]
                            },
                            "candidates": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            }
                        },
                        "required": [
                            "client",
                            "clientId",
                            "clientName",
                            "outcome",
                            "costUsd"
                        ],
                        "additionalProperties": true
                    }
                },
                "totals": {
                    "type": "object",
                    "properties": {
                        "freeText": {
                            "type": "integer"
                        },
                        "template": {
                            "type": "integer"
                        },
                        "skipped": {
                            "type": "integer"
                        },
                        "costUsd": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "freeText",
                        "template",
                        "skipped",
                        "costUsd"
                    ],
                    "additionalProperties": true
                },
                "quote": {
                    "anyOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "expiresAt": {
                    "anyOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "null"
                        }
                    ]
                }
            },
            "required": [
                "rows",
                "totals",
                "quote",
                "expiresAt"
            ]
        }
    },
    {
        "accion": "miira.broadcast_sent",
        "version": 1,
        "alcance": "miira.broadcast_sent@1",
        "proposito": "Envía la difusión de WhatsApp presupuestada por miira.broadcast_quoted, exactamente a quienes y como dijo el presupuesto. Si algo cambió (ventana, consentimiento, tarifa) se niega con el presupuesto nuevo para confirmarlo otra vez. Cuesta dinero cuando hay plantillas: no lo llames sin que la persona haya visto el coste.",
        "motivos": [
            "presupuesto_invalido",
            "presupuesto_vencido",
            "presupuesto_cambiado",
            "plantilla_invalida",
            "tarifas_vencidas",
            "sin_permiso"
        ],
        "entrada": {
            "type": "object",
            "properties": {
                "quote": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 65536
                }
            },
            "required": [
                "quote"
            ]
        },
        "salida": {
            "type": "object",
            "properties": {
                "queued": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "clientId": {
                                "type": "string"
                            },
                            "clientName": {
                                "type": "string"
                            },
                            "mode": {
                                "type": "string",
                                "enum": [
                                    "free_text",
                                    "template"
                                ]
                            },
                            "outboxId": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "clientId",
                            "clientName",
                            "mode",
                            "outboxId"
                        ],
                        "additionalProperties": true
                    }
                },
                "costUsd": {
                    "type": "string"
                }
            },
            "required": [
                "queued",
                "costUsd"
            ]
        }
    },
    {
        "accion": "kiipu.draft_voided",
        "version": 1,
        "alcance": "kiipu.draft_voided@1",
        "proposito": "Anula un BORRADOR de factura (uno creado con kiipu.invoice_proposed y todavía no emitido), por su id o por el nombre del cliente si es su único borrador. No anula facturas emitidas: eso es de una persona en Kiipu.",
        "motivos": [
            "cliente_no_encontrado",
            "cliente_ambiguo",
            "demasiados_clientes",
            "borrador_no_encontrado",
            "varios_borradores",
            "no_es_borrador",
            "sin_permiso"
        ],
        "entrada": {
            "type": "object",
            "properties": {
                "invoiceId": {
                    "type": "string",
                    "format": "uuid"
                },
                "client": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200
                }
            },
            "required": []
        },
        "salida": {
            "type": "object",
            "properties": {
                "invoiceId": {
                    "type": "string"
                },
                "clientId": {
                    "type": "string"
                },
                "clientName": {
                    "type": "string"
                },
                "totalUsd": {
                    "type": "string"
                },
                "status": {
                    "const": "void"
                }
            },
            "required": [
                "invoiceId",
                "clientId",
                "clientName",
                "totalUsd",
                "status"
            ]
        }
    },
    {
        "accion": "kiipu.payment_reported",
        "version": 1,
        "alcance": "kiipu.payment_reported@1",
        "proposito": "Deja en la cola de aprobación de Kiipu el aviso de que un cliente (por su nombre) pagó cierto monto de una factura abierta. NO aplica el pago ni toca saldos: una persona lo revisa contra el banco y lo aplica. Si el cliente tiene varias facturas abiertas hay que decir el número.",
        "motivos": [
            "cliente_no_encontrado",
            "cliente_ambiguo",
            "demasiados_clientes",
            "sin_factura_abierta",
            "varias_facturas",
            "factura_no_encontrada",
            "sin_permiso"
        ],
        "entrada": {
            "type": "object",
            "properties": {
                "client": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200
                },
                "amountUsd": {
                    "type": "string",
                    "pattern": "^\\d+(\\.\\d{1,2})?$"
                },
                "invoice": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 40
                }
            },
            "required": [
                "client",
                "amountUsd"
            ]
        },
        "salida": {
            "type": "object",
            "properties": {
                "submissionId": {
                    "type": "string"
                },
                "clientId": {
                    "type": "string"
                },
                "clientName": {
                    "type": "string"
                },
                "invoiceId": {
                    "type": "string"
                },
                "invoiceNumber": {
                    "type": "string"
                },
                "outstandingUsd": {
                    "type": "string"
                },
                "declaredUsd": {
                    "type": "string"
                },
                "status": {
                    "const": "received"
                },
                "reviewAt": {
                    "const": "/kiipu/aprobaciones"
                }
            },
            "required": [
                "submissionId",
                "clientId",
                "clientName",
                "invoiceId",
                "invoiceNumber",
                "outstandingUsd",
                "declaredUsd",
                "status",
                "reviewAt"
            ]
        }
    }
];
const RUTA_CONFIG = join(process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config"), "niiko", "config.json");
function leerConfig() {
    if (!existsSync(RUTA_CONFIG))
        return null;
    try {
        const c = JSON.parse(readFileSync(RUTA_CONFIG, "utf8"));
        return typeof c.url === "string" && typeof c.apiKey === "string" ? { url: c.url, apiKey: c.apiKey } : null;
    }
    catch {
        return null;
    }
}
/** La llave: `--key`, o `NIIKO_API_KEY`, o la guardada. En ese orden, para que un script pueda mandar sin tocar
 *  la configuración de la persona. Nunca se imprime. */
function credenciales(args) {
    const guardada = leerConfig();
    const url = args.get("url") ?? process.env.NIIKO_URL ?? guardada?.url ?? "https://niiko.org";
    const apiKey = args.get("key") ?? process.env.NIIKO_API_KEY ?? guardada?.apiKey;
    return apiKey ? { url: url.replace(/\/+$/, ""), apiKey } : null;
}
function salir(codigo, cuerpo) {
    process.stdout.write(JSON.stringify(cuerpo, null, 2) + "\n");
    process.exit(codigo);
}
/** `--a b` y `--a=b`. Lo que no empieza por `--` es posicional. */
function parsear(argv) {
    const posicionales = [];
    const args = new Map();
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a.startsWith("--")) {
            const [k, v] = a.slice(2).split("=", 2);
            if (v !== undefined)
                args.set(k, v);
            else if (i + 1 < argv.length && !argv[i + 1].startsWith("--"))
                args.set(k, argv[++i]);
            else
                args.set(k, "");
        }
        else
            posicionales.push(a);
    }
    return { posicionales, args };
}
function leerEntrada(args) {
    const crudo = args.get("input");
    let texto;
    if (crudo === undefined) {
        if (process.stdin.isTTY)
            salir(1, { error: "falta la entrada: --input '{…}', --input @archivo, o por stdin" });
        texto = readFileSync(0, "utf8");
    }
    else if (crudo.startsWith("@"))
        texto = readFileSync(crudo.slice(1), "utf8");
    else
        texto = crudo;
    try {
        return JSON.parse(texto);
    }
    catch {
        return salir(1, { error: "la entrada no es JSON válido" });
    }
}
function uuid() {
    return globalThis.crypto.randomUUID();
}
const AYUDA = `niiko — la API de acciones de niiko desde la terminal (plan 9a8b80d285ff)

  niiko login --url https://niiko.org --key nk_…   guarda la llave en ${RUTA_CONFIG}
  niiko actions                                    las acciones abiertas, con su propósito
  niiko describe <accion>                          entrada, salida y motivos de una acción
  niiko run <accion> --input '{…}'                 ejerce una acción (también --input @archivo o stdin)
      [--idempotency-key K] [--key nk_…] [--url …]

Códigos de salida de \`run\`: 0 hecho · 2 negada (el motivo va en la salida) · 3 esperando una firma · 1 error.
La llave también se lee de NIIKO_API_KEY y la URL de NIIKO_URL.`;
async function main() {
    const { posicionales, args } = parsear(process.argv.slice(2));
    const cmd = posicionales[0];
    if (!cmd || cmd === "help" || args.has("help")) {
        process.stdout.write(AYUDA + "\n");
        process.exit(0);
    }
    if (cmd === "login") {
        const apiKey = args.get("key") ?? process.env.NIIKO_API_KEY;
        if (!apiKey)
            salir(1, { error: "falta --key nk_… (o NIIKO_API_KEY)" });
        const url = (args.get("url") ?? process.env.NIIKO_URL ?? "https://niiko.org").replace(/\/+$/, "");
        mkdirSync(join(RUTA_CONFIG, ".."), { recursive: true });
        writeFileSync(RUTA_CONFIG, JSON.stringify({ url, apiKey }, null, 2) + "\n", { mode: 0o600 });
        // Se dice DÓNDE quedó y con qué prefijo, nunca la llave entera: la terminal es un historial.
        salir(0, { guardado: RUTA_CONFIG, url, key: apiKey.slice(0, 7) + "…" });
    }
    if (cmd === "actions") {
        salir(0, CATALOGO.map((a) => ({ accion: a.accion, version: a.version, alcance: a.alcance, proposito: a.proposito })));
    }
    if (cmd === "describe") {
        const id = posicionales[1];
        const a = CATALOGO.find((x) => x.accion === id);
        if (!a)
            salir(1, { error: `no existe la acción \`${id}\``, disponibles: CATALOGO.map((x) => x.accion) });
        salir(0, a);
    }
    if (cmd === "run") {
        const id = posicionales[1];
        const a = CATALOGO.find((x) => x.accion === id);
        if (!a)
            salir(1, { error: `no existe la acción \`${id}\``, disponibles: CATALOGO.map((x) => x.accion) });
        const cred = credenciales(args);
        if (!cred)
            salir(1, { error: "sin llave: niiko login --key nk_…, o NIIKO_API_KEY, o --key" });
        const entrada = leerEntrada(args);
        const clave = args.get("idempotency-key") ?? uuid();
        let r;
        try {
            r = await fetch(`${cred.url}/api/v1/actions/${a.accion}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${cred.apiKey}`,
                    "Content-Type": "application/json",
                    // Siempre con clave: sin ella un reintento por timeout duplica el efecto, y el servidor lo exige.
                    "Idempotency-Key": clave,
                    "User-Agent": "niiko-cli/9a8b80d285ff",
                },
                body: JSON.stringify(entrada),
            });
        }
        catch (e) {
            salir(1, { error: "no se pudo conectar", detalle: String(e), url: cred.url });
        }
        const cuerpo = await r.json().catch(() => null);
        const status = cuerpo?.status;
        // La llave de idempotencia viaja en la salida aunque el servidor no la eche: es lo que permite reintentar
        // EXACTAMENTE lo mismo si la terminal murió antes de leer la respuesta.
        const salida = typeof cuerpo === "object" && cuerpo !== null ? { ...cuerpo, idempotencyKey: cuerpo.idempotencyKey ?? clave } : { http: r.status, cuerpo };
        if (status === "done")
            salir(0, salida);
        if (status === "pending_approval")
            salir(3, salida);
        if (status === "refused")
            salir(2, salida);
        salir(1, { error: `respuesta inesperada (HTTP ${r.status})`, ...salida });
    }
    salir(1, { error: `comando desconocido: ${cmd}`, ayuda: "niiko help" });
}
main().catch((e) => salir(1, { error: String(e) }));
