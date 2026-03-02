import type { INodeProperties } from 'n8n-workflow';

export const submissionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['submission'] } },
		options: [
			{ name: 'Get Attempt', value: 'getAttempt', description: 'Get attempt data for taking/editing', action: 'Get attempt' },
			{ name: 'Get Attempt Review', value: 'getAttemptReview', description: 'Get attempt review with answers and feedback', action: 'Get attempt review' },
			{ name: 'Get Student Submission', value: 'getStudentSubmission', description: 'Download student submission as binary data', action: 'Get student submission' },
			{ name: 'Get Student Submission History', value: 'getStudentSubmissionHistory', description: 'Get submission history for an enrollment item', action: 'Get student submission history' },
			{ name: 'Get Student Submission Info', value: 'getStudentSubmissionInfo', description: 'Get submission metadata', action: 'Get student submission info' },
			{ name: 'Get Submission State', value: 'getSubmissionState', description: 'Get current submission state (can start/retake/continue)', action: 'Get submission state' },
			{ name: 'Put Student Submission', value: 'putStudentSubmission', description: 'Submit or update a student submission', action: 'Put student submission' },
		],
		default: 'getStudentSubmissionHistory',
	},
];

export const submissionFields: INodeProperties[] = [
	// ── Get Student Submission ────────────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['submission'], operation: ['getStudentSubmission'] } },
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['submission'], operation: ['getStudentSubmission'] } },
	},
	{
		displayName: 'Package Type',
		name: 'packagetype',
		type: 'options',
		required: true,
		default: 'data',
		displayOptions: { show: { resource: ['submission'], operation: ['getStudentSubmission'] } },
		options: [
			{ name: 'Data (JSON)', value: 'data' },
			{ name: 'File', value: 'file' },
			{ name: 'Zip', value: 'zip' },
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['submission'], operation: ['getStudentSubmission'] } },
		options: [
			{ displayName: 'File Path', name: 'filepath', type: 'string', default: '', description: 'Path within submission (when packagetype=file)' },
			{ displayName: 'Inline', name: 'inline', type: 'boolean', default: false, description: 'Whether to return content inline' },
			{ displayName: 'Version', name: 'version', type: 'number', default: 0 },
		],
	},

	// ── Get Student Submission History ────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['submission'], operation: ['getStudentSubmissionHistory'] } },
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['submission'], operation: ['getStudentSubmissionHistory'] } },
	},

	// ── Get Student Submission Info ───────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['submission'], operation: ['getStudentSubmissionInfo'] } },
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['submission'], operation: ['getStudentSubmissionInfo'] } },
	},

	// ── Put Student Submission ────────────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['submission'], operation: ['putStudentSubmission'] } },
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['submission'], operation: ['putStudentSubmission'] } },
	},
	{
		displayName: 'Submission Data (JSON)',
		name: 'submissionData',
		type: 'string',
		required: true,
		default: '{}',
		displayOptions: { show: { resource: ['submission'], operation: ['putStudentSubmission'] } },
		description: 'JSON submission data to send as the request body',
	},
	{
		displayName: 'Record Activity',
		name: 'recordactivity',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['submission'], operation: ['putStudentSubmission'] } },
	},

	// ── Get Submission State ─────────────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['submission'], operation: ['getSubmissionState'] } },
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['submission'], operation: ['getSubmissionState'] } },
	},
	{
		displayName: 'UTC Offset (minutes)',
		name: 'utcoffset',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['submission'], operation: ['getSubmissionState'] } },
		description: 'Minutes from GMT (e.g., -360 for US Central = GMT-6)',
	},
	{
		displayName: 'Create If Empty',
		name: 'createifempty',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['submission'], operation: ['getSubmissionState'] } },
	},

	// ── Get Attempt Review ───────────────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['submission'], operation: ['getAttemptReview'] } },
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['submission'], operation: ['getAttemptReview'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['submission'], operation: ['getAttemptReview'] } },
		options: [
			{ displayName: 'For Viewing', name: 'forviewing', type: 'boolean', default: false },
			{ displayName: 'Group ID', name: 'groupid', type: 'string', default: '' },
			{ displayName: 'Response Version', name: 'responseversion', type: 'number', default: 0 },
			{ displayName: 'Submission Version', name: 'submissionversion', type: 'number', default: 0 },
		],
	},

	// ── Get Attempt ──────────────────────────────────────────────────────
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['submission'], operation: ['getAttempt'] } },
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['submission'], operation: ['getAttempt'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['submission'], operation: ['getAttempt'] } },
		options: [
			{ displayName: 'Group ID', name: 'groupid', type: 'string', default: '' },
			{ displayName: 'Password', name: 'password', type: 'string', default: '' },
			{ displayName: 'Question ID', name: 'questionid', type: 'string', default: '', description: 'Pipe-separated list of question IDs' },
			{ displayName: 'UTC Offset', name: 'utcoffset', type: 'number', default: 0, description: 'Minutes from GMT' },
		],
	},
];
