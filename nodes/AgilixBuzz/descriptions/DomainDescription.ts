import type { INodeProperties } from 'n8n-workflow';

export const domainOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['domain'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a domain', action: 'Create a domain' },
			{ name: 'Delete', value: 'delete', description: 'Delete a domain', action: 'Delete a domain' },
			{ name: 'Get', value: 'get', description: 'Get a domain', action: 'Get a domain' },
			{ name: 'Get Content', value: 'getContent', description: 'Get domain content', action: 'Get domain content' },
			{ name: 'Get Enrollment Metrics', value: 'getEnrollmentMetrics', description: 'Get enrollment metrics', action: 'Get enrollment metrics' },
			{ name: 'Get Parent List', value: 'getParentList', description: 'Get parent domain list', action: 'Get parent list' },
			{ name: 'Get Settings', value: 'getSettings', description: 'Get domain settings', action: 'Get domain settings' },
			{ name: 'Get Stats', value: 'getStats', description: 'Get domain statistics', action: 'Get domain stats' },
			{ name: 'List', value: 'list', description: 'List domains', action: 'List domains' },
			{ name: 'Restore', value: 'restore', description: 'Restore a deleted domain', action: 'Restore a domain' },
			{ name: 'Update', value: 'update', description: 'Update a domain', action: 'Update a domain' },
		],
		default: 'list',
	},
];

export const domainFields: INodeProperties[] = [
	// ── Create ────────────────────────────────────────────────────────────
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domain'], operation: ['create'] } },
	},
	{
		displayName: 'Userspace',
		name: 'userspace',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domain'], operation: ['create'] } },
		description: 'The userspace for the domain',
	},
	{
		displayName: 'Parent ID',
		name: 'parentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domain'], operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['domain'], operation: ['create'] } },
		options: [
			{ displayName: 'Reference', name: 'reference', type: 'string', default: '' },
			{ displayName: 'Flags', name: 'flags', type: 'string', default: '' },
		],
	},

	// ── Delete ────────────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domain'], operation: ['delete'] } },
	},

	// ── Get ───────────────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domain'], operation: ['get'] } },
	},
	{
		displayName: 'Select Fields',
		name: 'select',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['domain'], operation: ['get'] } },
	},

	// ── Get Content ───────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domain'], operation: ['getContent'] } },
	},

	// ── Get Enrollment Metrics ────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domain'], operation: ['getEnrollmentMetrics'] } },
	},
	{
		displayName: 'Skip Empty',
		name: 'skipempty',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['domain'], operation: ['getEnrollmentMetrics'] } },
	},

	// ── Get Parent List ───────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domain'], operation: ['getParentList'] } },
	},

	// ── Get Settings ──────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domain'], operation: ['getSettings'] } },
	},
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domain'], operation: ['getSettings'] } },
		description: 'Settings path to retrieve',
	},
	{
		displayName: 'Include Source',
		name: 'includesource',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['domain'], operation: ['getSettings'] } },
	},

	// ── Get Stats ─────────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domain'], operation: ['getStats'] } },
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domain'], operation: ['getStats'] } },
		description: 'Statistics options',
	},

	// ── List ──────────────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '0',
		displayOptions: { show: { resource: ['domain'], operation: ['list'] } },
		description: 'Parent domain ID (0 for root)',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['domain'], operation: ['list'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		displayOptions: { show: { resource: ['domain'], operation: ['list'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['domain'], operation: ['list'] } },
		options: [
			{ displayName: 'Include Descendant Domains', name: 'includedescendantdomains', type: 'boolean', default: false },
			{ displayName: 'Select Fields', name: 'select', type: 'string', default: '' },
			{ displayName: 'Text Search', name: 'text', type: 'string', default: '' },
			{ displayName: 'Query', name: 'query', type: 'string', default: '' },
		],
	},

	// ── Restore ───────────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domain'], operation: ['restore'] } },
	},

	// ── Update ────────────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domain'], operation: ['update'] } },
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['domain'], operation: ['update'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Userspace', name: 'userspace', type: 'string', default: '' },
			{ displayName: 'Parent ID', name: 'parentid', type: 'string', default: '' },
			{ displayName: 'Reference', name: 'reference', type: 'string', default: '' },
			{ displayName: 'Flags', name: 'flags', type: 'string', default: '' },
		],
	},
];
