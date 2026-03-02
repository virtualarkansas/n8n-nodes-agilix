# Sprint 4: Add Item Resource

## Goal
Add a new Item resource with 9 operations covering course item management.

## Files Modified
- `nodes/AgilixBuzz/descriptions/ItemDescription.ts` — **NEW**
- `nodes/AgilixBuzz/descriptions/index.ts` — Add Item exports
- `nodes/AgilixBuzz/AgilixBuzz.node.ts` — Add `item` resource option + execute logic

## Operations

### 1. list (GET)
- **API:** `getitemlist`
- **Required:** `entityid`
- **Optional:** `itemid`, `query` (data filter), `allversions` (bool)
- **Response:** `response.items.item` (array)

### 2. get (GET)
- **API:** `getitem`
- **Required:** `entityid`, `itemid`
- **Optional:** `version`, `embedmaster` (bool)
- **Response:** `response.item` (single object)

### 3. getInfo (POST bulk)
- **API:** `getiteminfo`
- **Uses:** `agilixApiBulkRequest(this, 'POST', 'getiteminfo', 'item', [{ entityid, itemid }])`
- **Required:** `entityid`, `itemid`
- **Response:** `response.responses.response` (array)

### 4. create (POST bulk)
- **API:** `putitems`
- **Uses:** `agilixApiBulkRequest(this, 'POST', 'putitems', 'item', [{ entityid, itemid, data }])`
- **Required:** `entityid`, `itemid`
- **Optional:** `data` (JSON string — free-form item data)
- **Response:** `response.responses.response` (array)

### 5. delete (POST bulk)
- **API:** `deleteitems`
- **Uses:** `agilixApiBulkRequest(this, 'POST', 'deleteitems', 'item', [{ entityid, itemid }], { cascade })`
- **Required:** `entityid`, `itemid`
- **Optional:** `cascade` (bool, query param — not in body)
- **Response:** `response.responses.response` (array)

### 6. restore (POST bulk)
- **API:** `restoreitems`
- **Uses:** `agilixApiBulkRequest(this, 'POST', 'restoreitems', 'item', [{ entityid, itemid, version }])`
- **Required:** `entityid`, `itemid`
- **Optional:** `version`
- **Response:** `response.responses.response` (array)

### 7. copy (POST bulk)
- **API:** `copyitems`
- **Uses:** `agilixApiBulkRequest(this, 'POST', 'copyitems', 'item', [{ sourceentityid, sourceitemid, destinationentityid, destinationitemid, deep }])`
- **Required:** `sourceentityid`, `sourceitemid`, `destinationentityid`, `destinationitemid`
- **Optional:** `deep` (bool)
- **Response:** `response.responses.response` (array)

### 8. assign (POST)
- **API:** `assignitem`
- **Uses:** `agilixApiRequest(this, 'POST', 'assignitem', {}, { entityid, itemid, folderid, sequence })`
- **Required:** `entityid`, `itemid`, `folderid`
- **Optional:** `sequence`
- **Response:** `response` (code only)

### 9. unassign (POST)
- **API:** `unassignitem`
- **Uses:** `agilixApiRequest(this, 'POST', 'unassignitem', {}, { entityid, itemid })`
- **Required:** `entityid`, `itemid`
- **Response:** `response` (code only)

## Notes
- `putitems` creates OR updates items — same command for both
- `data` field is free-form JSON (Item Data Schema) — expose as a JSON string field
- `cascade` on delete is a query param, NOT in the POST body
- Item IDs may only contain alphanumeric, underscore, period, and dash
- "DEFAULT" is reserved for the root item

## Verification
- All 9 operations appear in node UI when Item resource is selected
- `npm run build` compiles clean
