import type { INodeProperties } from 'n8n-workflow';

export const gradebookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['gradebook'] } },
		options: [
			{ name: 'Get Enrollment Gradebook', value: 'getEnrollmentGradebook', description: 'Get gradebook for a single enrollment', action: 'Get enrollment gradebook' },
			{ name: 'Get Entity Gradebook', value: 'getEntityGradebook', description: 'Get gradebook for a course/section/group', action: 'Get entity gradebook' },
			{ name: 'Get Grade', value: 'getGrade', description: 'Get a grade for an enrollment item', action: 'Get grade' },
			{ name: 'Get Grade History', value: 'getGradeHistory', description: 'Get grade history for an enrollment item', action: 'Get grade history' },
			{ name: 'Get Gradebook List', value: 'getGradebookList', description: 'List gradebooks', action: 'Get gradebook list' },
			{ name: 'Get Gradebook Summary', value: 'getGradebookSummary', description: 'Get gradebook summary for an entity', action: 'Get gradebook summary' },
			{ name: 'Get Gradebook Weights', value: 'getGradebookWeights', description: 'Get gradebook weights for a course', action: 'Get gradebook weights' },
			{ name: 'Get User Gradebook', value: 'getUserGradebook', description: 'Get gradebook for a user across enrollments', action: 'Get user gradebook' },
		],
		default: 'getEnrollmentGradebook',
	},
];

export const gradebookFields: INodeProperties[] = [
	// ── Get Enrollment Gradebook ──────────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['gradebook'], operation: ['getEnrollmentGradebook'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['gradebook'], operation: ['getEnrollmentGradebook'] } },
		options: [
			{ displayName: 'Force Required Items', name: 'forcerequireditems', type: 'boolean', default: false },
			{ displayName: 'Grading Scheme', name: 'gradingscheme', type: 'string', default: '' },
			{ displayName: 'Grading Scheme ID', name: 'gradingschemeid', type: 'string', default: '' },
			{ displayName: 'Item ID', name: 'itemid', type: 'string', default: '', description: 'Pipe-separated list of item IDs, or * for all gradable, ** for all' },
			{ displayName: 'SCORM', name: 'scorm', type: 'boolean', default: false },
			{ displayName: 'Zero Unscored', name: 'zerounscored', type: 'boolean', default: false },
		],
	},

	// ── Get Entity Gradebook ──────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['gradebook'], operation: ['getEntityGradebook'] } },
		description: 'Course ID, section ID, or group ID',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['gradebook'], operation: ['getEntityGradebook'] } },
		options: [
			{ displayName: 'All Status', name: 'allstatus', type: 'boolean', default: false },
			{ displayName: 'Enrollment IDs', name: 'enrollmentids', type: 'string', default: '', description: 'Pipe-separated list of enrollment IDs' },
			{ displayName: 'Force Required Items', name: 'forcerequireditems', type: 'boolean', default: false },
			{ displayName: 'Grading Scheme', name: 'gradingscheme', type: 'string', default: '' },
			{ displayName: 'Grading Scheme ID', name: 'gradingschemeid', type: 'string', default: '' },
			{ displayName: 'Item ID', name: 'itemid', type: 'string', default: '', description: 'Pipe-separated list or * / **' },
			{ displayName: 'SCORM', name: 'scorm', type: 'boolean', default: false },
			{ displayName: 'Select', name: 'select', type: 'string', default: '' },
			{ displayName: 'User ID', name: 'userid', type: 'string', default: '' },
			{ displayName: 'Zero Unscored', name: 'zerounscored', type: 'boolean', default: false },
		],
	},

	// ── Get User Gradebook ────────────────────────────────────────────────
	{
		displayName: 'User ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['gradebook'], operation: ['getUserGradebook'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['gradebook'], operation: ['getUserGradebook'] } },
		options: [
			{ displayName: 'All Status', name: 'allstatus', type: 'boolean', default: false },
			{ displayName: 'Entity ID', name: 'entityid', type: 'string', default: '' },
			{ displayName: 'Force Required Items', name: 'forcerequireditems', type: 'boolean', default: false },
			{ displayName: 'Grading Scheme', name: 'gradingscheme', type: 'string', default: '' },
			{ displayName: 'Grading Scheme ID', name: 'gradingschemeid', type: 'string', default: '' },
			{ displayName: 'Item ID', name: 'itemid', type: 'string', default: '' },
			{ displayName: 'SCORM', name: 'scorm', type: 'boolean', default: false },
			{ displayName: 'Zero Unscored', name: 'zerounscored', type: 'boolean', default: false },
		],
	},

	// ── Get Grade ─────────────────────────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['gradebook'], operation: ['getGrade'] } },
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['gradebook'], operation: ['getGrade'] } },
	},

	// ── Get Grade History ─────────────────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['gradebook'], operation: ['getGradeHistory'] } },
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['gradebook'], operation: ['getGradeHistory'] } },
	},

	// ── Get Gradebook List ────────────────────────────────────────────────
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['gradebook'], operation: ['getGradebookList'] } },
		options: [
			{ displayName: 'Domain ID', name: 'domainid', type: 'string', default: '' },
			{ displayName: 'Reference', name: 'reference', type: 'string', default: '' },
			{ displayName: 'Title', name: 'title', type: 'string', default: '', description: 'Title filter (supports * wildcard)' },
		],
	},

	// ── Get Gradebook Weights ─────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['gradebook'], operation: ['getGradebookWeights'] } },
	},
	{
		displayName: 'Period ID',
		name: 'periodid',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['gradebook'], operation: ['getGradebookWeights'] } },
	},

	// ── Get Gradebook Summary ─────────────────────────────────────────────
	{
		displayName: 'Entity ID',
		name: 'entityid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['gradebook'], operation: ['getGradebookSummary'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['gradebook'], operation: ['getGradebookSummary'] } },
		options: [
			{ displayName: 'All Status', name: 'allstatus', type: 'boolean', default: false },
			{ displayName: 'Days Active Past End', name: 'daysactivepastend', type: 'number', default: 0 },
			{ displayName: 'Enrollment IDs', name: 'enrollmentids', type: 'string', default: '', description: 'Pipe-separated list' },
			{ displayName: 'Force Required Items', name: 'forcerequireditems', type: 'boolean', default: false },
			{ displayName: 'Grading Scheme', name: 'gradingscheme', type: 'string', default: '' },
			{ displayName: 'Grading Scheme ID', name: 'gradingschemeid', type: 'string', default: '' },
			{ displayName: 'Item ID', name: 'itemid', type: 'string', default: '' },
			{ displayName: 'User ID', name: 'userid', type: 'string', default: '' },
			{ displayName: 'Zero Unscored', name: 'zerounscored', type: 'boolean', default: false },
		],
	},
];
