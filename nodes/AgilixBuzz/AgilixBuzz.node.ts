import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import {
	agilixApiRequest,
	agilixApiBulkRequest,
	agilixApiRequestBinary,
	getSessionDomainId,
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
	gradebookOperations,
	gradebookFields,
	itemOperations,
	itemFields,
	submissionOperations,
	submissionFields,
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
					{ name: 'Gradebook', value: 'gradebook' },
					{ name: 'Item', value: 'item' },
					{ name: 'Report', value: 'report' },
					{ name: 'Resource', value: 'resource' },
					{ name: 'Right', value: 'right' },
					{ name: 'Submission', value: 'submission' },
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
			...gradebookOperations,
			...itemOperations,
			...submissionOperations,
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
			...gradebookFields,
			...itemFields,
			...submissionFields,
		],
	};

	methods = {
		loadOptions: {
			async getDomains(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const domainId = await getSessionDomainId(this);
					if (!domainId) return [];

					// Get the user's own domain info
					const selfResp = await agilixApiRequest.call(this, 'GET', 'getdomain2', {}, { domainid: domainId });
					const selfDomain = (selfResp.response as IDataObject)?.domain as IDataObject | undefined;

					// List child domains (with descendants)
					const response = await agilixApiRequest.call(this, 'GET', 'listdomains', {}, {
						domainid: domainId,
						limit: '0',
						includedescendantdomains: 'true',
					});
					const resp = response.response as IDataObject;
					let domains = (resp?.domains as IDataObject)?.domain;
					if (!domains) domains = [];
					if (!Array.isArray(domains)) domains = [domains];

					const options: INodePropertyOptions[] = [];

					// Add the user's own domain first
					if (selfDomain) {
						options.push({
							name: `${selfDomain.name} (${selfDomain.id})`,
							value: selfDomain.id as string,
						});
					}

					// Add child domains
					for (const d of domains as IDataObject[]) {
						const id = d.id as string;
						if (id === domainId) continue; // skip if already added
						options.push({
							name: `${d.name} (${id})`,
							value: id,
						});
					}

					return options;
				} catch {
					return [];
				}
			},
		},
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
				} else if (resource === 'gradebook') {
					responseData = await executeGradebook.call(this, operation, i);
				} else if (resource === 'item') {
					responseData = await executeItem.call(this, operation, i);
				} else if (resource === 'submission') {
					const packagetype = operation === 'getStudentSubmission'
						? (this.getNodeParameter('packagetype', i) as string)
						: '';
					if (operation === 'getStudentSubmission' && packagetype !== 'data') {
						// Binary download (file or zip)
						const qs: IDataObject = {
							enrollmentid: this.getNodeParameter('enrollmentid', i) as string,
							itemid: this.getNodeParameter('itemid', i) as string,
							packagetype,
							...stripEmpty(getAdditional(this, i)),
						};
						if (qs.inline !== undefined) qs.inline = String(qs.inline);
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
						const { body, contentType, fileName } = await agilixApiRequestBinary.call(
							this, 'getstudentsubmission', qs,
						);
						const binaryData = await this.helpers.prepareBinaryData(body, fileName, contentType);
						returnData.push({
							json: { fileName, mimeType: contentType, fileSize: body.length },
							binary: { [binaryPropertyName]: binaryData },
							pairedItem: { item: i },
						});
						continue;
					}
					responseData = await executeSubmission.call(this, operation, i);
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
		for (const p of ['includedescendantdomains', 'byday', 'bymonth', 'byyear']) {
			if (qs[p] !== undefined) qs[p] = String(qs[p]);
		}
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
		const additional = stripEmpty(getAdditional(this, i));
		const qs: IDataObject = {
			domainid: this.getNodeParameter('domainid', i) as string,
			...additional,
		};
		// Convert boolean params to strings
		for (const p of ['includedescendantdomains', 'byday', 'bymonth', 'byyear']) {
			if (qs[p] !== undefined) qs[p] = String(qs[p]);
		}
		if (returnAll) {
			qs.limit = '0';
		} else {
			qs.limit = String(this.getNodeParameter('limit', i));
		}
		const response = await agilixApiRequest.call(this, 'GET', 'listusers', {}, qs);
		const resp = response.response as IDataObject;
		let items = (resp?.users as IDataObject)?.user;
		if (!items) items = [];
		if (!Array.isArray(items)) items = [items];
		return items as IDataObject[];
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

	if (operation === 'list') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const qs: IDataObject = {
			domainid: this.getNodeParameter('domainid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		if (qs.includedescendantdomains !== undefined) qs.includedescendantdomains = String(qs.includedescendantdomains);
		if (returnAll) {
			qs.limit = '0';
		} else {
			qs.limit = String(this.getNodeParameter('limit', i));
		}
		const response = await agilixApiRequest.call(this, 'GET', 'listcourses', {}, qs);
		const resp = response.response as IDataObject;
		let items = (resp?.courses as IDataObject)?.course;
		if (!items) items = [];
		if (!Array.isArray(items)) items = [items];
		return items as IDataObject[];
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
		if (qs.includedescendantdomains !== undefined) qs.includedescendantdomains = String(qs.includedescendantdomains);
		if (returnAll) {
			qs.limit = '0';
		} else {
			qs.limit = String(this.getNodeParameter('limit', i));
		}
		const response = await agilixApiRequest.call(this, 'GET', 'listenrollments', {}, qs);
		const resp = response.response as IDataObject;
		let items = (resp?.enrollments as IDataObject)?.enrollment;
		if (!items) items = [];
		if (!Array.isArray(items)) items = [items];
		return items as IDataObject[];
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
		const response = await agilixApiRequest.call(this, 'GET', 'getdomaincontent');
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
		if (qs.includedescendantdomains !== undefined) qs.includedescendantdomains = String(qs.includedescendantdomains);
		if (returnAll) {
			qs.limit = '0';
		} else {
			qs.limit = String(this.getNodeParameter('limit', i));
		}
		const response = await agilixApiRequest.call(this, 'GET', 'listdomains', {}, qs);
		const resp = response.response as IDataObject;
		let items = (resp?.domains as IDataObject)?.domain;
		if (!items) items = [];
		if (!Array.isArray(items)) items = [items];
		return items as IDataObject[];
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
		const response = await agilixApiRequest.call(this, 'POST', 'extendsession');
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
		const body: IDataObject = { userid: this.getNodeParameter('userid', i) as string };
		const response = await agilixApiRequest.call(this, 'POST', 'proxy', body);
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
		const response = await agilixApiRequest.call(this, 'POST', 'unproxy');
		return extractResponse(response);
	}

	if (operation === 'updatePassword') {
		const body: IDataObject = {
			userid: this.getNodeParameter('userid', i) as string,
			password: this.getNodeParameter('password', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'POST', 'updatepassword', body);
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

	if (operation === 'sendMail') {
		const enrollmentid = this.getNodeParameter('enrollmentid', i) as string;
		const recipientIds = (this.getNodeParameter('recipientEnrollmentIds', i) as string)
			.split(',')
			.map((id: string) => ({ id: id.trim() }));
		const subject = this.getNodeParameter('subject', i) as string;
		const bodyText = this.getNodeParameter('body', i) as string;

		const qs: IDataObject = { enrollmentid };
		const body: IDataObject = {
			email: {
				enrollments: { enrollment: recipientIds },
				subject: { $value: subject },
				body: { $value: bodyText },
			},
		};
		const response = await agilixApiRequest.call(this, 'POST', 'sendmail', body, qs);
		return extractResponse(response);
	}

	throw new NodeOperationError(this.getNode(), `Unknown general operation: ${operation}`, { itemIndex: i });
}

async function executeGradebook(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	const boolToString = (qs: IDataObject, keys: string[]) => {
		for (const k of keys) {
			if (qs[k] !== undefined) qs[k] = String(qs[k]);
		}
	};

	if (operation === 'getEnrollmentGradebook') {
		const qs: IDataObject = {
			enrollmentid: this.getNodeParameter('enrollmentid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		boolToString(qs, ['zerounscored', 'forcerequireditems', 'scorm']);
		const response = await agilixApiRequest.call(this, 'GET', 'getenrollmentgradebook2', {}, qs);
		const resp = response.response as IDataObject;
		return (resp?.enrollment as IDataObject) ?? {};
	}

	if (operation === 'getEntityGradebook') {
		const qs: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		boolToString(qs, ['allstatus', 'zerounscored', 'forcerequireditems', 'scorm']);
		const response = await agilixApiRequest.call(this, 'GET', 'getentitygradebook3', {}, qs);
		const resp = response.response as IDataObject;
		let items = (resp?.enrollments as IDataObject)?.enrollment;
		if (!items) items = [];
		if (!Array.isArray(items)) items = [items];
		return items as IDataObject[];
	}

	if (operation === 'getUserGradebook') {
		const qs: IDataObject = {
			userid: this.getNodeParameter('userid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		boolToString(qs, ['allstatus', 'zerounscored', 'forcerequireditems', 'scorm']);
		const response = await agilixApiRequest.call(this, 'GET', 'getusergradebook2', {}, qs);
		const resp = response.response as IDataObject;
		let items = (resp?.enrollments as IDataObject)?.enrollment;
		if (!items) items = [];
		if (!Array.isArray(items)) items = [items];
		return items as IDataObject[];
	}

	if (operation === 'getGrade') {
		const qs: IDataObject = {
			enrollmentid: this.getNodeParameter('enrollmentid', i) as string,
			itemid: this.getNodeParameter('itemid', i) as string,
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getgrade', {}, qs);
		const resp = response.response as IDataObject;
		return (resp?.grade as IDataObject) ?? {};
	}

	if (operation === 'getGradeHistory') {
		const qs: IDataObject = {
			enrollmentid: this.getNodeParameter('enrollmentid', i) as string,
			itemid: this.getNodeParameter('itemid', i) as string,
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getgradehistory', {}, qs);
		const resp = response.response as IDataObject;
		let items = (resp?.grades as IDataObject)?.grade;
		if (!items) items = [];
		if (!Array.isArray(items)) items = [items];
		return items as IDataObject[];
	}

	if (operation === 'getGradebookList') {
		const qs: IDataObject = stripEmpty(getAdditional(this, i));
		const response = await agilixApiRequest.call(this, 'GET', 'getgradebooklist', {}, qs);
		const resp = response.response as IDataObject;
		let items = (resp?.gradebooks as IDataObject)?.gradebook;
		if (!items) items = [];
		if (!Array.isArray(items)) items = [items];
		return items as IDataObject[];
	}

	if (operation === 'getGradebookWeights') {
		const qs: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
		};
		const periodid = this.getNodeParameter('periodid', i, '') as string;
		if (periodid) qs.periodid = periodid;
		const response = await agilixApiRequest.call(this, 'GET', 'getgradebookweights', {}, qs);
		const resp = response.response as IDataObject;
		return (resp?.weights as IDataObject) ?? {};
	}

	if (operation === 'getGradebookSummary') {
		const qs: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		boolToString(qs, ['allstatus', 'zerounscored', 'forcerequireditems']);
		const response = await agilixApiRequest.call(this, 'GET', 'getentitygradebooksummary', {}, qs);
		const resp = response.response as IDataObject;
		return (resp?.summary as IDataObject) ?? {};
	}

	throw new NodeOperationError(this.getNode(), `Unknown gradebook operation: ${operation}`, { itemIndex: i });
}

async function executeItem(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'list') {
		const qs: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		if (qs.allversions !== undefined) qs.allversions = String(qs.allversions);
		const response = await agilixApiRequest.call(this, 'GET', 'getitemlist', {}, qs);
		const resp = response.response as IDataObject;
		let items = (resp?.items as IDataObject)?.item;
		if (!items) items = [];
		if (!Array.isArray(items)) items = [items];
		return items as IDataObject[];
	}

	if (operation === 'get') {
		const qs: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			itemid: this.getNodeParameter('itemid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		if (qs.embedmaster !== undefined) qs.embedmaster = String(qs.embedmaster);
		const response = await agilixApiRequest.call(this, 'GET', 'getitem', {}, qs);
		const resp = response.response as IDataObject;
		return (resp?.item as IDataObject) ?? {};
	}

	if (operation === 'getInfo') {
		const body: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			itemid: this.getNodeParameter('itemid', i) as string,
		};
		const response = await agilixApiBulkRequest.call(this, 'getiteminfo', [body], 'item');
		return extractResponse(response);
	}

	if (operation === 'create') {
		const body: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			itemid: this.getNodeParameter('itemid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiBulkRequest.call(this, 'putitems', [body], 'item');
		return extractResponse(response);
	}

	if (operation === 'delete') {
		const body: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			itemid: this.getNodeParameter('itemid', i) as string,
		};
		const cascade = this.getNodeParameter('cascade', i, false) as boolean;
		const queryParams: IDataObject = {};
		if (cascade) queryParams.cascade = 'true';
		const response = await agilixApiBulkRequest.call(this, 'deleteitems', [body], 'item', queryParams);
		return extractResponse(response);
	}

	if (operation === 'restore') {
		const body: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			itemid: this.getNodeParameter('itemid', i) as string,
		};
		const version = this.getNodeParameter('version', i, 0) as number;
		if (version) body.version = String(version);
		const response = await agilixApiBulkRequest.call(this, 'restoreitems', [body], 'item');
		return extractResponse(response);
	}

	if (operation === 'copy') {
		const body: IDataObject = {
			sourceentityid: this.getNodeParameter('sourceentityid', i) as string,
			sourceitemid: this.getNodeParameter('sourceitemid', i) as string,
			destinationentityid: this.getNodeParameter('destinationentityid', i) as string,
			destinationitemid: this.getNodeParameter('destinationitemid', i) as string,
		};
		const deep = this.getNodeParameter('deep', i, false) as boolean;
		if (deep) body.deep = 'true';
		const response = await agilixApiBulkRequest.call(this, 'copyitems', [body], 'item');
		return extractResponse(response);
	}

	if (operation === 'assign') {
		const qs: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			itemid: this.getNodeParameter('itemid', i) as string,
			folderid: this.getNodeParameter('folderid', i) as string,
		};
		const sequence = this.getNodeParameter('sequence', i, 0) as number;
		if (sequence) qs.sequence = String(sequence);
		const response = await agilixApiRequest.call(this, 'POST', 'assignitem', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'unassign') {
		const qs: IDataObject = {
			entityid: this.getNodeParameter('entityid', i) as string,
			itemid: this.getNodeParameter('itemid', i) as string,
		};
		const response = await agilixApiRequest.call(this, 'POST', 'unassignitem', {}, qs);
		return extractResponse(response);
	}

	throw new NodeOperationError(this.getNode(), `Unknown item operation: ${operation}`, { itemIndex: i });
}

async function executeSubmission(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getStudentSubmission') {
		const qs: IDataObject = {
			enrollmentid: this.getNodeParameter('enrollmentid', i) as string,
			itemid: this.getNodeParameter('itemid', i) as string,
			packagetype: this.getNodeParameter('packagetype', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		if (qs.inline !== undefined) qs.inline = String(qs.inline);
		const response = await agilixApiRequest.call(this, 'GET', 'getstudentsubmission', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getStudentSubmissionHistory') {
		const qs: IDataObject = {
			enrollmentid: this.getNodeParameter('enrollmentid', i) as string,
			itemid: this.getNodeParameter('itemid', i) as string,
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getstudentsubmissionhistory', {}, qs);
		const resp = response.response as IDataObject;
		let items = (resp?.submissions as IDataObject)?.submission;
		if (!items) items = [];
		if (!Array.isArray(items)) items = [items];
		return items as IDataObject[];
	}

	if (operation === 'getStudentSubmissionInfo') {
		const body: IDataObject = {
			enrollmentid: this.getNodeParameter('enrollmentid', i) as string,
			itemid: this.getNodeParameter('itemid', i) as string,
		};
		const response = await agilixApiBulkRequest.call(this, 'getstudentsubmissioninfo', [body], 'submission');
		return extractResponse(response);
	}

	if (operation === 'putStudentSubmission') {
		const qs: IDataObject = {
			enrollmentid: this.getNodeParameter('enrollmentid', i) as string,
			itemid: this.getNodeParameter('itemid', i) as string,
		};
		const recordactivity = this.getNodeParameter('recordactivity', i, false) as boolean;
		if (recordactivity) qs.recordactivity = 'true';
		const submissionDataStr = this.getNodeParameter('submissionData', i) as string;
		let submissionBody: IDataObject;
		try {
			submissionBody = JSON.parse(submissionDataStr) as IDataObject;
		} catch {
			throw new NodeOperationError(this.getNode(), 'Submission Data must be valid JSON', { itemIndex: i });
		}
		const response = await agilixApiRequest.call(this, 'POST', 'putstudentsubmission', submissionBody, qs);
		const resp = response.response as IDataObject;
		return (resp?.submission as IDataObject) ?? resp ?? {};
	}

	if (operation === 'getSubmissionState') {
		const qs: IDataObject = {
			enrollmentid: this.getNodeParameter('enrollmentid', i) as string,
			itemid: this.getNodeParameter('itemid', i) as string,
			utcoffset: String(this.getNodeParameter('utcoffset', i)),
		};
		const createifempty = this.getNodeParameter('createifempty', i, false) as boolean;
		if (createifempty) qs.createifempty = 'true';
		const response = await agilixApiRequest.call(this, 'GET', 'getsubmissionstate', {}, qs);
		const resp = response.response as IDataObject;
		return (resp?.submissionstate as IDataObject) ?? {};
	}

	if (operation === 'getAttemptReview') {
		const qs: IDataObject = {
			enrollmentid: this.getNodeParameter('enrollmentid', i) as string,
			itemid: this.getNodeParameter('itemid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		if (qs.forviewing !== undefined) qs.forviewing = String(qs.forviewing);
		const response = await agilixApiRequest.call(this, 'GET', 'getattemptreview', {}, qs);
		return extractResponse(response);
	}

	if (operation === 'getAttempt') {
		const qs: IDataObject = {
			enrollmentid: this.getNodeParameter('enrollmentid', i) as string,
			itemid: this.getNodeParameter('itemid', i) as string,
			...stripEmpty(getAdditional(this, i)),
		};
		const response = await agilixApiRequest.call(this, 'GET', 'getattempt', {}, qs);
		return extractResponse(response);
	}

	throw new NodeOperationError(this.getNode(), `Unknown submission operation: ${operation}`, { itemIndex: i });
}
