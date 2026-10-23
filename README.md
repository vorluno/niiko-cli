# niiko-cli

The niiko API from the terminal. One binary, six commands, and the outcome in the exit code.

[![npm](https://img.shields.io/npm/v/niiko-cli?style=flat-square&color=0969da)](https://www.npmjs.com/package/niiko-cli) [![node](https://img.shields.io/badge/node-%3E%3D20-2C6440?style=flat-square)](https://nodejs.org) ![dependencies](https://img.shields.io/badge/dependencies-0-2C6440?style=flat-square) ![license](https://img.shields.io/badge/license-MIT-0969da?style=flat-square) [![generated](https://img.shields.io/badge/generated_from_plan-dcf053ee9096-555?style=flat-square)](https://developers.niiko.org)

**A CLI that knows the actions it was written for is stale the day a new one opens.** This one is generated
from the same plan as the SDKs, the reference and the MCP server (plan `dcf053ee9096`, reads plan
`3f80df17e901`): when an action or a read opens, `niiko actions` or `niiko reads` lists it — nobody edits
this repository by hand.

## Install

```bash
npm install -g niiko-cli
```

Node 20 or newer. No runtime dependencies — `fetch`, `fs` and `os` ship with Node.

## Use

```bash
niiko login --key nk_…            # saves the key (mode 0600) to ~/.config/niiko/config.json
niiko actions                     # what is open today, with its purpose
niiko describe miira.lead_create
niiko run miira.lead_create --input '{ … }'

niiko login --token …             # an OAuth access token: what reads need
niiko reads                       # the public reads
niiko read kiipu.collections_get  # what is owed today
```

Output is always JSON. **The outcome is the exit code**, so a script never has to parse anything:

| Exit code | Meaning |
|---|---|
| `0` | `done` — the action happened; `output` is in stdout. |
| `2` | `refused` — it did not happen; `reason` names why and `detail.message` says what to do. |
| `3` | `pending_approval` — it is waiting for a human signature and may complete hours later. |
| `1` | An error of the CLI itself or of the transport. |

```bash
niiko run crm.note_added --input '{ "client": "Casa Mestiza", "note": "Prefers WhatsApp." }' && echo "saved"
```

> [!NOTE]
> Every `run` sends an `Idempotency-Key` (or the one you pass with `--idempotency-key`), and echoes it in the
> output even when the server does not. Retrying the same key never runs the action twice — so if the terminal
> died before you read the reply, run it again with the key you got.

The key is also read from `NIIKO_API_KEY` and the URL from `NIIKO_URL`, in that order after `--key`/`--url`,
for scripts that must not touch a person's configuration. The key is never printed.

## The actions today (13)

| Action | What it does |
|---|---|
| `miira.lead_create` | Creates a new lead in the workspace CRM from its contact details. If a matching one already exists it is not duplicated: the reply is `ambiguous` with the candidates. |
| `crm.call_logged` | Logs what was discussed in a call on a client's record, naming the client; optionally creates the follow-up with its date. Reads nothing and calls no one. |
| `crm.owner_assigned` | Changes who owns a client, naming the client and the team member (by name or email). If either is ambiguous it refuses with the list. |
| `crm.stage_moved` | Moves a client's open deal to another pipeline stage, naming the client and the stage. Creates no deals: with no open deal it refuses, and with several it refuses with the list. |
| `kiipu.invoice_proposed` | Prepares an invoice as a DRAFT for a client named by name, with its lines and taxes. Does NOT issue it, does NOT number it and does NOT count as debt: a person reviews and issues it in Kiipu. Does not create the client if it does not exist. |
| `crm.task_created` | Creates a reminder (a task with date and time) on a client named by name. Does not log a call: that is crm.call_logged. Does not create the client if it does not exist. |
| `crm.deal_created` | Opens a new deal in the pipeline for a client named by name, with a title, an optional value in USD, an optional stage (by name; without it, the first one) and an optional owner. Does not check for other open deals: it returns how many remain so a duplicate is visible. Does not win or lose it: that is crm.stage_moved. |
| `crm.note_added` | Saves a note on a client's record, naming the client: something to know next time, with no call and no date. For a call use crm.call_logged; for a dated reminder, crm.task_created. |
| `crm.contact_added` | Adds a person (name, and optionally email, phone and role) to a client's record, naming the client. Does not make them the primary contact and does not create the client. If someone with that email or phone already existed, the reply says so but does not block it. |
| `miira.broadcast_quoted` | Quotes sending the SAME WhatsApp message to several clients named by name (up to 50). Sends NOTHING: per client, it says whether the text goes as-is (24-hour window open, free), whether an approved template is needed and what it costs, or why that client cannot be messaged. Returns a signed quote valid for 15 minutes; to send, call miira.broadcast_sent with it. Show the quote to the person first. Optional `purpose`: `notice` (default) is the usual notice; `promotion` NEVER sends free text, even with the window open, and requires an approved MARKETING template (otherwise plantilla_invalida): it only reaches clients with granted marketing consent (no_marketing_consent otherwise) and leaves US numbers out (us_moratorium). In a promotion `message` is never sent: what goes is the template with its `templateValues`. Use `promotion` for offers and campaigns, never for a reply or a notice. |
| `miira.broadcast_sent` | Sends the WhatsApp broadcast quoted by miira.broadcast_quoted, exactly to whom and how the quote said. If anything changed (window, consent, rate) it refuses with a new quote to confirm again. Costs money when templates are involved: do not call it without the person having seen the cost. |
| `kiipu.draft_voided` | Voids a DRAFT invoice (one created with kiipu.invoice_proposed and not yet issued), by its id or by the client's name when it is their only draft. Does not void issued invoices: that is for a person in Kiipu. |
| `kiipu.payment_reported` | Leaves in the Kiipu approval queue the notice that a client (by name) paid a given amount of an open invoice. Does NOT apply the payment and touches no balances: a person checks it against the bank and applies it. If the client has several open invoices the number must be given. |

## The reads today (14)

Read-only, and **with an OAuth access token** (`niiko login --token`, `--token` or `NIIKO_ACCESS_TOKEN`): a read is
done on behalf of a person, with their role, so an API key gets `reads_need_a_person`. `niiko read` exits `0` on
`done` and `2` on `refused`.

| Read | What it returns |
|---|---|
| `crm.clients_search` | Counts and finds the workspace's CRM clients, optionally by part of the name, status, tag or creation date. Returns the total, the total per status and up to 15 clients with status, owner and creation day. No contact details and no notes. |
| `kiipu.collections_get` | Reads what is owed: the outstanding total, what is overdue by age bucket, the 15 clients who owe the most with their overdue amount and since when, and the next installments due. Changes nothing and contacts no one. |
| `kiipu.collected_month_get` | Reads how much was collected this month so far (as the ledger recorded it), the same stretch of last month to compare, and what is still outstanding. Does not say who owes: that is kiipu.collections_get. |
| `kiipu.client_invoices_list` | Lists the latest invoices and payments of ONE client named by name: number, status, total, balance, and when and how they paid. With several matches it refuses with `ambiguous` and the candidates; with none, `not_found`. |
| `miira.conversations_waiting_get` | Reads how many conversations a team member is handling, how many are waiting for a reply, how many have waited longer than the workspace threshold and the longest wait. Counts only: no names and no messages. |
| `ciita.agenda_get` | Reads the appointments of today, this week, next week or this month: how many per status and the first 15 with day, time in the workspace time zone, client, resource and status. Books nothing. |
| `miira.funnel_get` | Reads the Miira lead funnel by stage (the same rule as the board), how many leads are qualified, how many came in this month and the 15 most recent with their stage. Clients who already bought are in the CRM, not here. |
| `kiipu.month_result_get` | Reads this month's income statement from the ledger: revenue, expenses, net income, the accounts that weigh most and last month to compare. If the ledger does not balance right now it gives no figures; with no entries it says so, never zero. |
| `crm.month_summary_get` | Reads how the month is going, piece by piece and with the same figures each read would give: new clients, collected, proposals sent and accepted, deals won, appointments and the ledger result. A piece the person's role does not see, or whose read is off, comes back in `unavailable`. |
| `miira.catalog_search` | Searches the published catalog by words and returns up to 5 active public offerings with name, summary, price, currency and what the price is per; with exactly one match, also its whole description and attributes. Internal, paused and discontinued offerings never come back. |
| `miira.knowledge_search` | Searches the knowledge base the team loaded for the sales agent (manuals, cases, answers to objections) by words, and returns up to 6 fragments with their document and section. Only active documents that finished indexing. It is not the source of a price: that is miira.catalog_search. |
| `kiipu.client_balance_get` | Reads how much ONE client named by name owes in total, as the ledger has it, and their next installment due. A client never invoiced comes back as `never_invoiced`, never as up to date; a lead or a churned client, as `not_a_client`. With several matches it refuses with `ambiguous`; with none, `not_found`. |
| `crm.client_overview_get` | Reads where ONE client named by name stands: their open invoices with balance and since when they are owed, the total owed, and which channels you have talked on with the day of their last message. Never what was said, and no phone or email. |
| `miira.agent_config_get` | Reads how the sales agent is configured today: its persona, the script in order with what each question saves and scores, the funnel stages, the reference responses, the documents asked per client type and the milestones. With `configured: false` the workspace still has the demo setup. Changes nothing. |

> [!IMPORTANT]
> Each one needs **two** permissions: a key with that action's scope, **and** the workspace owner having switched
> the permission on (Settings → Connections, column “API & MCP”). Holding the key is not enough — they are two decisions made by
> different people.

## What it does not do

| Not included | Why |
|---|---|
| **Client-side validation** | The server validates, and its refusal travels with a name. A client that validates differently is the drift all of this avoids. |
| **List or export records** | It exposes verbs and a few declared reads, never tables. There is nothing to paginate. |
| **The OAuth dance** | Reads take an access token a person already granted to an app; the CLI does not run the consent flow itself. AI clients connect through the [MCP server](https://github.com/vorluno/niiko-mcp-server). |

## Support

| | |
|---|---|
| **Versioning** | Semantic. Every visible change is in the [changelog](https://developers.niiko.org/#changelog) of the API reference. |
| **Regeneration** | This repository is generated from the niiko action manifest. When an action opens or a contract changes, a new version is published — nothing here is edited by hand. |
| **Issues** | [vorluno/niiko-cli/issues](https://github.com/vorluno/niiko-cli/issues) — a fault of the API itself starts at [developers.niiko.org](https://developers.niiko.org). |
| **Security** | `security@vorluno.dev` — first response within 48 hours, patch or plan within 7 days. |

## Related

- **[@vorluno/niiko-sdk](https://github.com/vorluno/niiko-sdk-typescript)** — the TypeScript client, same plan.
- **[niiko (Python)](https://github.com/vorluno/niiko-sdk-python)** — the Python client, same plan.
- **[n8n-nodes-niiko](https://github.com/vorluno/n8n-nodes-niiko)** — the same actions as an n8n node.
- **[niiko-mcp-server](https://github.com/vorluno/niiko-mcp-server)** — the same actions as MCP tools, for Claude and other AI clients.
- **[developers.niiko.org](https://developers.niiko.org)** — the API reference this is generated alongside.

<sub>Built and maintained by <a href="https://vorluno.dev">Vorluno</a>, a software studio in Panama, and generated from <a href="https://niiko.org">niiko</a>'s production action manifest — the same one the server enforces. MIT.</sub>
