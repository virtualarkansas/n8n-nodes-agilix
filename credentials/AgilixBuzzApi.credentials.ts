import type {
	Icon,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AgilixBuzzApi implements ICredentialType {
	name = 'agilixBuzzApi';

	displayName = 'Agilix Buzz API';

	icon: Icon = 'file:../nodes/AgilixBuzz/agilixbuzz.svg';

	documentationUrl = 'https://api.agilixbuzz.com/docs/';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.agilixbuzz.com',
			placeholder: 'https://api.agilixbuzz.com',
			description: 'The base URL of your Agilix Buzz instance',
		},
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: '',
			placeholder: 'mydomain',
			description: 'The Agilix Buzz domain for authentication',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];
}
