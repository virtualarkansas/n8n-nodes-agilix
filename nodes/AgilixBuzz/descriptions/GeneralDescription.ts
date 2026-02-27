import type { INodeProperties } from 'n8n-workflow';

export const generalOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['general'] } },
		options: [
			{ name: 'Echo', value: 'echo', description: 'Echo test (connectivity check)', action: 'Echo test' },
			{ name: 'Get Command List', value: 'getCommandList', description: 'Get all available API commands', action: 'Get command list' },
			{ name: 'Get Entity Type', value: 'getEntityType', description: 'Get entity type for an ID', action: 'Get entity type' },
			{ name: 'Get Status', value: 'getStatus', description: 'Get API status', action: 'Get API status' },
			{ name: 'Get Upload Limits', value: 'getUploadLimits', description: 'Get upload limits', action: 'Get upload limits' },
			{ name: 'Send Mail', value: 'sendMail', description: 'Send email to enrollment', action: 'Send mail' },
		],
		default: 'getStatus',
	},
];

export const generalFields: INodeProperties[] = [
	// ── Echo ──────────────────────────────────────────────────────────────
	{
		displayName: 'Data',
		name: 'data',
		type: 'json',
		default: '{}',
		displayOptions: { show: { resource: ['general'], operation: ['echo'] } },
		description: 'JSON data to echo back',
	},

	// ── Get Entity Type ───────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['general'], operation: ['getEntityType'] } },
	},

	// ── Get Status ────────────────────────────────────────────────────────
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['general'], operation: ['getStatus'] } },
		options: [
			{ displayName: 'Rating', name: 'rating', type: 'string', default: '' },
		],
	},

	// ── Get Upload Limits ─────────────────────────────────────────────────
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['general'], operation: ['getUploadLimits'] } },
		options: [
			{ displayName: 'User ID', name: 'userid', type: 'string', default: '' },
			{ displayName: 'Domain ID', name: 'domainid', type: 'string', default: '' },
		],
	},

	// ── Send Mail ─────────────────────────────────────────────────────────
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['general'], operation: ['sendMail'] } },
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		typeOptions: { rows: 5 },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['general'], operation: ['sendMail'] } },
	},
	{
		displayName: 'Enrollment IDs',
		name: 'enrollment_ids',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['general'], operation: ['sendMail'] } },
		description: 'Comma-separated enrollment IDs',
	},
];
