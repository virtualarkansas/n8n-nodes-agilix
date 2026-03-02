import type { INodeProperties } from 'n8n-workflow';

export const itemOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['item'] } },
		options: [
			{ name: 'Assign', value: 'assign', description: 'Assign an item to a folder', action: 'Assign item' },
			{ name: 'Copy', value: 'copy', description: 'Copy items between entities', action: 'Copy items' },
			{ name: 'Create', value: 'create', description: 'Create or update an item', action: 'Create item' },
			{ name: 'Delete', value: 'delete', description: 'Delete an item', action: 'Delete item' },
			{ name: 'Get', value: 'get', description: 'Get an item by ID', action: 'Get item' },
			{ name: 'Get Info', value: 'getInfo', description: 'Get item info (metadata)', action: 'Get item info' },
			{ name: 'List', value: 'list', description: 'List items in an entity', action: 'List items' },
			{ name: 'Restore', value: 'restore', description: 'Restore a deleted item', action: 'Restore item' },
			{ name: 'Unassign', value: 'unassign', description: 'Unassign an item from a folder', action: 'Unassign item' },
		],
		default: 'list',
	},
];

export const itemFields: INodeProperties[] = [
	// ── List ──────────────────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['list'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['item'], operation: ['list'] } },
		options: [
			{ displayName: 'All Versions', name: 'allversions', type: 'boolean', default: false },
			{ displayName: 'Item ID', name: 'itemid', type: 'string', default: '', description: 'Filter to a specific item or folder' },
			{ displayName: 'Query', name: 'query', type: 'string', default: '', description: 'Data filter expression' },
		],
	},

	// ── Get ───────────────────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['get'] } },
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['get'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['item'], operation: ['get'] } },
		options: [
			{ displayName: 'Embed Master', name: 'embedmaster', type: 'boolean', default: false },
			{ displayName: 'Version', name: 'version', type: 'number', default: 0, description: 'Specific version to retrieve (0 = latest)' },
		],
	},

	// ── Get Info ──────────────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['getInfo'] } },
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['getInfo'] } },
	},

	// ── Create ────────────────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['create'] } },
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['create'] } },
		description: 'Alphanumeric, underscore, period, dash only. "DEFAULT" is reserved for root.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['item'], operation: ['create'] } },
		options: [
			{ displayName: 'Data (JSON)', name: 'data', type: 'string', default: '', description: 'Free-form item data as JSON string' },
		],
	},

	// ── Delete ────────────────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['delete'] } },
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['delete'] } },
	},
	{
		displayName: 'Cascade',
		name: 'cascade',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['item'], operation: ['delete'] } },
		description: 'Whether to also delete child items',
	},

	// ── Restore ───────────────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['restore'] } },
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['restore'] } },
	},
	{
		displayName: 'Version',
		name: 'version',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['item'], operation: ['restore'] } },
		description: 'Version to restore (0 = latest deleted)',
	},

	// ── Copy ──────────────────────────────────────────────────────────────
	{
		displayName: 'Source Entity ID',
		name: 'sourceentityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['copy'] } },
	},
	{
		displayName: 'Source Item ID',
		name: 'sourceitemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['copy'] } },
	},
	{
		displayName: 'Destination Entity ID',
		name: 'destinationentityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['copy'] } },
	},
	{
		displayName: 'Destination Item ID',
		name: 'destinationitemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['copy'] } },
	},
	{
		displayName: 'Deep Copy',
		name: 'deep',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['item'], operation: ['copy'] } },
		description: 'Whether to also copy child items',
	},

	// ── Assign ────────────────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['assign'] } },
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['assign'] } },
	},
	{
		displayName: 'Folder ID',
		name: 'folderid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['assign'] } },
	},
	{
		displayName: 'Sequence',
		name: 'sequence',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['item'], operation: ['assign'] } },
		description: 'Sort order within folder (0 = append)',
	},

	// ── Unassign ──────────────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['unassign'] } },
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['item'], operation: ['unassign'] } },
	},
];
