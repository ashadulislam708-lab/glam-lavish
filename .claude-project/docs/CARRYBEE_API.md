# CarryBee Courier API Reference

**Source:** [CarryBee Developers' API v2.0](https://hackmd.io/_wLl0AtKRHGKBIIsF_xssg?view)
**Last Updated:** 2026-04-17

---

## Base URLs

| Environment | URL |
|-------------|-----|
| Production | `https://developers.carrybee.com/` |
| Sandbox | `https://sandbox.carrybee.com/` |

---

## Authentication

All requests require these three headers:

| Header | Type | Description |
|--------|------|-------------|
| `Client-ID` | string | Provided by CarryBee |
| `Client-Secret` | string | Provided by CarryBee |
| `Client-Context` | string | Provided by CarryBee |

**Sandbox Credentials (for testing only):**

| Credential | Value |
|------------|-------|
| Client ID | `1a89c1a6-fc68-4395-9c09-628e0d3eaafc` |
| Client Secret | `1d7152c9-5b2d-4e4e-9c20-652b93333704` |
| Client Context | `DzJwPsx31WaTbS745XZoBjmQLcNqwK` |

---

## Response Envelope

**All responses** use this wrapper format:

```json
{
  "error": false,
  "message": "Human-readable message",
  "data": { /* payload varies by endpoint */ }
}
```

Error responses omit `data`:
```json
{
  "error": true,
  "message": "Descriptive error message"
}
```

---

## Endpoints

### 1. Get Cities

| | |
|---|---|
| **Method** | GET |
| **Path** | `/api/v2/cities` |
| **Used by Glam Lavish** | Yes — populate city dropdown on order form |

**Response (200):**

```json
{
  "error": false,
  "message": "City list fetched successfully",
  "data": {
    "cities": [
      { "id": 1, "name": "Bagerhat" },
      { "id": 14, "name": "Dhaka" }
    ]
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `data.cities[].id` | integer | City identifier |
| `data.cities[].name` | string | City name |

---

### 2. Get Zones

| | |
|---|---|
| **Method** | GET |
| **Path** | `/api/v2/cities/{city_id}/zones` |
| **Used by Glam Lavish** | Yes — populate zone dropdown based on selected city |

**Response (200):**

```json
{
  "error": false,
  "message": "Zones",
  "data": {
    "zones": [
      { "id": 290, "name": "Zoo Road", "city_id": 14 }
    ]
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `data.zones[].id` | integer | Zone identifier |
| `data.zones[].name` | string | Zone name |
| `data.zones[].city_id` | integer | Parent city ID |

---

### 3. Get Areas

| | |
|---|---|
| **Method** | GET |
| **Path** | `/api/v2/cities/{city_id}/zones/{zone_id}/areas` |
| **Used by Glam Lavish** | Yes — populate area dropdown based on selected zone |

**Response (200):**

```json
{
  "error": false,
  "message": "Area list fetched successfully",
  "data": {
    "areas": [
      { "id": 8803, "name": "Zirani Kata", "zone_id": 356 }
    ]
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `data.areas[].id` | integer | Area identifier |
| `data.areas[].name` | string | Area name |
| `data.areas[].zone_id` | integer | Parent zone ID |

---

### 4. Area Suggestion

| | |
|---|---|
| **Method** | GET |
| **Path** | `/api/v2/area-suggestion` |
| **Used by Glam Lavish** | Optional — address autocomplete |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | Yes | Minimum 3 characters — searches area/zone/city names |

**Response (200):**

```json
{
  "error": false,
  "message": "Suggested area",
  "data": {
    "items": [
      {
        "city_id": 14,
        "city_name": "Dhaka",
        "zone_id": 151,
        "zone_name": "Uttara sector 6",
        "area_id": 5100,
        "area_name": "Alal Avenue"
      }
    ]
  }
}
```

---

### 5. Address Details

| | |
|---|---|
| **Method** | POST |
| **Path** | `/api/v2/address-details` |
| **Used by Glam Lavish** | Optional — resolve city/zone from free-text address |

**Request Body:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Minimum 10 characters |

```json
{ "query": "Baridhara Jame Masjid, baridhara, Dhaka" }
```

**Response (200):**

```json
{
  "error": false,
  "message": "Address details",
  "data": {
    "city_id": 14,
    "zone_id": 161
  }
}
```

**Validation Error (422):**

```json
{
  "error": true,
  "message": "Validation error",
  "causes": {
    "query": [
      { "type": "min", "attribute": { "value": 10 } }
    ]
  }
}
```

---

### 6. Create Store

| | |
|---|---|
| **Method** | POST |
| **Path** | `/api/v2/stores` |
| **Used by Glam Lavish** | One-time setup — register pickup/return store |

**Request Body:**

| Parameter | Type | Required | Constraints | Description |
|-----------|------|----------|-------------|-------------|
| `name` | string | Yes | 3–30 chars | Store name |
| `contact_person_name` | string | Yes | 3–30 chars | Contact person |
| `contact_person_number` | string | Yes | valid phone | Primary phone |
| `contact_person_secondary_number` | string | No | valid phone | Secondary phone |
| `address` | string | Yes | 3–100 chars | Store address |
| `city_id` | integer | Yes | | From `/cities` |
| `zone_id` | integer | Yes | | From `/zones` |
| `area_id` | integer | No | | From `/areas` |
| `lat` | float | No | valid coordinate | Latitude |
| `lng` | float | No | valid coordinate | Longitude |

```json
{
  "name": "store_name",
  "contact_person_name": "name",
  "contact_person_number": "phone_number",
  "contact_person_secondary_number": null,
  "address": "store_address",
  "city_id": 14,
  "zone_id": 5,
  "area_id": 282
}
```

**Response (201 Created):**

```json
{
  "error": false,
  "message": "Store created successfully"
}
```

**Validation Error (422):**

```json
{
  "error": true,
  "message": "Validation error",
  "causes": {
    "city_id": [{ "type": "exists" }],
    "name": [{ "type": "required" }]
  }
}
```

---

### 7. List Stores

| | |
|---|---|
| **Method** | GET |
| **Path** | `/api/v2/stores` |
| **Used by Glam Lavish** | Yes — retrieve `store_id` (string UUID) for order creation |

**Response (200):**

```json
{
  "error": false,
  "message": "Store list",
  "data": {
    "stores": [
      {
        "id": "abcd-1234",
        "name": "Store Name",
        "contact_person_name": "Anik",
        "contact_person_number": "8801652241276",
        "contact_person_secondary_number": "8801652241274",
        "address": "address text",
        "city_id": 14,
        "zone_id": 5,
        "area_id": 282,
        "is_active": false,
        "is_approved": false,
        "is_default_pickup_store": false,
        "is_default_return_store": false
      }
    ],
    "pending_count": 1
  }
}
```

> **Note:** `id` is a **string** (UUID format), not an integer. `pending_count` is at `data` level, not per-store.

---

### 8. Create Single Order

| | |
|---|---|
| **Method** | POST |
| **Path** | `/api/v2/orders` |
| **Used by Glam Lavish** | Yes — auto-push on order creation |

**Request Body:**

| Parameter | Type | Required | Constraints | Description |
|-----------|------|----------|-------------|-------------|
| `store_id` | string | Yes | | UUID from List Stores |
| `merchant_order_id` | string | No | max 50 chars | Maps to `Order.invoiceId` (e.g. `GL-0001`) |
| `delivery_type` | integer | Yes | 1=Normal, 2=Express | Delivery speed |
| `product_type` | integer | Yes | 1=Parcel, 2=Book, 3=Document | Item category |
| `recipient_name` | string | Yes | 2–99 chars | Customer name |
| `recipient_phone` | string | Yes | valid phone | Primary phone |
| `recipient_secendary_phone` | string | No | valid phone | Secondary phone (**note:** API has this typo) |
| `recipient_address` | string | Yes | 10–200 chars | Delivery address |
| `city_id` | integer | Yes | | Destination city |
| `zone_id` | integer | Yes | | Destination zone |
| `area_id` | integer | No | | Destination area |
| `special_instruction` | string | No | max 256 chars | Delivery notes |
| `product_description` | string | No | max 256 chars | Item description |
| `item_weight` | integer | Yes | 1–25000 grams | Package weight in grams |
| `item_quantity` | integer | No | 1–200 | Number of items |
| `collectable_amount` | integer | No | 0–100000 BDT | COD amount to collect |
| `is_closed` | boolean | No | default: false | Lock order from edits |

```json
{
  "store_id": "a1b2c3d4",
  "merchant_order_id": "GL-0001",
  "delivery_type": 1,
  "product_type": 1,
  "recipient_phone": "01652241276",
  "recipient_secendary_phone": null,
  "recipient_name": "recipient name",
  "recipient_address": "recipient address, Dhaka",
  "city_id": 14,
  "zone_id": 5,
  "area_id": 282,
  "special_instruction": null,
  "product_description": null,
  "item_weight": 500,
  "item_quantity": 2,
  "collectable_amount": 1200,
  "is_closed": false
}
```

**Response (201 Created):**

```json
{
  "error": false,
  "message": "Order Created Successfully",
  "data": {
    "order": {
      "consignment_id": "FX1212124433",
      "store_id": "a1b2c3d4",
      "merchant_order_id": "GL-0001",
      "collectable_amount": "1200",
      "cod_fee": 15,
      "delivery_fee": "60"
    }
  }
}
```

> **Note:** `collectable_amount` and `delivery_fee` are returned as **strings**. `cod_fee` is a number (float).

**Mapping to Glam Lavish Order fields:**
- `data.order.consignment_id` → `Order.courierConsignmentId`
- `merchant_order_id` → `Order.invoiceId` (GL-XXXX)

**Validation Error (422):**

```json
{
  "error": true,
  "message": "Validation error",
  "causes": {
    "city_id": [{ "type": "exists" }],
    "recipient_phone": [{ "type": "required" }],
    "product_type": [{ "type": "in", "attribute": { "values": [1, 2, 3] } }]
  }
}
```

---

### 9. Create Bulk Orders

| | |
|---|---|
| **Method** | POST |
| **Path** | `/api/v2/orders-bulk` |
| **Used by Glam Lavish** | No (future consideration) |

**Request Body:**

```json
{
  "orders": [
    { /* single order object */ },
    { /* single order object */ }
  ]
}
```

Each order uses the same fields and constraints as Create Single Order.

**Response (202 Accepted):**

```json
{
  "error": false,
  "message": "Order list accepted to be processed"
}
```

Webhooks are sent individually for each order as they are processed. Validation errors reference fields with index prefix (e.g. `"0.city_id"`, `"1.recipient_phone"`).

---

### 10. Cancel Order

| | |
|---|---|
| **Method** | POST |
| **Path** | `/api/v2/orders/{consignment_id}/cancel` |
| **Used by Glam Lavish** | Yes — on order cancellation flow |

**Request Body:**

| Parameter | Type | Required | Constraints | Description |
|-----------|------|----------|-------------|-------------|
| `cancellation_reason` | string | Yes | max 200 chars | Reason for cancellation |

```json
{ "cancellation_reason": "Customer requested cancellation" }
```

**Response (202 Accepted):**

```json
{
  "error": false,
  "message": "Order cancelled successfully"
}
```

> **Note:** Cancellation is asynchronous — use webhook event `order.pickup-cancelled` to confirm completion.

---

### 11. Get Order Details

| | |
|---|---|
| **Method** | GET |
| **Path** | `/api/v2/orders/{consignment_id}/details` |
| **Used by Glam Lavish** | Yes — status tracking and retry courier feature |

> **Note:** Can use consignment ID or merchant tracking ID (min 3 chars, URL-friendly).

**Response (200):**

```json
{
  "error": false,
  "message": "Order details",
  "data": {
    "transfer_status": "In transit",
    "store_id": "a1b2c3",
    "consignment_id": "FX1212124433",
    "merchant_order_id": "GL-0001",
    "recipient_name": "recipient name",
    "recipient_phone": "8801652241276",
    "recipient_secondary_phone": "8801652241276",
    "recipient_address": "recipient address",
    "collectable_amount": "1000",
    "collected_amount": "0",
    "cod_fee": 0,
    "delivery_fee": "105",
    "attempt": 0,
    "updated_at": "2025-07-30T10:11:12+00:00",
    "reason": null,
    "invoice_id": null,
    "payment_status": null
  }
}
```

> **Note:** `transfer_status` is a **human-readable string** (e.g. `"In transit"`, `"Delivered"`), not a snake_case code. `collectable_amount`, `collected_amount`, and `delivery_fee` are strings. `cod_fee` is a number.

**`transfer_status` → Glam Lavish status mapping (approximate):**

| `transfer_status` | Glam Lavish Order Status |
|-------------------|--------------------------|
| `"Pending"` | PENDING / PROCESSING |
| `"Picked"` | PROCESSING |
| `"In transit"` | PROCESSING |
| `"Delivered"` | DELIVERED |
| `"Delivery failed"` | PROCESSING (retry) |
| `"Returned"` | RETURNED |
| `"Cancelled"` | CANCELLED |

**Error (404):**

```json
{
  "error": true,
  "message": "order not found"
}
```

---

## Webhook Events

All webhooks are delivered to the URL configured in your CarryBee merchant account.

**Webhook Verification Header:**

| Header | Description |
|--------|-------------|
| `X-Carrybee-Webhook-Signature` | HMAC signature for payload verification |

---

### Order Events

**order.created** and **order.updated** — include fee breakdown:

```json
{
  "event": "order.created",
  "store_id": "a1b2c3d4",
  "consignment_id": "FX1212124433",
  "merchant_order_id": "GL-0001",
  "timestamptz": "2025-07-30T10:11:12+00:00",
  "collectable_amount": "1592",
  "cod_fee": 15.92,
  "delivery_fee": "85"
}
```

---

### Pickup Events

Events: `order.pickup-requested`, `order.assigned-for-pickup`, `order.picked`, `order.pickup-failed`, `order.pickup-cancelled`

All contain only the base fields:

```json
{
  "event": "order.picked",
  "store_id": "a1b2c3d4",
  "consignment_id": "FX1212124433",
  "merchant_order_id": "GL-0001",
  "timestamptz": "2025-07-30T10:11:12+00:00"
}
```

---

### Hub / Transit Events

Events: `order.at-the-sorting-hub`, `order.on-the-way-to-central-warehouse`, `order.at-central-warehouse`, `order.in-transit`, `order.received-at-last-mile-hub`

All contain only the base fields (same shape as pickup events above).

---

### Delivery Events

**order.assigned-for-delivery** — includes `attempt`:

```json
{
  "event": "order.assigned-for-delivery",
  "store_id": "a1b2c3d4",
  "consignment_id": "FX1212124433",
  "merchant_order_id": "GL-0001",
  "timestamptz": "2025-07-30T10:11:12+00:00",
  "attempt": 1
}
```

**order.delivery-on-hold** — includes `attempt` and optional `reason`:

```json
{
  "event": "order.delivery-on-hold",
  "store_id": "a1b2c3d4",
  "consignment_id": "FX1212124433",
  "merchant_order_id": "GL-0001",
  "timestamptz": "2025-07-30T10:11:12+00:00",
  "attempt": 1,
  "reason": "optional reason text"
}
```

**order.delivered** — includes `collected_amount` and `attempt`:

```json
{
  "event": "order.delivered",
  "store_id": "a1b2c3d4",
  "consignment_id": "FX1212124433",
  "merchant_order_id": "GL-0001",
  "timestamptz": "2025-07-30T10:11:12+00:00",
  "collected_amount": "60",
  "attempt": 1
}
```

**order.partial-delivery** — includes `collected_amount`, optional `reason`, `attempt`:

```json
{
  "event": "order.partial-delivery",
  "store_id": "a1b2c3d4",
  "consignment_id": "FX1212124433",
  "merchant_order_id": "GL-0001",
  "timestamptz": "2025-07-30T10:11:12+00:00",
  "collected_amount": "60",
  "reason": "optional reason text",
  "attempt": 1
}
```

**order.delivery-failed** — includes optional `reason` and `attempt`:

```json
{
  "event": "order.delivery-failed",
  "store_id": "a1b2c3d4",
  "consignment_id": "FX1212124433",
  "merchant_order_id": "GL-0001",
  "timestamptz": "2025-07-30T10:11:12+00:00",
  "reason": "optional reason text",
  "attempt": 1
}
```

---

### Return Events

**order.returned** — includes optional `reason`:

```json
{
  "event": "order.returned",
  "store_id": "a1b2c3d4",
  "consignment_id": "FX1212124433",
  "merchant_order_id": "GL-0001",
  "timestamptz": "2025-07-30T10:11:12+00:00",
  "reason": "optional reason text"
}
```

**order.paid-return** — includes `collected_amount`, optional `reason`, `attempt`:

```json
{
  "event": "order.paid-return",
  "store_id": "a1b2c3d4",
  "consignment_id": "FX1212124433",
  "merchant_order_id": "GL-0001",
  "timestamptz": "2025-07-30T10:11:12+00:00",
  "collected_amount": "60",
  "reason": "optional reason text",
  "attempt": 1
}
```

**order.exchange** — includes `collected_amount` and optional `reason`:

```json
{
  "event": "order.exchange",
  "store_id": "a1b2c3d4",
  "consignment_id": "EX1212124433",
  "merchant_order_id": "GL-0001",
  "timestamptz": "2025-07-30T10:11:12+00:00",
  "collected_amount": "60",
  "reason": "optional reason text"
}
```

**order.returned-at-sorting**, **order.returned-in-transit**, **order.returned-to-merchant** — base fields only (same shape as pickup events).

---

### Payment Event

**order.paid** — includes `invoice_id`:

```json
{
  "event": "order.paid",
  "store_id": "a1b2c3d4",
  "consignment_id": "FX1212124433",
  "merchant_order_id": "GL-0001",
  "timestamptz": "2025-07-30T10:11:12+00:00",
  "invoice_id": "IX212124433"
}
```

---

## Error Responses

**Validation Error (422):**

```json
{
  "error": true,
  "message": "Validation error",
  "causes": {
    "recipient_phone": [{ "type": "required" }],
    "query": [{ "type": "min", "attribute": { "value": 10 } }],
    "product_type": [{ "type": "in", "attribute": { "values": [1, 2, 3] } }]
  }
}
```

Each cause entry is an array of objects with a `type` field and optional `attribute`.

**General Errors (4xx / 5xx):**

```json
{
  "error": true,
  "message": "Descriptive error message"
}
```

---

## Data Types Reference

| Type | Examples | Notes |
|------|---------|-------|
| City/Zone/Area IDs | `14`, `290`, `8803` | integer |
| Store ID, Consignment ID, Merchant Order ID | `"abcd-1234"`, `"FX1212124433"`, `"GL-0001"` | string |
| Names, Addresses | `"Dhaka"`, `"123 Main St"` | string with length constraints |
| Phone numbers | `"01652241276"` | string, valid format |
| Weights | `500` | integer (grams) |
| Quantities | `2` | integer |
| COD amounts returned | `"1000"`, `"0"` | **string** wrapping integer (Taka) |
| Fee fields returned | `15.92`, `"85"` | mixed — `cod_fee` is float, `delivery_fee` is string |
| Booleans | `is_active`, `is_approved`, `is_default_pickup_store`, `is_default_return_store` | boolean |
| Timestamps | `"2025-07-30T10:11:12+00:00"` | ISO 8601 |
| Attempt count | `1` | integer |

---

## Constraints & Limits

| Constraint | Value |
|------------|-------|
| Store name length | 3–30 characters |
| Contact person name length | 3–30 characters |
| Store address length | 3–100 characters |
| Recipient name length | 2–99 characters |
| Recipient address length | 10–200 characters |
| Special instruction / description | max 256 characters each |
| Merchant order ID length | max 50 characters |
| Cancellation reason length | max 200 characters |
| Item weight | 1–25,000 grams |
| Item quantity | 1–200 |
| Collectable amount | 0–100,000 BDT |
| Area suggestion search min | 3 characters |
| Address details query min | 10 characters |
| Bulk order response | Async via webhooks (202 Accepted) |

---

## Glam Lavish Integration Notes

| CarryBee Field | Glam Lavish Field | Notes |
|----------------|-------------------|-------|
| `data.order.consignment_id` | `Order.courierConsignmentId` | Store on order creation |
| `merchant_order_id` | `Order.invoiceId` | Send GL-XXXX format |
| `collectable_amount` | `Order.grandTotal` | Full COD — no partial payments |
| `delivery_type` | — | Use `1` (Normal) by default |
| `product_type` | — | Use `1` (Parcel) by default |
| `store_id` | — | String UUID — fetch once from List Stores, store in env config |
| `city_id` / `zone_id` / `area_id` | `Order.district` / `Order.upazila` | Map Bangladesh locations to CarryBee geo IDs |
| `transfer_status` | `Order.status` | Human-readable string — see status mapping table above |

> **Note:** Glam Lavish does not auto-poll delivery statuses. Staff manually updates order status from the order detail page. The `GET /api/v2/orders/{consignment_id}/details` endpoint is used for the "Retry Courier" feature or future status sync.

> **API Typo:** The secondary phone field in the Create Order request body is `recipient_secendary_phone` (misspelled in the official API). Use this exact spelling when sending requests.
