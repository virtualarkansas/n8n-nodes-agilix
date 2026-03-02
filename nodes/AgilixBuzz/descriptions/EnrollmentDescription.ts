import type { INodeProperties } from 'n8n-workflow';

export const enrollmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['enrollment'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create an enrollment', action: 'Create an enrollment' },
			{ name: 'Delete', value: 'delete', description: 'Delete an enrollment', action: 'Delete an enrollment' },
			{ name: 'Get', value: 'get', description: 'Get an enrollment', action: 'Get an enrollment' },
			{ name: 'Get Activity', value: 'getActivity', description: 'Get enrollment activity', action: 'Get enrollment activity' },
			{ name: 'Get Gradebook', value: 'getGradebook', description: 'Get enrollment gradebook', action: 'Get enrollment gradebook' },
			{ name: 'Get Group List', value: 'getGroupList', description: 'Get enrollment group list', action: 'Get enrollment group list' },
			{ name: 'Get Metrics Report', value: 'getMetricsReport', description: 'Get enrollment metrics report', action: 'Get enrollment metrics report' },
			{ name: 'List', value: 'list', description: 'List enrollments in a domain', action: 'List enrollments' },
			{ name: 'List by Teacher', value: 'listByTeacher', description: 'List enrollments by teacher', action: 'List enrollments by teacher' },
			{ name: 'List Entity Enrollments', value: 'listEntity', description: 'List enrollments for a course/entity', action: 'List entity enrollments' },
			{ name: 'List User Enrollments', value: 'listUser', description: 'List enrollments for a user', action: 'List user enrollments' },
			{ name: 'Put Self Assessment', value: 'putSelfAssessment', description: 'Submit a self assessment', action: 'Put self assessment' },
			{ name: 'Restore', value: 'restore', description: 'Restore a deleted enrollment', action: 'Restore an enrollment' },
			{ name: 'Update', value: 'update', description: 'Update an enrollment', action: 'Update an enrollment' },
		],
		default: 'list',
	},
];

export const enrollmentFields: INodeProperties[] = [
	// ── Create ────────────────────────────────────────────────────────────
	{
		displayName: 'User ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['enrollment'], operation: ['create'] } },
	},
	{
		displayName: 'Entity ID (Course ID)',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['enrollment'], operation: ['create'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['enrollment'], operation: ['create'] } },
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active (1)', value: '1' },
					{ name: 'Withdrawn (2)', value: '2' },
					{ name: 'Suspended (4)', value: '4' },
					{ name: 'Completed (7)', value: '7' },
					{ name: 'Transfer Out (8)', value: '8' },
				],
				default: '1',
			},
			{ displayName: 'Role ID', name: 'roleid', type: 'string', default: '' },
			{ displayName: 'Flags', name: 'flags', type: 'string', default: '' },
			{ displayName: 'Domain ID', name: 'domainid', type: 'string', default: '' },
			{ displayName: 'Start Date', name: 'startdate', type: 'dateTime', default: '' },
			{ displayName: 'End Date', name: 'enddate', type: 'dateTime', default: '' },
			{ displayName: 'Reference', name: 'reference', type: 'string', default: '' },
			{ displayName: 'Schema', name: 'schema', type: 'string', default: '' },
			{ displayName: 'Disallow Duplicates', name: 'disallowduplicates', type: 'boolean', default: false },
		],
	},

	// ── Delete ────────────────────────────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['enrollment'], operation: ['delete'] } },
	},

	// ── Get ───────────────────────────────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['enrollment'], operation: ['get'] } },
	},
	{
		displayName: 'Select Fields',
		name: 'select',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['enrollment'], operation: ['get'] } },
	},

	// ── Get Activity ──────────────────────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['enrollment'], operation: ['getActivity'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['enrollment'], operation: ['getActivity'] } },
		options: [
			{ displayName: 'Last', name: 'last', type: 'number', default: 0, description: 'Number of most recent activity entries' },
			{ displayName: 'Merge Overlap', name: 'mergeoverlap', type: 'boolean', default: false },
		],
	},

	// ── Get Gradebook ─────────────────────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['enrollment'], operation: ['getGradebook'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['enrollment'], operation: ['getGradebook'] } },
		options: [
			{ displayName: 'Force Required Items', name: 'forcerequireditems', type: 'boolean', default: false },
			{ displayName: 'Grading Scheme ID', name: 'gradingschemeid', type: 'string', default: '' },
			{ displayName: 'Grading Scheme', name: 'gradingscheme', type: 'string', default: '' },
			{ displayName: 'Item ID', name: 'itemid', type: 'string', default: '' },
			{ displayName: 'SCORM', name: 'scorm', type: 'boolean', default: false },
			{ displayName: 'Zero Unscored', name: 'zerounscored', type: 'boolean', default: false },
		],
	},

	// ── Get Group List ────────────────────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['enrollment'], operation: ['getGroupList'] } },
	},
	{
		displayName: 'Set ID',
		name: 'setid',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['enrollment'], operation: ['getGroupList'] } },
	},

	// ── Get Metrics Report ────────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['enrollment'], operation: ['getMetricsReport'] } },
	},
	{
		displayName: 'Report Type',
		name: 'report',
		type: 'options',
		options: [
			{ name: 'Student', value: 'Student' },
			{ name: 'Enrollment', value: 'Enrollment' },
		],
		required: true,
		default: 'Student',
		displayOptions: { show: { resource: ['enrollment'], operation: ['getMetricsReport'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['enrollment'], operation: ['getMetricsReport'] } },
		options: [
			{ displayName: 'Select Fields', name: 'select', type: 'string', default: '' },
			{ displayName: 'Filename', name: 'filename', type: 'string', default: '' },
			{ displayName: 'Format', name: 'format', type: 'string', default: '' },
		],
	},

	// ── List ──────────────────────────────────────────────────────────────
	{
		displayName: 'Domain ID',
		name: 'domainid',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDomains' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['enrollment'], operation: ['list'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['enrollment'], operation: ['list'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		displayOptions: { show: { resource: ['enrollment'], operation: ['list'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['enrollment'], operation: ['list'] } },
		options: [
			{ displayName: 'Include Descendant Domains', name: 'includedescendantdomains', type: 'boolean', default: false },
			{ displayName: 'Select Fields', name: 'select', type: 'string', default: '' },
			{ displayName: 'Query', name: 'query', type: 'string', default: '' },
			{ displayName: 'User Domain ID', name: 'userdomainid', type: 'string', default: '' },
			{ displayName: 'User Query', name: 'userquery', type: 'string', default: '' },
			{ displayName: 'User Text', name: 'usertext', type: 'string', default: '' },
			{ displayName: 'Course Domain ID', name: 'coursedomainid', type: 'string', default: '' },
			{ displayName: 'Course Query', name: 'coursequery', type: 'string', default: '' },
			{ displayName: 'Course Text', name: 'coursetext', type: 'string', default: '' },
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
				description: 'Filter enrollments by status',
			},
		],
	},

	// ── List by Teacher ───────────────────────────────────────────────────
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['enrollment'], operation: ['listByTeacher'] } },
		options: [
			{ displayName: 'Teacher User ID', name: 'teacheruserid', type: 'string', default: '', description: 'Defaults to authenticated user if omitted' },
			{ displayName: 'Teacher All Status', name: 'teacherallstatus', type: 'boolean', default: false },
			{ displayName: 'Teacher Days Active Past End', name: 'teacherdaysactivepastend', type: 'number', default: 0 },
			{ displayName: 'Privileges', name: 'privileges', type: 'string', default: '' },
			{ displayName: 'All Status', name: 'allstatus', type: 'boolean', default: false },
			{ displayName: 'Days Active Past End', name: 'daysactivepastend', type: 'number', default: 0 },
			{ displayName: 'User ID', name: 'userid', type: 'string', default: '' },
			{ displayName: 'Select Fields', name: 'select', type: 'string', default: '' },
		],
	},

	// ── List Entity Enrollments ───────────────────────────────────────────
	{
		displayName: 'Entity ID (Course ID)',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['enrollment'], operation: ['listEntity'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['enrollment'], operation: ['listEntity'] } },
		options: [
			{ displayName: 'Privileges', name: 'privileges', type: 'string', default: '' },
			{ displayName: 'All Status', name: 'allstatus', type: 'boolean', default: false },
			{ displayName: 'Days Active Past End', name: 'daysactivepastend', type: 'number', default: 0 },
			{ displayName: 'User ID', name: 'userid', type: 'string', default: '' },
			{ displayName: 'Select Fields', name: 'select', type: 'string', default: '' },
		],
	},

	// ── List User Enrollments ─────────────────────────────────────────────
	{
		displayName: 'User ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['enrollment'], operation: ['listUser'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['enrollment'], operation: ['listUser'] } },
		options: [
			{ displayName: 'All Status', name: 'allstatus', type: 'boolean', default: false },
			{ displayName: 'Entity ID', name: 'entityid', type: 'string', default: '' },
			{ displayName: 'Privileges', name: 'privileges', type: 'string', default: '' },
			{ displayName: 'Days Active Past End', name: 'daysactivepastend', type: 'number', default: 0 },
			{ displayName: 'Query', name: 'query', type: 'string', default: '' },
			{ displayName: 'Select Fields', name: 'select', type: 'string', default: '' },
		],
	},

	// ── Put Self Assessment ───────────────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['enrollment'], operation: ['putSelfAssessment'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['enrollment'], operation: ['putSelfAssessment'] } },
		options: [
			{ displayName: 'Understanding', name: 'understanding', type: 'number', default: 0 },
			{ displayName: 'Interest', name: 'interest', type: 'number', default: 0 },
			{ displayName: 'Effort', name: 'effort', type: 'number', default: 0 },
		],
	},

	// ── Restore ───────────────────────────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['enrollment'], operation: ['restore'] } },
	},

	// ── Update ────────────────────────────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['enrollment'], operation: ['update'] } },
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['enrollment'], operation: ['update'] } },
		options: [
			{ displayName: 'User ID', name: 'userid', type: 'string', default: '' },
			{ displayName: 'Entity ID', name: 'entityid', type: 'string', default: '' },
			{ displayName: 'Domain ID', name: 'domainid', type: 'string', default: '' },
			{ displayName: 'Role ID', name: 'roleid', type: 'string', default: '' },
			{ displayName: 'Flags', name: 'flags', type: 'string', default: '' },
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active (1)', value: '1' },
					{ name: 'Withdrawn (2)', value: '2' },
					{ name: 'Suspended (4)', value: '4' },
					{ name: 'Completed (7)', value: '7' },
					{ name: 'Transfer Out (8)', value: '8' },
				],
				default: '1',
			},
			{ displayName: 'Start Date', name: 'startdate', type: 'dateTime', default: '' },
			{ displayName: 'End Date', name: 'enddate', type: 'dateTime', default: '' },
			{ displayName: 'Reference', name: 'reference', type: 'string', default: '' },
			{ displayName: 'Schema', name: 'schema', type: 'string', default: '' },
		],
	},
];
