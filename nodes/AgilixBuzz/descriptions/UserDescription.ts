import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['user'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a user', action: 'Create a user' },
			{ name: 'Delete', value: 'delete', description: 'Delete a user', action: 'Delete a user' },
			{ name: 'Get', value: 'get', description: 'Get a user', action: 'Get a user' },
			{ name: 'Get Active Count', value: 'getActiveCount', description: 'Get active user count', action: 'Get active user count' },
			{ name: 'Get Activity', value: 'getActivity', description: 'Get user activity', action: 'Get user activity' },
			{ name: 'Get Activity Stream', value: 'getActivityStream', description: 'Get user activity stream', action: 'Get user activity stream' },
			{ name: 'Get Domain Activity', value: 'getDomainActivity', description: 'Get domain activity', action: 'Get domain activity' },
			{ name: 'Get Profile Picture', value: 'getProfilePicture', description: 'Get profile picture', action: 'Get profile picture' },
			{ name: 'List', value: 'list', description: 'List users in a domain', action: 'List users' },
			{ name: 'Restore', value: 'restore', description: 'Restore a deleted user', action: 'Restore a user' },
			{ name: 'Update', value: 'update', description: 'Update a user', action: 'Update a user' },
		],
		default: 'list',
	},
];

export const userFields: INodeProperties[] = [
	// ── Create ────────────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['create'] } },
		description: 'The domain to create the user in',
	},
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['create'] } },
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['create'] } },
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['create'] } },
	},
	{
		displayName: 'First Name',
		name: 'firstname',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['create'] } },
	},
	{
		displayName: 'Last Name',
		name: 'lastname',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['user'], operation: ['create'] } },
		options: [
			{ displayName: 'Password Question', name: 'passwordquestion', type: 'string', default: '' },
			{ displayName: 'Password Answer', name: 'passwordanswer', type: 'string', default: '' },
			{ displayName: 'Reference', name: 'reference', type: 'string', default: '', description: 'External reference ID' },
			{ displayName: 'Flags', name: 'flags', type: 'string', default: '' },
			{ displayName: 'Role ID', name: 'roleid', type: 'string', default: '' },
		],
	},

	// ── Delete ────────────────────────────────────────────────────────────
	{
		displayName: 'User ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['delete'] } },
	},

	// ── Get ───────────────────────────────────────────────────────────────
	{
		displayName: 'User ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['get'] } },
	},
	{
		displayName: 'Select Fields',
		name: 'select',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['get'] } },
		description: 'Comma-separated list of fields to return',
	},

	// ── Get Active Count ──────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['getActiveCount'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['user'], operation: ['getActiveCount'] } },
		options: [
			{ displayName: 'Include Descendant Domains', name: 'includedescendantdomains', type: 'boolean', default: false },
			{ displayName: 'Persona', name: 'persona', type: 'string', default: '' },
			{ displayName: 'Start Date', name: 'startdate', type: 'dateTime', default: '' },
			{ displayName: 'End Date', name: 'enddate', type: 'dateTime', default: '' },
			{ displayName: 'By Day', name: 'byday', type: 'boolean', default: false },
			{ displayName: 'By Month', name: 'bymonth', type: 'boolean', default: false },
			{ displayName: 'By Year', name: 'byyear', type: 'boolean', default: false },
		],
	},

	// ── Get Activity ──────────────────────────────────────────────────────
	{
		displayName: 'User ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['getActivity'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['user'], operation: ['getActivity'] } },
		options: [
			{ displayName: 'Start Date', name: 'startdate', type: 'dateTime', default: '' },
			{ displayName: 'End Date', name: 'enddate', type: 'dateTime', default: '' },
		],
	},

	// ── Get Activity Stream ───────────────────────────────────────────────
	{
		displayName: 'User ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['getActivityStream'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['user'], operation: ['getActivityStream'] } },
		options: [
			{ displayName: 'Enrollment ID', name: 'enrollmentid', type: 'string', default: '' },
			{ displayName: 'Start Key', name: 'startkey', type: 'string', default: '', description: 'Pagination cursor' },
			{ displayName: 'Limit', name: 'limit', type: 'number', default: 50 },
			{ displayName: 'Types', name: 'types', type: 'string', default: '', description: 'Comma-separated activity types to filter' },
		],
	},

	// ── Get Domain Activity ───────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['getDomainActivity'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['user'], operation: ['getDomainActivity'] } },
		options: [
			{ displayName: 'Start Date', name: 'startdate', type: 'dateTime', default: '' },
			{ displayName: 'End Date', name: 'enddate', type: 'dateTime', default: '' },
			{ displayName: 'Max Users', name: 'maxusers', type: 'number', default: 0 },
			{ displayName: 'Select Fields', name: 'select', type: 'string', default: '' },
		],
	},

	// ── Get Profile Picture ───────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['getProfilePicture'] } },
	},
	{
		displayName: 'Default URL',
		name: 'default',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['getProfilePicture'] } },
		description: 'URL to return if no profile picture exists',
	},

	// ── List ──────────────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['list'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['user'], operation: ['list'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		displayOptions: { show: { resource: ['user'], operation: ['list'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['user'], operation: ['list'] } },
		options: [
			{ displayName: 'Include Descendant Domains', name: 'includedescendantdomains', type: 'boolean', default: false },
			{ displayName: 'Select Fields', name: 'select', type: 'string', default: '' },
			{ displayName: 'Text Search', name: 'text', type: 'string', default: '', description: 'Free-text search query' },
			{ displayName: 'Query', name: 'query', type: 'string', default: '', description: 'Structured query expression' },
		],
	},

	// ── Restore ───────────────────────────────────────────────────────────
	{
		displayName: 'User ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['restore'] } },
	},

	// ── Update ────────────────────────────────────────────────────────────
	{
		displayName: 'User ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['user'], operation: ['update'] } },
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['user'], operation: ['update'] } },
		options: [
			{ displayName: 'Domain ID', name: 'domainid', type: 'string', default: '' },
			{ displayName: 'Username', name: 'username', type: 'string', default: '' },
			{ displayName: 'First Name', name: 'firstname', type: 'string', default: '' },
			{ displayName: 'Last Name', name: 'lastname', type: 'string', default: '' },
			{ displayName: 'Email', name: 'email', type: 'string', default: '' },
			{ displayName: 'Reference', name: 'reference', type: 'string', default: '' },
			{ displayName: 'Flags', name: 'flags', type: 'string', default: '' },
		],
	},
];
