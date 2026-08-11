import type { INodeProperties } from 'n8n-workflow';
import {
	commonFilterOptions,
	dateFilterOptions,
	filtersCollection,
	paginationProperties,
	queryFilter,
} from '../shared';

const show = { resource: ['investor'] };
const showSearch = { ...show, operation: ['search'] };

export const investorDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search investors',
				description: 'Search VCs, angels and other investors with filtering and pagination',
				routing: {
					request: { method: 'GET', url: '/signals/investors' },
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }],
					},
				},
			},
		],
		default: 'search',
	},
	...paginationProperties(showSearch),
	filtersCollection(showSearch, [
		...commonFilterOptions([
			{ name: 'Created At', value: 'created_at' },
			{ name: 'Name', value: 'name' },
			{ name: 'Ticket Size Max', value: 'ticket_size_max' },
			{ name: 'Ticket Size Min', value: 'ticket_size_min' },
		]),
		...dateFilterOptions(),
		queryFilter('Categories', 'categories', 'Pipe-separated industry labels the investor focuses on'),
		queryFilter('Headquarters', 'headquarters', 'Investor headquarters location'),
		{
			displayName: 'Ticket Size Min',
			name: 'ticket_size_min',
			type: 'number',
			default: 0,
			description: 'Minimum typical cheque size',
			routing: { send: { type: 'query', property: 'ticket_size_min' } },
		},
		{
			displayName: 'Ticket Size Max',
			name: 'ticket_size_max',
			type: 'number',
			default: 0,
			description: 'Maximum typical cheque size',
			routing: { send: { type: 'query', property: 'ticket_size_max' } },
		},
		{
			displayName: 'Type',
			name: 'type',
			type: 'multiOptions',
			options: [
				{ name: 'Accelerator', value: 'accelerator' },
				{ name: 'Angel', value: 'angel' },
				{ name: 'Corporate', value: 'corporate' },
				{ name: 'Crowdfunding', value: 'crowdfunding' },
				{ name: 'Family Office', value: 'family_office' },
				{ name: 'Government', value: 'government' },
				{ name: 'Hedge Fund', value: 'hedge_fund' },
				{ name: 'Private Equity', value: 'pe' },
				{ name: 'Venture Capital', value: 'vc' },
			],
			default: [],
			description: 'Filter by investor type',
			routing: { send: { type: 'query', property: 'type', value: '={{ $value.join(",") }}' } },
		},
	]),
];
