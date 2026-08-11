# n8n-nodes-signalbase

An [n8n](https://n8n.io) community node for [Signalbase](https://www.trysignalbase.com) — real-time B2B buying signals.

Use it to trigger workflows off the moment a company raises, gets acquired, starts hiring, or changes leadership: enrich the record, route it to your CRM, notify a rep.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Credit costs](#credit-costs) · [Resources](#resources)

## Installation

Follow the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) and install `n8n-nodes-signalbase`.

## Credentials

You need a Signalbase account and an API key.

1. Log in to [Signalbase](https://www.trysignalbase.com/login).
2. Go to your workspace's [API settings](https://www.trysignalbase.com/workspace/api).
3. Click **Create API key**, name it, and confirm.
4. Copy the key and paste it into the **Signalbase API** credential in n8n.

The key is shown only once at creation. If you lose it, generate a new one.

Signalbase authenticates with a bearer token (`Authorization: Bearer <key>`). n8n handles this for you.

> Testing the credential calls hiring signals in count mode, which costs **0 credits** — connecting an account never spends your balance.

## Operations

| Resource | Operations | Endpoint |
| --- | --- | --- |
| Funding Signal | Search | `/signals/funding` |
| Hiring Signal | Search, Count | `/signals/hiring` |
| Job Change Signal | Search | `/signals/job-changes` |
| Acquisition Signal | Search | `/signals/acquisitions` |
| Investor | Search | `/signals/investors` |
| Company | Search, Count | `/companies` |

Every resource supports **Return All** (auto-paginates via `pagination.hasNextPage`) or a **Limit**, plus a **Filters** collection covering the parameters that endpoint accepts.

The node is marked `usableAsTool`, so it can be attached directly to an AI Agent node.

## Credit costs

Most requests cost **1 credit**. The exception is **Count** on Hiring Signal and Company, which returns just the total for a filter set and costs **0 credits**.

A useful pattern: run **Count** first to size a query, then decide whether to spend credits pulling the rows.

## Notes and gotchas

- `Limit` caps at **100** per page.
- **Date Preset** takes precedence over **Date From** / **Date To** when both are set.
- **Categories** and **Subcategories** are different classification systems. Categories takes pipe-separated LinkedIn industry labels (`Software Development|Financial Services`); Subcategories takes comma-separated Signalbase IDs (`ai,fintech,saas`).
- **Countries** takes ISO 3166-1 alpha-2 codes (`US,GB,DE`) and also accepts the region shortcuts `CEE`, `WE`, `NORDICS`, `NA`, `LATAM`.
- For strict company matching prefer **Company Domain** or **Company LinkedIn URL**; **Company Name** is a fuzzy partial match.
- Amounts are in whole units of the deal currency, not cents. **Currency** is an exact-match filter, not a converter.

## Resources

- [Signalbase API documentation](https://docs.trysignalbase.com)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## License

[MIT](LICENSE.md)
