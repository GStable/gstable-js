# GStable SDK for Node.js

Official-style TypeScript / JavaScript client for the **GStable Payment API**. Use it to manage products, payment links, checkout sessions, webhooks, accounts, and public payment-capability data from Node.js **≥ 18**.

**Highlights**

- **Zero runtime dependencies** — uses the built-in `fetch` (Node 18+).
- **Dual publishing** — ESM and CommonJS builds plus `.d.ts` from one `tsup` pipeline.
- **Uniform API shape** — methods resolve to the JSON envelope `data` field; non-zero business `code` throws typed errors.

**Documentation:** [API introduction](https://docs.gstable.io/docs/api/overview/introduction) · [简体中文](https://docs.gstable.io/zh-Hans/docs/api/overview/introduction)

---

## Requirements

| Requirement | Version |
|-------------|---------|
| Node.js     | **≥ 18** (global `fetch`) |

---

## Installation

```bash
npm install gstable-js
```

To depend on a local checkout instead of the registry:

```bash
npm install file:../GStable-SDK
```

*(Replace the package name if you publish under a different npm scope or unscoped name.)*

---

## Quick start

Create a client with your **API key**. The key may be the raw secret or already prefixed with `Bearer ` — the SDK normalizes it.

```ts
import { GStableClient, GStableError, DEFAULT_BASE_URL } from 'gstable-js'

const client = new GStableClient({
  apiKey: process.env.GSTABLE_API_KEY!,
  // Optional overrides:
  // baseUrl: DEFAULT_BASE_URL,
  // publicBaseUrl: 'https://api.gstable.io/public/api/v1',
})

try {
  const product = await client.product.create({
    name: 'Pro plan',
    commonPrices: [1_000_000, 5_000_000], // micro-USD; 1_000_000 === USD 1.00
    description: 'Optional description',
  })
  console.log(product.productId)
} catch (err) {
  if (err instanceof GStableError) {
    console.error(err.code, err.message) // branch on err.code, not message text
  }
  throw err
}
```

**CommonJS**

```js
const { GStableClient } = require('gstable-js')

const client = new GStableClient({ apiKey: process.env.GSTABLE_API_KEY })
client.product.list(1, 10).then(console.log)
```

---

## Configuration

| Option | Default | Purpose |
|--------|---------|---------|
| `apiKey` | *(required)* | Sent as `Authorization: Bearer <key>` on private routes. |
| `baseUrl` | `https://api.gstable.io/api/v1` (see `DEFAULT_BASE_URL`) | Private API origin; trailing slashes are trimmed. |
| `publicBaseUrl` | `https://api.gstable.io/public/api/v1` (`DEFAULT_PUBLIC_BASE_URL`) | Public routes (e.g. capabilities); no `Authorization` header. |
| `fetchImpl` | `globalThis.fetch` | Inject for tests or custom environments. |

If public docs show a different host or path, **trust your integration**: override `baseUrl` / `publicBaseUrl` to match the environment you target.

---

## API surface (`GStableClient`)

| Property | Resource | Typical use |
|----------|-----------|-------------|
| `product` | Products | Create, update, list, archive, remove catalog items. |
| `account` | Accounts | Read-only list / detail for settlement accounts. |
| `paymentLink` | Payment links | Create and manage reusable payment URLs. |
| `checkoutSession` | Checkout sessions | One-off hosted checkout flows. |
| `webhook` | Webhooks | CRUD and lifecycle for event endpoints. |
| `capability` | Public capabilities | Supported tokens and payment routing matrix (no API key required by the server; client still needs `apiKey` today to construct `GStableClient`). |

Endpoint paths and HTTP verbs follow the [API documentation](https://docs.gstable.io/docs/api/overview/introduction).

---

## Responses and errors

- Successful calls return the **`data`** payload from the standard envelope `{ code, message, data }`.
- When `code !== 0` or HTTP indicates failure, the SDK throws **`GStableError`** with numeric **`code`** and **`message`**. Prefer **`code`** for branching; **do not** parse `message` for business logic (wording may change).
- Subclasses such as **`GStableProductError`**, **`GStableCommonError`**, and **`GStablePlatformError`** are used for documented code ranges — import them from the package when you need `instanceof` checks.

---

## Local development

```bash
git clone <repo-url>
cd GStable-SDK
npm install
npm run build      # output: dist/*.js, *.cjs, *.d.ts
npm run typecheck  # tsc --noEmit
npm run dev        # tsup watch
```

`prepublishOnly` runs `npm run build` before publish. Published tarball includes **`dist/`** and **`README.md`** only (`package.json` `files` field).

---

## Runnable examples

From the repo root after `npm run build`:

```bash
export GSTABLE_API_KEY="sk_live_..."
node examples/product/product-list.mjs
```

| Folder | Topic |
|--------|--------|
| `examples/product/` | Product CRUD and listing |
| `examples/payment-link/` | Payment links |
| `examples/checkout-session/` | Checkout sessions |
| `examples/webhook/` | Webhook management |
| `examples/account-list-detail.mjs` | Accounts |

Set `GSTABLE_DEBUG=1` to log outbound URLs and headers (contains secrets — use only in safe environments).

---

## cURL reference

Same list call without the SDK:

```bash
curl -sS 'https://api.gstable.io/api/v1/product/list/1/10' \
  -H "Authorization: Bearer sk_live_..." \
  -H "Accept: application/json" \
  -H "Content-Type: application/json"
```

---

## License

MIT — see `package.json`.
