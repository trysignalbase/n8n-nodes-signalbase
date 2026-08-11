import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SignalbaseApi implements ICredentialType {
	name = 'signalbaseApi';

	displayName = 'Signalbase API';

	icon = 'file:../nodes/Signalbase/signalbase.svg' as Icon;

	documentationUrl = 'https://github.com/trysignalbase/n8n-nodes-signalbase?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description:
				'Your Signalbase API key. Generate one at https://www.trysignalbase.com/workspace/api.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	// Hiring signals in count mode cost 0 credits, so testing a credential
	// never consumes the user's balance.
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://www.trysignalbase.com/api/v2',
			url: '/signals/hiring',
			qs: {
				count: 'true',
				limit: 1,
			},
		},
	};
}
