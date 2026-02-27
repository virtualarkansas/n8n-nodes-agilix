import type { INodeProperties } from 'n8n-workflow';

export const resourceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['resource'] } },
		options: [
			{ name: 'Copy', value: 'copy', description: 'Copy resources between entities', action: 'Copy resources' },
			{ name: 'Delete', value: 'delete', description: 'Delete resources', action: 'Delete resources' },
			{ name: 'Get', value: 'get', description: 'Download a resource', action: 'Get a resource' },
			{ name: 'Get Entity Resource ID', value: 'getEntityResourceId', description: 'Get entity resource container ID', action: 'Get entity resource ID' },
			{ name: 'Get Info', value: 'getInfo', description: 'Get resource metadata', action: 'Get resource info' },
			{ name: 'List', value: 'list', description: 'List resources', action: 'List resources' },
			{ name: 'List Restorable', value: 'listRestorable', description: 'List restorable resources', action: 'List restorable resources' },
			{ name: 'Put Folders', value: 'putFolders', description: 'Create resource folders', action: 'Put resource folders' },
			{ name: 'Restore', value: 'restore', description: 'Restore deleted resources', action: 'Restore resources' },
		],
		default: 'list',
	},
];

export const resourceFields: INodeProperties[] = [
	// ── Copy ──────────────────────────────────────────────────────────────
	{
		displayName: 'Source Entity ID',
		name: 'sourceentityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['resource'], operation: ['copy'] } },
	},
	{
		displayName: 'Destination Entity ID',
		name: 'destinationentityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['resource'], operation: ['copy'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['resource'], operation: ['copy'] } },
		options: [
			{ displayName: 'Source Path', name: 'sourcepath', type: 'string', default: '' },
			{ displayName: 'Destination Path', name: 'destinationpath', type: 'string', default: '' },
		],
	},

	// ── Delete ────────────────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['resource'], operation: ['delete'] } },
	},
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['resource'], operation: ['delete'] } },
	},

	// ── Get ───────────────────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['resource'], operation: ['get'] } },
	},
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['resource'], operation: ['get'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['resource'], operation: ['get'] } },
		options: [
			{ displayName: 'Version', name: 'version', type: 'string', default: '' },
			{ displayName: 'Package Type', name: 'packagetype', type: 'string', default: '' },
			{ displayName: 'Attachment', name: 'attachment', type: 'boolean', default: false },
			{ displayName: 'Class', name: 'class', type: 'string', default: '' },
		],
	},

	// ── Get Entity Resource ID ────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['resource'], operation: ['getEntityResourceId'] } },
	},

	// ── Get Info ──────────────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['resource'], operation: ['getInfo'] } },
	},
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['resource'], operation: ['getInfo'] } },
	},

	// ── List ──────────────────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['resource'], operation: ['list'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['resource'], operation: ['list'] } },
		options: [
			{ displayName: 'Path', name: 'path', type: 'string', default: '' },
			{ displayName: 'Recurse', name: 'recurse', type: 'boolean', default: false },
			{ displayName: 'Query', name: 'query', type: 'string', default: '' },
			{ displayName: 'All Versions', name: 'allversions', type: 'boolean', default: false },
			{ displayName: 'Entries', name: 'entries', type: 'number', default: 0 },
			{ displayName: 'Class', name: 'class', type: 'string', default: '' },
		],
	},

	// ── List Restorable ───────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['resource'], operation: ['listRestorable'] } },
	},

	// ── Put Folders ───────────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['resource'], operation: ['putFolders'] } },
	},
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['resource'], operation: ['putFolders'] } },
	},

	// ── Restore ───────────────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['resource'], operation: ['restore'] } },
	},
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['resource'], operation: ['restore'] } },
	},
];
