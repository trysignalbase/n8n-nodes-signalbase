import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { acquisitionDescription } from './resources/acquisition';
import { companyDescription } from './resources/company';
import { fundingDescription } from './resources/funding';
import { hiringDescription } from './resources/hiring';
import { investorDescription } from './resources/investor';
import { jobChangeDescription } from './resources/jobChange';

export class Signalbase implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Signalbase',
		name: 'signalbase',
		icon: { light: 'file:signalbase.svg', dark: 'file:signalbase.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Search real-time B2B buying signals from Signalbase',
		defaults: {
			name: 'Signalbase',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'signalbaseApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://www.trysignalbase.com/api/v2',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Acquisition Signal', value: 'acquisition' },
					{ name: 'Company', value: 'company' },
					{ name: 'Funding Signal', value: 'funding' },
					{ name: 'Hiring Signal', value: 'hiring' },
					{ name: 'Investor', value: 'investor' },
					{ name: 'Job Change Signal', value: 'jobChange' },
				],
				default: 'funding',
			},
			...acquisitionDescription,
			...companyDescription,
			...fundingDescription,
			...hiringDescription,
			...investorDescription,
			...jobChangeDescription,
		],
	};
}
