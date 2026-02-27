import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import {
	agilixApiRequest,
	agilixApiBulkRequest,
	agilixApiRequestAllItems,
} from './GenericFunctions';

import {
	userOperations,
	userFields,
	courseOperations,
	courseFields,
	enrollmentOperations,
	enrollmentFields,
	domainOperations,
	domainFields,
	authenticationOperations,
	authenticationFields,
	reportOperations,
	reportFields,
	resourceOperations,
	resourceFields,
	rightOperations,
	rightFields,
	generalOperations,
	generalFields,
	libraryOperations,
	libraryFields,
} from './descriptions';

export class AgilixBuzz implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Agilix Buzz',
		name: 'agilixBuzz',
		icon: 'file:agilixbuzz.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Agilix Buzz LMS API',
		defaults: {
			name: 'Agilix Buzz',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'agilixBuzzApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Authentication', value: 'authentication' },
					{ name: 'Course', value: 'course' },
					{ name: 'Domain', value: 'domain' },
					{ name: 'Enrollment', value: 'enrollment' },
					{ name: 'General', value: 'general' },
					{ name: 'Library', value: 'library' },
					{ name: 'Report', value: 'report' },
					{ name: 'Resource', value: 'resource' },
					{ name: 'Right', value: 'right' },
					{ name: 'User', value: 'user' },
				],
				default: 'user',
			},
			// Operations
			...userOperations,
			...courseOperations,
			...enrollmentOperations,
			...domainOperations,
			...authenticationOperations,
			...reportOperations,
			...resourceOperations,
			...rightOperations,
			...generalOperations,
			...libraryOperations,
			// Fields
			...userFields,
			...courseFields,
			...enrollmentFields,
			...domainFields,
			...authenticationFields,
			...reportFields,
			...resourceFields,
			...rightFields,
			...generalFields,
			...libraryFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];

				if (resource === 'user') {
					responseData = await executeUser.call(this, operation, i);
				} else if (resource === 'course') {
					responseData = await executeCourse.call(this, operation, i);
				} else if (resource === 'enrollment') {
					responseData = await executeEnrollment.call(this, operation, i);
				} else if (resource === 'domain') {
					responseData = await executeDomain.call(this, operation, i);
				} else if (resource === 'authentication') {
					responseData = await executeAuthentication.call(this, operation, i);
				} else if (resource === 'report') {
					responseData = await executeReport.call(this, operation, i);
				} else if (resource === 'resource') {
					responseData = await executeResource.call(this, operation, i);
				} else if (resource === 'right') {
					responseData = await executeRight.call(this, operation, i);
				} else if (resource === 'general') {
					responseData = await executeGeneral.call(this, operation, i);
				} else if (resource === 'library') {
					responseData = await executeLibrary.call(this, operation, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, { itemIndex: i });
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getAdditional(ctx: IExecuteFunctions, i: number, field = 'additionalFields'): IDataObject {
	try {
		return ctx.getNodeParameter(field, i, {}) as IDataObject;
	} catch {
		return {};
	}
}

function stripEmpty(obj: IDataObject): IDataObject {
	const result: IDataObject = {};
	for (const [key, value] of Object.entries(obj)) {
		if (value !== '' && value !== undefined && value !== null) {
			result[key] = value;
		}
	}
	return result;
}

function extractResponse(response: IDataObject): IDataObject {
	return (response.response as IDataObject) ?? response;
}

// ── Resource Executors ───────────────────────────────────────────────────────

async function executeUser(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const body: IDataObject = {
			domainid: this.getNodeParameter('domainid', i) as string,
			username: this.getNodeParameter('username', i) as string,
			email: this.getNodeParameter('email', i) as string,
			password: this.getNodeParameter('password', i) as string,
			firstname: this.getNodeParameter('firstname', i) as string,
			lastname: this.getNodeParameter('lastname', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiBulkRequest.call(this, 'createusers2', [body], 'user');
		return extractResponse(response);
	}

	if (operation === 'delete') {
		const userid = this.getNodeParameter('userid', i) as string;
		const response = await agilixApiBulkRequest.call(this, 'deleteusers', [{ userid }], 'user');
		return extractResponse(response);
	}

	if (operation === 'get') {
		const qs: IDataObject = { userid: this.getNodeParameter('userid', i) as string };
		const select = this.getNodeParameter('select', i, '') as string;
		if (select) qs.select = select;
		const response = await agilixApiRequest.call(this, 'GET', 'getuser2', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getActiveCount') {
		const qs: IDataObject = {
			domainid: this.getNodeParameter('domainid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getactiveusercount', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getActivity') {
		const qs: IDataObject = {
			userid: this.getNodeParameter('userid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getuseractivity', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getActivityStream') {
		const qs: IDataObject = {
			userid: this.getNodeParameter('userid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getuseractivitystream', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getDomainActivity') {
		const qs: IDataObject = {
			domainid: this.getNodeParameter('domainid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getdomainactivity', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getProfilePicture') {
		const qs: IDataObject = { entityid: this.getNodeParameter('entityid', i) as string };
		const def = this.getNodeParameter('default', i, '') as string;
		if (def) qs.default = def;
		const response = await agilixApiRequest.call(this, 'GET', 'getprofilepicture', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'list') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const qs: IDataObject = {
			domainid: this.getNodeParameter('domainid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		if (returnAll) {
			return await agilixApiRequestAllItems.call(this, 'GET', 'listusers', 'user', {}, qs);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await agilixApiRequestAllItems.call(this, 'GET', 'listusers', 'user', {}, qs, limit);
	}

	if (operation === 'restore') {
		const qs: IDataObject = { userid: this.getNodeParameter('userid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'restoreuser', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'update') {
		const body: IDataObject = {
			userid: this.getNodeParameter('userid', i) as string,
			...stripEmpty(getAdditional(this, i, 'updateFields')),
		};
		const response = await agilixApiBulkRequest.call(this, 'updateusers', [body], 'user');
		return extractResponse(response);
	}

	throw new NodeOperationError(this.getNode(), `Unknown user operation: ${operation}`, { itemIndex: i });
}

async function executeCourse(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'copy') {
		const body: IDataObject = {
			courseid: this.getNodeParameter('courseid', i) as string,
			domainid: this.getNodeParameter('domainid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiBulkRequest.call(this, 'copycourses', [body], 'course');
		return extractResponse(response);
	}

	if (operation === 'create') {
		const body: IDataObject = {
			title: this.getNodeParameter('title', i) as string,
			domainid: this.getNodeParameter('domainid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		if (!body.schema) body.schema = '3';
		const response = await agilixApiBulkRequest.call(this, 'createcourses', [body], 'course');
		return extractResponse(response);
	}

	if (operation === 'createDemo') {
		const qs: IDataObject = {
			courseid: this.getNodeParameter('courseid', i) as string,
			domainid: this.getNodeParameter('domainid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'POST', 'createdemocourse', qs);
		return extractResponse(response);
	}

	if (operation === 'deactivate') {
		const qs: IDataObject = { courseid: this.getNodeParameter('courseid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'deactivatecourse', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'delete') {
		const body: IDataObject = { courseid: this.getNodeParameter('courseid', i) as string };
		const response = await agilixApiBulkRequest.call(this, 'deletecourses', [body], 'course');
		return extractResponse(response);
	}

	if (operation === 'get') {
		const qs: IDataObject = {
			courseid: this.getNodeParameter('courseid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getcourse2', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getHistory') {
		const qs: IDataObject = { courseid: this.getNodeParameter('courseid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'getcoursehistory', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'list') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const qs: IDataObject = {
			domainid: this.getNodeParameter('domainid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		if (returnAll) {
			return await agilixApiRequestAllItems.call(this, 'GET', 'listcourses', 'course', {}, qs);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await agilixApiRequestAllItems.call(this, 'GET', 'listcourses', 'course', {}, qs, limit);
	}

	if (operation === 'merge') {
		const body: IDataObject = { courseid: this.getNodeParameter('courseid', i) as string };
		const response = await agilixApiBulkRequest.call(this, 'mergecourses', [body], 'course');
		return extractResponse(response);
	}

	if (operation === 'restore') {
		const qs: IDataObject = { courseid: this.getNodeParameter('courseid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'restorecourse', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'update') {
		const body: IDataObject = {
			courseid: this.getNodeParameter('courseid', i) as string,
			...stripEmpty(getAdditional(this, i, 'updateFields')),
		};
		const response = await agilixApiBulkRequest.call(this, 'updatecourses', [body], 'course');
		return extractResponse(response);
	}

	throw new NodeOperationError(this.getNode(), `Unknown course operation: ${operation}`, { itemIndex: i });
}

async function executeEnrollment(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const additional = stripEmpty(getAdditional(this, i));
		const body: IDataObject = {
			userid: this.getNodeParameter('userid', i) as string,
			entityid: this.getNodeParameter('entityid', i) as string,
			...additional,
		};
		if (!body.status) body.status = '1';
		const queryParams: IDataObject = {};
		if (additional.disallowduplicates) {
			queryParams.disallowduplicates = 'true';
			delete body.disallowduplicates;
		}
		const response = await agilixApiBulkRequest.call(this, 'createenrollments', [body], 'enrollment', queryParams);
		return extractResponse(response);
	}

	if (operation === 'delete') {
		const body: IDataObject = { enrollmentid: this.getNodeParameter('enrollmentid', i) as string };
		const response = await agilixApiBulkRequest.call(this, 'deleteenrollments', [body], 'enrollment');
		return extractResponse(response);
	}

	if (operation === 'get') {
		const qs: IDataObject = { enrollmentid: this.getNodeParameter('enrollmentid', i) as string };
		const select = this.getNodeParameter('select', i, '') as string;
		if (select) qs.select = select;
		const response = await agilixApiRequest.call(this, 'GET', 'getenrollment3', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getActivity') {
		const qs: IDataObject = {
			enrollmentid: this.getNodeParameter('enrollmentid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getenrollmentactivity', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getGradebook') {
		const qs: IDataObject = {
			enrollmentid: this.getNodeParameter('enrollmentid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getenrollmentgradebook2', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getGroupList') {
		const qs: IDataObject = { enrollmentid: this.getNodeParameter('enrollmentid', i) as string };
		const setid = this.getNodeParameter('setid', i, '') as string;
		if (setid) qs.setid = setid;
		const response = await agilixApiRequest.call(this, 'GET', 'getenrollmentgrouplist', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getMetricsReport') {
		const qs: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			report: this.getNodeParameter('report', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getenrollmentmetricsreport', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'list') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const qs: IDataObject = {
			domainid: this.getNodeParameter('domainid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		if (returnAll) {
			return await agilixApiRequestAllItems.call(this, 'GET', 'listenrollments', 'enrollment', {}, qs);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await agilixApiRequestAllItems.call(this, 'GET', 'listenrollments', 'enrollment', {}, qs, limit);
	}

	if (operation === 'listByTeacher') {
		const qs: IDataObject = stripEmpty(getAdditional(this, i));
		const response = await agilixApiRequest.call(this, 'GET', 'listenrollmentsbyteacher', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'listEntity') {
		const qs: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'listentityenrollments', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'listUser') {
		const qs: IDataObject = {
			userid: this.getNodeParameter('userid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'listuserenrollments', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'putSelfAssessment') {
		const qs: IDataObject = {
			enrollmentid: this.getNodeParameter('enrollmentid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'putselfassessment', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'restore') {
		const qs: IDataObject = { enrollmentid: this.getNodeParameter('enrollmentid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'restoreenrollment', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'update') {
		const body: IDataObject = {
			enrollmentid: this.getNodeParameter('enrollmentid', i) as string,
			...stripEmpty(getAdditional(this, i, 'updateFields')),
		};
		const response = await agilixApiBulkRequest.call(this, 'updateenrollments', [body], 'enrollment');
		return extractResponse(response);
	}

	throw new NodeOperationError(this.getNode(), `Unknown enrollment operation: ${operation}`, { itemIndex: i });
}

async function executeDomain(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const body: IDataObject = {
			name: this.getNodeParameter('name', i) as string,
			userspace: this.getNodeParameter('userspace', i) as string,
			parentid: this.getNodeParameter('parentid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiBulkRequest.call(this, 'createdomains', [body], 'domain');
		return extractResponse(response);
	}

	if (operation === 'delete') {
		const qs: IDataObject = { domainid: this.getNodeParameter('domainid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'deletedomain', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'get') {
		const qs: IDataObject = { domainid: this.getNodeParameter('domainid', i) as string };
		const select = this.getNodeParameter('select', i, '') as string;
		if (select) qs.select = select;
		const response = await agilixApiRequest.call(this, 'GET', 'getdomain2', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getContent') {
		const qs: IDataObject = { domainid: this.getNodeParameter('domainid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'getdomaincontent', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getEnrollmentMetrics') {
		const qs: IDataObject = { domainid: this.getNodeParameter('domainid', i) as string };
		const skipempty = this.getNodeParameter('skipempty', i, false) as boolean;
		if (skipempty) qs.skipempty = 'true';
		const response = await agilixApiRequest.call(this, 'GET', 'getdomainenrollmentmetrics', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getParentList') {
		const qs: IDataObject = { domainid: this.getNodeParameter('domainid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'getdomainparentlist', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getSettings') {
		const qs: IDataObject = {
			domainid: this.getNodeParameter('domainid', i) as string,
			path: this.getNodeParameter('path', i) as string,
		};
		const includesource = this.getNodeParameter('includesource', i, false) as boolean;
		if (includesource) qs.includesource = 'true';
		const response = await agilixApiRequest.call(this, 'GET', 'getdomainsettings', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getStats') {
		const qs: IDataObject = {
			domainid: this.getNodeParameter('domainid', i) as string,
			options: String(this.getNodeParameter('options', i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getdomainstats', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'list') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const qs: IDataObject = {
			domainid: this.getNodeParameter('domainid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		if (returnAll) {
			return await agilixApiRequestAllItems.call(this, 'GET', 'listdomains', 'domain', {}, qs);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await agilixApiRequestAllItems.call(this, 'GET', 'listdomains', 'domain', {}, qs, limit);
	}

	if (operation === 'restore') {
		const qs: IDataObject = { domainid: this.getNodeParameter('domainid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'restoredomain', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'update') {
		const body: IDataObject = {
			domainid: this.getNodeParameter('domainid', i) as string,
			...stripEmpty(getAdditional(this, i, 'updateFields')),
		};
		const response = await agilixApiBulkRequest.call(this, 'updatedomains', [body], 'domain');
		return extractResponse(response);
	}

	throw new NodeOperationError(this.getNode(), `Unknown domain operation: ${operation}`, { itemIndex: i });
}

async function executeAuthentication(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'extendSession') {
		const response = await agilixApiRequest.call(this, 'GET', 'extendsession');
		return extractResponse(response);
	}

	if (operation === 'forcePasswordChange') {
		const qs: IDataObject = { userid: this.getNodeParameter('userid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'forcepasswordchange', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getPasswordLoginAttemptHistory') {
		const qs: IDataObject = { userid: this.getNodeParameter('userid', i) as string };
		const earliest = this.getNodeParameter('earliestrecordtoreturn', i, '') as string;
		if (earliest) qs.earliestrecordtoreturn = earliest;
		const response = await agilixApiRequest.call(this, 'GET', 'getpasswordloginattempthistory', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getPasswordPolicy') {
		const qs: IDataObject = stripEmpty(getAdditional(this, i));
		const response = await agilixApiRequest.call(this, 'GET', 'getpasswordpolicy', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getPasswordQuestion') {
		const qs: IDataObject = { username: this.getNodeParameter('username', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'getpasswordquestion', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'proxy') {
		const qs: IDataObject = { userid: this.getNodeParameter('userid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'proxy', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'resetLockout') {
		const qs: IDataObject = { userid: this.getNodeParameter('userid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'resetlockout', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'resetPassword') {
		const qs: IDataObject = { username: this.getNodeParameter('username', i) as string };
		const answer = this.getNodeParameter('answer', i, '') as string;
		if (answer) qs.answer = answer;
		const response = await agilixApiRequest.call(this, 'GET', 'resetpassword', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'unproxy') {
		const qs: IDataObject = { userid: this.getNodeParameter('userid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'unproxy', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'updatePassword') {
		const qs: IDataObject = {
			userid: this.getNodeParameter('userid', i) as string,
			password: this.getNodeParameter('password', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'updatepassword', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'updatePasswordQuestionAnswer') {
		const qs: IDataObject = {
			userid: this.getNodeParameter('userid', i) as string,
			passwordquestion: this.getNodeParameter('passwordquestion', i) as string,
			passwordanswer: this.getNodeParameter('passwordanswer', i) as string,
		};
		const oldpassword = this.getNodeParameter('oldpassword', i, '') as string;
		if (oldpassword) qs.oldpassword = oldpassword;
		const response = await agilixApiRequest.call(this, 'POST', 'updatepasswordquestionanswer', qs);
		return extractResponse(response);
	}

	throw new NodeOperationError(this.getNode(), `Unknown authentication operation: ${operation}`, { itemIndex: i });
}

async function executeReport(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getInfo') {
		const qs: IDataObject = { reportid: this.getNodeParameter('reportid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'getreportinfo', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getReportList') {
		const qs: IDataObject = { domainid: this.getNodeParameter('domainid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'getreportlist', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getRunnableReportList') {
		const qs: IDataObject = stripEmpty(getAdditional(this, i));
		const response = await agilixApiRequest.call(this, 'GET', 'getrunnablereportlist', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'run') {
		const qs: IDataObject = {
			reportid: this.getNodeParameter('reportid', i) as string,
			entityid: this.getNodeParameter('entityid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'runreport', {}, qs);
		return extractResponse(response);
	}

	throw new NodeOperationError(this.getNode(), `Unknown report operation: ${operation}`, { itemIndex: i });
}

async function executeResource(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'copy') {
		const body: IDataObject = {
			sourceentityid: this.getNodeParameter('sourceentityid', i) as string,
			destinationentityid: this.getNodeParameter('destinationentityid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiBulkRequest.call(this, 'copyresources', [body], 'resource');
		return extractResponse(response);
	}

	if (operation === 'delete') {
		const body: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			path: this.getNodeParameter('path', i) as string,
		};
		const response = await agilixApiBulkRequest.call(this, 'deleteresources', [body], 'resource');
		return extractResponse(response);
	}

	if (operation === 'get') {
		const qs: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			path: this.getNodeParameter('path', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getresource', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getEntityResourceId') {
		const qs: IDataObject = { entityid: this.getNodeParameter('entityid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'getentityresourceid', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getInfo') {
		const qs: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			path: this.getNodeParameter('path', i) as string,
		};
		const response = await agilixApiRequest.call(this, 'POST', 'getresourceinfo2', qs);
		return extractResponse(response);
	}

	if (operation === 'list') {
		const qs: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getresourcelist2', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'listRestorable') {
		const qs: IDataObject = { entityid: this.getNodeParameter('entityid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'listrestorableresources', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'putFolders') {
		const body: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			path: this.getNodeParameter('path', i) as string,
		};
		const response = await agilixApiBulkRequest.call(this, 'putresourcefolders', [body], 'folder');
		return extractResponse(response);
	}

	if (operation === 'restore') {
		const body: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			path: this.getNodeParameter('path', i) as string,
		};
		const response = await agilixApiBulkRequest.call(this, 'restoreresources', [body], 'resource');
		return extractResponse(response);
	}

	throw new NodeOperationError(this.getNode(), `Unknown resource operation: ${operation}`, { itemIndex: i });
}

async function executeRight(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'createRole') {
		const body: IDataObject = {
			domainid: this.getNodeParameter('domainid', i) as string,
			name: this.getNodeParameter('name', i) as string,
			privileges: this.getNodeParameter('privileges', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'POST', 'createrole', body);
		return extractResponse(response);
	}

	if (operation === 'deleteRole') {
		const qs: IDataObject = { roleid: this.getNodeParameter('roleid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'deleterole', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'deleteSubscriptions') {
		const body: IDataObject = {
			subscriberid: this.getNodeParameter('subscriberid', i) as string,
			entityid: this.getNodeParameter('entityid', i) as string,
		};
		const response = await agilixApiBulkRequest.call(this, 'deletesubscriptions', [body], 'subscription');
		return extractResponse(response);
	}

	if (operation === 'getActorRights') {
		const qs: IDataObject = { actorid: this.getNodeParameter('actorid', i) as string };
		const entitytypes = this.getNodeParameter('entitytypes', i, '') as string;
		if (entitytypes) qs.entitytypes = entitytypes;
		const response = await agilixApiRequest.call(this, 'GET', 'getactorrights', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getEffectiveRights') {
		const qs: IDataObject = { entityid: this.getNodeParameter('entityid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'geteffectiverights', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getEntityRights') {
		const qs: IDataObject = { entityid: this.getNodeParameter('entityid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'getentityrights', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getPersonas') {
		const qs: IDataObject = stripEmpty(getAdditional(this, i));
		const response = await agilixApiRequest.call(this, 'GET', 'getpersonas', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getRights') {
		const qs: IDataObject = {
			actorid: this.getNodeParameter('actorid', i) as string,
			entityid: this.getNodeParameter('entityid', i) as string,
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getrights', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getRightsList') {
		const qs: IDataObject = stripEmpty(getAdditional(this, i));
		const response = await agilixApiRequest.call(this, 'GET', 'getrightslist', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getRole') {
		const qs: IDataObject = { roleid: this.getNodeParameter('roleid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'getrole', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getSubscriptionList') {
		const qs: IDataObject = { subscriberid: this.getNodeParameter('subscriberid', i) as string };
		const entityid = this.getNodeParameter('entityid', i, '') as string;
		if (entityid) qs.entityid = entityid;
		const response = await agilixApiRequest.call(this, 'GET', 'getsubscriptionlist', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'listRoles') {
		const qs: IDataObject = { domainid: this.getNodeParameter('domainid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'listroles', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'restoreRole') {
		const qs: IDataObject = { roleid: this.getNodeParameter('roleid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'restorerole', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'updateRights') {
		const body: IDataObject = {
			actorid: this.getNodeParameter('actorid', i) as string,
			entityid: this.getNodeParameter('entityid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiBulkRequest.call(this, 'updaterights', [body], 'right');
		return extractResponse(response);
	}

	if (operation === 'updateRole') {
		const body: IDataObject = {
			roleid: this.getNodeParameter('roleid', i) as string,
			...stripEmpty(getAdditional(this, i, 'updateFields')),
		};
		const response = await agilixApiRequest.call(this, 'POST', 'updaterole', body);
		return extractResponse(response);
	}

	if (operation === 'updateSubscriptions') {
		const body: IDataObject = {
			subscriberid: this.getNodeParameter('subscriberid', i) as string,
			entityid: this.getNodeParameter('entityid', i) as string,
			startdate: this.getNodeParameter('startdate', i) as string,
			enddate: this.getNodeParameter('enddate', i) as string,
		};
		const response = await agilixApiBulkRequest.call(this, 'updatesubscriptions', [body], 'subscription');
		return extractResponse(response);
	}

	throw new NodeOperationError(this.getNode(), `Unknown right operation: ${operation}`, { itemIndex: i });
}

async function executeGeneral(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'echo') {
		const data = this.getNodeParameter('data', i, '{}') as string;
		const body = typeof data === 'string' ? JSON.parse(data) : data;
		const response = await agilixApiRequest.call(this, 'POST', 'echo', body as IDataObject);
		return extractResponse(response);
	}

	if (operation === 'getCommandList') {
		const response = await agilixApiRequest.call(this, 'GET', 'getcommandlist');
		return extractResponse(response);
	}

	if (operation === 'getEntityType') {
		const qs: IDataObject = { entityid: this.getNodeParameter('entityid', i) as string };
		const response = await agilixApiRequest.call(this, 'GET', 'getentitytype', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getStatus') {
		const qs: IDataObject = stripEmpty(getAdditional(this, i));
		const response = await agilixApiRequest.call(this, 'GET', 'getstatus', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getUploadLimits') {
		const qs: IDataObject = stripEmpty(getAdditional(this, i));
		const response = await agilixApiRequest.call(this, 'GET', 'getuploadlimits', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'sendMail') {
		const body: IDataObject = {
			subject: this.getNodeParameter('subject', i) as string,
			body: this.getNodeParameter('body', i) as string,
			enrollment_ids: this.getNodeParameter('enrollment_ids', i) as string,
		};
		const response = await agilixApiRequest.call(this, 'POST', 'sendmail', body);
		return extractResponse(response);
	}

	throw new NodeOperationError(this.getNode(), `Unknown general operation: ${operation}`, { itemIndex: i });
}

async function executeLibrary(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'createPage') {
		const body: IDataObject = {
			domainid: this.getNodeParameter('domainid', i) as string,
			libraryid: this.getNodeParameter('libraryid', i) as string,
			title: this.getNodeParameter('title', i) as string,
			description: this.getNodeParameter('description', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'POST', 'createlibrarypage', body);
		return extractResponse(response);
	}

	if (operation === 'getPage') {
		const qs: IDataObject = {
			domainid: this.getNodeParameter('domainid', i) as string,
			pageid: this.getNodeParameter('pageid', i) as string,
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getlibrarypage', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'listPages') {
		const qs: IDataObject = {
			domainid: this.getNodeParameter('domainid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'listlibrarypages', {}, qs);
		return extractResponse(response);
	}

	throw new NodeOperationError(this.getNode(), `Unknown library operation: ${operation}`, { itemIndex: i });
}
