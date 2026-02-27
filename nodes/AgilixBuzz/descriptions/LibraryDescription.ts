import type { INodeProperties } from 'n8n-workflow';

export const libraryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['library'] } },
		options: [
			{ name: 'Create Page', value: 'createPage', description: 'Create a library page', action: 'Create a library page' },
			{ name: 'Get Page', value: 'getPage', description: 'Get a library page', action: 'Get a library page' },
			{ name: 'List Pages', value: 'listPages', description: 'List library pages', action: 'List library pages' },
		],
		default: 'listPages',
	},
];

export const libraryFields: INodeProperties[] = [
	// ── Create Page ───────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['library'], operation: ['createPage'] } },
	},
	{
		displayName: 'Library ID',
		name: 'libraryid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['library'], operation: ['createPage'] } },
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['library'], operation: ['createPage'] } },
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: { rows: 3 },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['library'], operation: ['createPage'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['library'], operation: ['createPage'] } },
		options: [
			{ displayName: 'Body', name: 'body', type: 'string', typeOptions: { rows: 5 }, default: '' },
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Featured', name: 'meta-featured', type: 'boolean', default: false },
			{ displayName: 'Type', name: 'meta-type', type: 'string', default: '' },
			{ displayName: 'Category', name: 'meta-category', type: 'string', default: '' },
		],
	},

	// ── Get Page ──────────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['library'], operation: ['getPage'] } },
	},
	{
		displayName: 'Page ID',
		name: 'pageid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['library'], operation: ['getPage'] } },
	},

	// ── List Pages ────────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['library'], operation: ['listPages'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['library'], operation: ['listPages'] } },
		options: [
			{ displayName: 'Library ID', name: 'libraryid', type: 'string', default: '' },
			{ displayName: 'Limit', name: 'limit', type: 'number', default: 50 },
			{ displayName: 'Select Fields', name: 'select', type: 'string', default: '' },
		],
	},
];
