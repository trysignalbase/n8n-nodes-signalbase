import type { INodeProperties } from 'n8n-workflow';
import {
	commonFilterOptions,
	companyMatchFilterOptions,
	dateFilterOptions,
	filtersCollection,
	paginationProperties,
	queryFilter,
} from '../shared';

const show = { resource: ['funding'] };
const showSearch = { ...show, operation: ['search'] };

export const fundingDescription: INodeProperties[] = [
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
				action: 'Search funding signals',
				description: 'Search funding rounds with filtering and pagination',
				routing: {
					request: { method: 'GET', url: '/signals/funding' },
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
			{ name: 'Amount', value: 'amount' },
			{ name: 'Discovered At', value: 'discovered_at' },
			{ name: 'Employee Count', value: 'employee_count' },
			{ name: 'Founded Year', value: 'founded_year' },
			{ name: 'Occurred At', value: 'occurred_at' },
		]),
		...dateFilterOptions(),
		...companyMatchFilterOptions(),
		{
			displayName: 'Amount Min',
			name: 'amount_min',
			type: 'number',
			default: 0,
			description: 'Minimum funding amount in whole units of the deal currency (not cents)',
			routing: { send: { type: 'query', property: 'amount_min' } },
		},
		{
			displayName: 'Amount Max',
			name: 'amount_max',
			type: 'number',
			default: 0,
			description: 'Maximum funding amount in whole units of the deal currency (not cents)',
			routing: { send: { type: 'query', property: 'amount_max' } },
		},
		queryFilter('Categories', 'categories', 'Pipe-separated industry labels, e.g. Software Development|Financial Services'),
		queryFilter('Currency', 'currency', 'ISO 4217 currency code, e.g. USD. Exact match, not a converter.'),
		queryFilter('Industry', 'industry', 'Comma-separated exact industry names'),
		queryFilter('Investor Name', 'investor_name', 'Investor name (partial match)'),
		queryFilter('Round', 'round', "Comma-separated round types, e.g. 'series a'. Case-insensitive."),
		queryFilter('Round Flavor', 'round_flavor', 'Comma-separated round flavors'),
		queryFilter('Subcategories', 'subcategories', 'Comma-separated Signalbase subcategory IDs, e.g. ai,fintech,saas'),
		{
			displayName: 'Verification Status',
			name: 'verification_status',
			type: 'multiOptions',
			options: [
				{ name: 'Pending', value: 'pending' },
				{ name: 'Unverified', value: 'unverified' },
				{ name: 'Verified', value: 'verified' },
			],
			default: [],
			description: 'Filter by verification status',
			routing: { send: { type: 'query', property: 'verification_status', value: '={{ $value.join(",") }}' } },
		},
	]),
];
