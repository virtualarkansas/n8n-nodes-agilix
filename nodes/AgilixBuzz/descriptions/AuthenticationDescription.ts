import type { INodeProperties } from 'n8n-workflow';

export const authenticationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['authentication'] } },
		options: [
			{ name: 'Extend Session', value: 'extendSession', description: 'Extend the current session', action: 'Extend session' },
			{ name: 'Force Password Change', value: 'forcePasswordChange', description: 'Force user to change password', action: 'Force password change' },
			{ name: 'Get Password Login Attempt History', value: 'getPasswordLoginAttemptHistory', description: 'Get login attempt history', action: 'Get password login attempt history' },
			{ name: 'Get Password Policy', value: 'getPasswordPolicy', description: 'Get password policy', action: 'Get password policy' },
			{ name: 'Get Password Question', value: 'getPasswordQuestion', description: 'Get password security question', action: 'Get password question' },
			{ name: 'Proxy', value: 'proxy', description: 'Impersonate a user', action: 'Proxy user' },
			{ name: 'Reset Lockout', value: 'resetLockout', description: 'Clear account lockout', action: 'Reset lockout' },
			{ name: 'Reset Password', value: 'resetPassword', description: 'Reset user password', action: 'Reset password' },
			{ name: 'Unproxy', value: 'unproxy', description: 'End user impersonation', action: 'Unproxy user' },
			{ name: 'Update Password', value: 'updatePassword', description: 'Update user password', action: 'Update password' },
			{ name: 'Update Password Question/Answer', value: 'updatePasswordQuestionAnswer', description: 'Update security question', action: 'Update password question answer' },
		],
		default: 'extendSession',
	},
];

export const authenticationFields: INodeProperties[] = [
	// ── Force Password Change ─────────────────────────────────────────────
	{
		displayName: 'User ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['authentication'], operation: ['forcePasswordChange'] } },
	},

	// ── Get Password Login Attempt History ────────────────────────────────
	{
		displayName: 'User ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['authentication'], operation: ['getPasswordLoginAttemptHistory'] } },
	},
	{
		displayName: 'Earliest Record to Return',
		name: 'earliestrecordtoreturn',
		type: 'dateTime',
		default: '',
		displayOptions: { show: { resource: ['authentication'], operation: ['getPasswordLoginAttemptHistory'] } },
	},

	// ── Get Password Policy ───────────────────────────────────────────────
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['authentication'], operation: ['getPasswordPolicy'] } },
		options: [
			{ displayName: 'Domain ID', name: 'domainid', type: 'string', default: '' },
			{ displayName: 'Bypass Cache', name: 'bypasscache', type: 'boolean', default: false },
		],
	},

	// ── Get Password Question ─────────────────────────────────────────────
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['authentication'], operation: ['getPasswordQuestion'] } },
	},

	// ── Proxy ─────────────────────────────────────────────────────────────
	{
		displayName: 'User ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['authentication'], operation: ['proxy'] } },
	},

	// ── Reset Lockout ─────────────────────────────────────────────────────
	{
		displayName: 'User ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['authentication'], operation: ['resetLockout'] } },
	},

	// ── Reset Password ────────────────────────────────────────────────────
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['authentication'], operation: ['resetPassword'] } },
	},
	{
		displayName: 'Security Answer',
		name: 'answer',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['authentication'], operation: ['resetPassword'] } },
	},

	// ── Update Password ───────────────────────────────────────────────────
	{
		displayName: 'User ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['authentication'], operation: ['updatePassword'] } },
	},
	{
		displayName: 'New Password',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['authentication'], operation: ['updatePassword'] } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['authentication'], operation: ['updatePassword'] } },
		options: [
			{ displayName: 'Token', name: 'token', type: 'string', default: '' },
			{ displayName: 'Old Password', name: 'oldpassword', type: 'string', typeOptions: { password: true }, default: '' },
		],
	},

	// ── Update Password Question/Answer ───────────────────────────────────
	{
		displayName: 'User ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['authentication'], operation: ['updatePasswordQuestionAnswer'] } },
	},
	{
		displayName: 'Password Question',
		name: 'passwordquestion',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['authentication'], operation: ['updatePasswordQuestionAnswer'] } },
	},
	{
		displayName: 'Password Answer',
		name: 'passwordanswer',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['authentication'], operation: ['updatePasswordQuestionAnswer'] } },
	},
	{
		displayName: 'Old Password',
		name: 'oldpassword',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		displayOptions: { show: { resource: ['authentication'], operation: ['updatePasswordQuestionAnswer'] } },
	},
];
