import type { INodeProperties } from 'n8n-workflow';

export const generalOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['general'] } },
		options: [
			{ name: 'Get Command List', value: 'getCommandList', description: 'Get all available API commands', action: 'Get command list' },
			{ name: 'Get Entity Type', value: 'getEntityType', description: 'Get entity type for an ID', action: 'Get entity type' },
			{ name: 'Get Status', value: 'getStatus', description: 'Get API status', action: 'Get API status' },
			{ name: 'Send Mail', value: 'sendMail', description: 'Send email to enrollments', action: 'Send mail' },
		],
		default: 'getStatus',
	},
];

export const generalFields: INodeProperties[] = [
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

	// ── Send Mail ─────────────────────────────────────────────────────────
	{
		displayName: 'Sender Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['general'], operation: ['sendMail'] } },
		description: "The sender's enrollment ID (passed as query param)",
	},
	{
		displayName: 'Recipient Enrollment IDs',
		name: 'recipientEnrollmentIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['general'], operation: ['sendMail'] } },
		description: 'Comma-separated list of recipient enrollment IDs',
	},
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
];
