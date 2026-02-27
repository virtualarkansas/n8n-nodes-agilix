# n8n-nodes-agilix

Custom n8n community nodes for the [Agilix Buzz LMS API](https://api.agilixbuzz.com/docs/).

## Features

- Full coverage of 10 API resource categories with 80+ operations
- Automatic session token management with 15-minute refresh
- Intelligent rate-limit handling with exponential backoff and retry
- Built-in pagination support for list operations
- Bulk operation support for batch create/update/delete

## Resources

| Resource        | Operations |
|-----------------|------------|
| Authentication  | Extend Session, Force Password Change, Get Password Policy, Proxy/Unproxy, Reset Password, Update Password, and more |
| Course          | Create, Copy, Delete, Deactivate, Get, List, Merge, Restore, Update, Get History, Create Demo |
| Domain          | Create, Delete, Get, List, Restore, Update, Get Content, Get Settings, Get Stats, Get Enrollment Metrics, Get Parent List |
| Enrollment      | Create, Delete, Get, List, Update, Restore, Get Activity, Get Gradebook, Get Group List, Get Metrics Report, List by Teacher, List by Entity, List by User, Put Self Assessment |
| General         | Echo, Get Command List, Get Entity Type, Get Status, Get Upload Limits, Send Mail |
| Library         | Create Page, Get Page, List Pages |
| Report          | Get Info, Get Report List, Get Runnable Report List, Run Report |
| Resource        | Copy, Delete, Get, List, Get Info, Get Entity Resource ID, List Restorable, Put Folders, Restore |
| Right           | Create/Delete/Get/Update Role, List Roles, Get/Update Rights, Get Actor/Entity/Effective Rights, Manage Subscriptions, Get Personas |
| User            | Create, Delete, Get, List, Update, Restore, Get Active Count, Get Activity, Get Activity Stream, Get Domain Activity, Get Profile Picture |

## Credentials

Configure your Agilix Buzz API credentials with:

- **Base URL** - Your Buzz instance URL (default: `https://api.agilixbuzz.com`)
- **Domain** - Your Agilix Buzz domain
- **Username** - API username
- **Password** - API password

The node handles login token refresh automatically. Tokens are valid for 15 minutes and are refreshed transparently before expiration.

## Installation

Install via the n8n community nodes UI or by running:

```bash
npm install n8n-nodes-agilix
```

## Development

```bash
npm install
npm run build
npm run dev     # starts n8n with hot reload
npm run lint
```

## License

[MIT](LICENSE)
