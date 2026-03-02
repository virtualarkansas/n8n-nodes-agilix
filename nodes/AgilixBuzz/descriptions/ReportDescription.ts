import type { INodeProperties } from 'n8n-workflow';

export const reportOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['report'] } },
		options: [
			{ name: 'Get Info', value: 'getInfo', description: 'Get report info', action: 'Get report info' },
			{ name: 'Get Report List', value: 'getReportList', description: 'Get report list for a domain', action: 'Get report list' },
			{ name: 'Get Runnable Report List', value: 'getRunnableReportList', description: 'Get runnable reports', action: 'Get runnable report list' },
			{ name: 'Run', value: 'run', description: 'Run a report', action: 'Run a report' },
		],
		default: 'getRunnableReportList',
	},
];

export const reportFields: INodeProperties[] = [
	// ── Get Info ──────────────────────────────────────────────────────────
	{
		displayName: 'Report ID',
		name: 'reportid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['report'], operation: ['getInfo'] } },
	},

	// ── Get Report List ───────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDomains' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['report'], operation: ['getReportList'] } },
	},

	// ── Get Runnable Report List ──────────────────────────────────────────
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['report'], operation: ['getRunnableReportList'] } },
		options: [
			{ displayName: 'Entity ID', name: 'entityid', type: 'string', default: '' },
			{ displayName: 'Domain ID', name: 'domainid', type: 'string', default: '' },
		],
	},

	// ── Run ───────────────────────────────────────────────────────────────
	{
		displayName: 'Report ID',
		name: 'reportid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['report'], operation: ['run'] } },
	},
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['report'], operation: ['run'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['report'], operation: ['run'] } },
		options: [
			{ displayName: 'Format', name: 'format', type: 'string', default: '', description: 'Output format (e.g. JSON)' },
			{ displayName: 'No Data', name: 'nodata', type: 'boolean', default: false },
			{ displayName: 'As Of', name: 'AsOf', type: 'dateTime', default: '', description: 'Run report as of a specific date' },
		],
	},
];
