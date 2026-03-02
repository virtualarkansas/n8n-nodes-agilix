import type { INodeProperties } from 'n8n-workflow';

export const rightOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['right'] } },
		options: [
			{ name: 'Create Role', value: 'createRole', description: 'Create a role', action: 'Create a role' },
			{ name: 'Delete Role', value: 'deleteRole', description: 'Delete a role', action: 'Delete a role' },
			{ name: 'Delete Subscriptions', value: 'deleteSubscriptions', description: 'Delete subscriptions', action: 'Delete subscriptions' },
			{ name: 'Get Actor Rights', value: 'getActorRights', description: 'Get rights for an actor', action: 'Get actor rights' },
			{ name: 'Get Effective Rights', value: 'getEffectiveRights', description: 'Get effective rights', action: 'Get effective rights' },
			{ name: 'Get Entity Rights', value: 'getEntityRights', description: 'Get entity rights', action: 'Get entity rights' },
			{ name: 'Get Personas', value: 'getPersonas', description: 'Get persona assignments', action: 'Get personas' },
			{ name: 'Get Rights', value: 'getRights', description: 'Get specific rights', action: 'Get rights' },
			{ name: 'Get Rights List', value: 'getRightsList', description: 'Get all rights definitions', action: 'Get rights list' },
			{ name: 'Get Role', value: 'getRole', description: 'Get a role', action: 'Get a role' },
			{ name: 'Get Subscription List', value: 'getSubscriptionList', description: 'Get subscriptions', action: 'Get subscription list' },
			{ name: 'List Roles', value: 'listRoles', description: 'List roles in a domain', action: 'List roles' },
			{ name: 'Restore Role', value: 'restoreRole', description: 'Restore a deleted role', action: 'Restore a role' },
			{ name: 'Update Rights', value: 'updateRights', description: 'Update rights', action: 'Update rights' },
			{ name: 'Update Role', value: 'updateRole', description: 'Update a role', action: 'Update a role' },
			{ name: 'Update Subscriptions', value: 'updateSubscriptions', description: 'Update subscriptions', action: 'Update subscriptions' },
		],
		default: 'listRoles',
	},
];

export const rightFields: INodeProperties[] = [
	// ── Create Role ───────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDomains' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['createRole'] } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['createRole'] } },
	},
	{
		displayName: 'Privileges',
		name: 'privileges',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['createRole'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['right'], operation: ['createRole'] } },
		options: [
			{ displayName: 'Reference', name: 'reference', type: 'string', default: '' },
			{
				displayName: 'Entity Type',
				name: 'entitytype',
				type: 'options',
				options: [
					{ name: 'None', value: '' },
					{ name: 'Domain (D)', value: 'D' },
					{ name: 'Course (C)', value: 'C' },
				],
				default: '',
			},
		],
	},

	// ── Delete Role ───────────────────────────────────────────────────────
	{
		displayName: 'Role ID',
		name: 'roleid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['deleteRole'] } },
	},

	// ── Delete Subscriptions ──────────────────────────────────────────────
	{
		displayName: 'Subscriber ID',
		name: 'subscriberid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['deleteSubscriptions'] } },
	},
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['deleteSubscriptions'] } },
	},

	// ── Get Actor Rights ──────────────────────────────────────────────────
	{
		displayName: 'Actor ID',
		name: 'actorid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['getActorRights'] } },
	},
	{
		displayName: 'Entity Types',
		name: 'entitytypes',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['getActorRights'] } },
	},

	// ── Get Effective Rights ──────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['getEffectiveRights'] } },
	},

	// ── Get Entity Rights ─────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['getEntityRights'] } },
	},

	// ── Get Personas ──────────────────────────────────────────────────────
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['right'], operation: ['getPersonas'] } },
		options: [
			{ displayName: 'User ID', name: 'userid', type: 'string', default: '' },
			{ displayName: 'Domain ID', name: 'domainid', type: 'string', default: '' },
		],
	},

	// ── Get Rights ────────────────────────────────────────────────────────
	{
		displayName: 'Actor ID',
		name: 'actorid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['getRights'] } },
	},
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['getRights'] } },
	},

	// ── Get Rights List ───────────────────────────────────────────────────
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['right'], operation: ['getRightsList'] } },
		options: [
			{ displayName: 'Domain ID', name: 'domainid', type: 'string', default: '' },
			{ displayName: 'Restrict Domain', name: 'restrictdomain', type: 'boolean', default: false },
		],
	},

	// ── Get Role ──────────────────────────────────────────────────────────
	{
		displayName: 'Role ID',
		name: 'roleid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['getRole'] } },
	},

	// ── Get Subscription List ─────────────────────────────────────────────
	{
		displayName: 'Subscriber ID',
		name: 'subscriberid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['getSubscriptionList'] } },
	},
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['getSubscriptionList'] } },
	},

	// ── List Roles ────────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDomains' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['listRoles'] } },
	},

	// ── Restore Role ──────────────────────────────────────────────────────
	{
		displayName: 'Role ID',
		name: 'roleid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['restoreRole'] } },
	},

	// ── Update Rights ─────────────────────────────────────────────────────
	{
		displayName: 'Actor ID',
		name: 'actorid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['updateRights'] } },
	},
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['updateRights'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['right'], operation: ['updateRights'] } },
		options: [
			{ displayName: 'Role ID', name: 'roleid', type: 'string', default: '' },
			{ displayName: 'Flags', name: 'flags', type: 'string', default: '' },
			{ displayName: 'Schema', name: 'schema', type: 'string', default: '' },
		],
	},

	// ── Update Role ───────────────────────────────────────────────────────
	{
		displayName: 'Role ID',
		name: 'roleid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['updateRole'] } },
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['right'], operation: ['updateRole'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Privileges', name: 'privileges', type: 'string', default: '' },
			{ displayName: 'Reference', name: 'reference', type: 'string', default: '' },
			{
				displayName: 'Entity Type',
				name: 'entitytype',
				type: 'options',
				options: [
					{ name: 'None', value: '' },
					{ name: 'Domain (D)', value: 'D' },
					{ name: 'Course (C)', value: 'C' },
				],
				default: '',
			},
		],
	},

	// ── Update Subscriptions ──────────────────────────────────────────────
	{
		displayName: 'Subscriber ID',
		name: 'subscriberid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['updateSubscriptions'] } },
	},
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['updateSubscriptions'] } },
	},
	{
		displayName: 'Start Date',
		name: 'startdate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['updateSubscriptions'] } },
	},
	{
		displayName: 'End Date',
		name: 'enddate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['right'], operation: ['updateSubscriptions'] } },
	},
];
