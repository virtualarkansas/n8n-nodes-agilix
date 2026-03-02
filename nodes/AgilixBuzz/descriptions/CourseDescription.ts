import type { INodeProperties } from 'n8n-workflow';

export const courseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['course'] } },
		options: [
			{ name: 'Copy', value: 'copy', description: 'Copy a course', action: 'Copy a course' },
			{ name: 'Create', value: 'create', description: 'Create a course', action: 'Create a course' },
			{ name: 'Create Demo', value: 'createDemo', description: 'Create a demo course', action: 'Create a demo course' },
			{ name: 'Deactivate', value: 'deactivate', description: 'Deactivate a course', action: 'Deactivate a course' },
			{ name: 'Delete', value: 'delete', description: 'Delete a course', action: 'Delete a course' },
			{ name: 'Get', value: 'get', description: 'Get a course', action: 'Get a course' },
			{ name: 'List', value: 'list', description: 'List courses in a domain', action: 'List courses' },
			{ name: 'Merge', value: 'merge', description: 'Merge courses', action: 'Merge courses' },
			{ name: 'Restore', value: 'restore', description: 'Restore a deleted course', action: 'Restore a course' },
			{ name: 'Update', value: 'update', description: 'Update a course', action: 'Update a course' },
		],
		default: 'list',
	},
];

export const courseFields: INodeProperties[] = [
	// ── Copy ──────────────────────────────────────────────────────────────
	{
		displayName: 'Course ID',
		name: 'courseid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['course'], operation: ['copy'] } },
	},
	{
		displayName: 'Destination Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['course'], operation: ['copy'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['course'], operation: ['copy'] } },
		options: [
			{ displayName: 'Action', name: 'action', type: 'string', default: '' },
			{ displayName: 'Depth', name: 'depth', type: 'string', default: '' },
			{ displayName: 'Reference', name: 'reference', type: 'string', default: '' },
			{ displayName: 'Status', name: 'status', type: 'string', default: '' },
			{ displayName: 'Role ID', name: 'roleid', type: 'string', default: '' },
			{ displayName: 'Title', name: 'title', type: 'string', default: '' },
			{ displayName: 'Type', name: 'type', type: 'string', default: '' },
			{ displayName: 'Start Date', name: 'startdate', type: 'dateTime', default: '' },
			{ displayName: 'End Date', name: 'enddate', type: 'dateTime', default: '' },
			{ displayName: 'Days', name: 'days', type: 'number', default: 0 },
			{ displayName: 'Term', name: 'term', type: 'string', default: '' },
		],
	},

	// ── Create ────────────────────────────────────────────────────────────
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['course'], operation: ['create'] } },
	},
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['course'], operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['course'], operation: ['create'] } },
		options: [
			{ displayName: 'Schema', name: 'schema', type: 'string', default: '3' },
			{ displayName: 'Reference', name: 'reference', type: 'string', default: '' },
			{ displayName: 'Status', name: 'status', type: 'string', default: '' },
			{ displayName: 'Role ID', name: 'roleid', type: 'string', default: '' },
			{ displayName: 'Type', name: 'type', type: 'string', default: '' },
			{ displayName: 'Start Date', name: 'startdate', type: 'dateTime', default: '' },
			{ displayName: 'End Date', name: 'enddate', type: 'dateTime', default: '' },
			{ displayName: 'Days', name: 'days', type: 'number', default: 0 },
			{ displayName: 'Term', name: 'term', type: 'string', default: '' },
		],
	},

	// ── Create Demo ───────────────────────────────────────────────────────
	{
		displayName: 'Course ID',
		name: 'courseid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['course'], operation: ['createDemo'] } },
	},
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['course'], operation: ['createDemo'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['course'], operation: ['createDemo'] } },
		options: [
			{ displayName: 'Schema', name: 'schema', type: 'string', default: '' },
			{ displayName: 'Reference', name: 'reference', type: 'string', default: '' },
			{ displayName: 'Title', name: 'title', type: 'string', default: '' },
			{ displayName: 'Days Offset', name: 'daysoffset', type: 'number', default: 0 },
		],
	},

	// ── Deactivate ────────────────────────────────────────────────────────
	{
		displayName: 'Course ID',
		name: 'courseid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['course'], operation: ['deactivate'] } },
	},

	// ── Delete ────────────────────────────────────────────────────────────
	{
		displayName: 'Course ID',
		name: 'courseid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['course'], operation: ['delete'] } },
	},

	// ── Get ───────────────────────────────────────────────────────────────
	{
		displayName: 'Course ID',
		name: 'courseid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['course'], operation: ['get'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['course'], operation: ['get'] } },
		options: [
			{ displayName: 'Select Fields', name: 'select', type: 'string', default: '' },
			{ displayName: 'Version', name: 'version', type: 'string', default: '' },
		],
	},

	// ── List ──────────────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['course'], operation: ['list'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['course'], operation: ['list'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		displayOptions: { show: { resource: ['course'], operation: ['list'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['course'], operation: ['list'] } },
		options: [
			{ displayName: 'Include Descendant Domains', name: 'includedescendantdomains', type: 'boolean', default: false },
			{ displayName: 'Select Fields', name: 'select', type: 'string', default: '' },
			{ displayName: 'Text Search', name: 'text', type: 'string', default: '' },
			{ displayName: 'Query', name: 'query', type: 'string', default: '' },
			{ displayName: 'Subtype', name: 'subtype', type: 'string', default: '' },
			{
				displayName: 'Show',
				name: 'show',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'All', value: 'all' },
					{ name: 'Current', value: 'current' },
					{ name: 'Deleted', value: 'deleted' },
				],
				default: 'active',
				description: 'Filter courses by status',
			},
		],
	},

	// ── Merge ─────────────────────────────────────────────────────────────
	{
		displayName: 'Course ID',
		name: 'courseid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['course'], operation: ['merge'] } },
	},

	// ── Restore ───────────────────────────────────────────────────────────
	{
		displayName: 'Course ID',
		name: 'courseid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['course'], operation: ['restore'] } },
	},

	// ── Update ────────────────────────────────────────────────────────────
	{
		displayName: 'Course ID',
		name: 'courseid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['course'], operation: ['update'] } },
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['course'], operation: ['update'] } },
		options: [
			{ displayName: 'Domain ID', name: 'domainid', type: 'string', default: '' },
			{ displayName: 'Title', name: 'title', type: 'string', default: '' },
			{ displayName: 'Reference', name: 'reference', type: 'string', default: '' },
			{ displayName: 'Type', name: 'type', type: 'string', default: '' },
			{ displayName: 'Base ID', name: 'baseid', type: 'string', default: '' },
			{ displayName: 'Start Date', name: 'startdate', type: 'dateTime', default: '' },
			{ displayName: 'End Date', name: 'enddate', type: 'dateTime', default: '' },
			{ displayName: 'Days', name: 'days', type: 'number', default: 0 },
			{ displayName: 'Term', name: 'term', type: 'string', default: '' },
			{ displayName: 'Schema', name: 'schema', type: 'string', default: '' },
		],
	},
];
