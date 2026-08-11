import type { INodeProperties } from 'n8n-workflow';
import {
	commonFilterOptions,
	companyMatchFilterOptions,
	dateFilterOptions,
	filtersCollection,
	paginationProperties,
	queryFilter,
} from '../shared';

const show = { resource: ['acquisition'] };
const showSearch = { ...show, operation: ['search'] };

export const acquisitionDescription: INodeProperties[] = [
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
				action: 'Search acquisition signals',
				description: 'Search M&A activity with filtering and pagination',
				routing: {
					request: { method: 'GET', url: '/signals/acquisitions' },
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
			{ name: 'Occurred At', value: 'occurred_at' },
		]),
		...dateFilterOptions(),
		...companyMatchFilterOptions(),
		{
			displayName: 'Amount Min',
			name: 'amount_min',
			type: 'number',
			default: 0,
			description: 'Minimum deal amount in whole units of the deal currency (not cents)',
			routing: { send: { type: 'query', property: 'amount_min' } },
		},
		{
			displayName: 'Amount Max',
			name: 'amount_max',
			type: 'number',
			default: 0,
			description: 'Maximum deal amount in whole units of the deal currency (not cents)',
			routing: { send: { type: 'query', property: 'amount_max' } },
		},
		queryFilter('Acquirer Countries', 'acquirer_countries', 'Comma-separated country codes for the acquiring company'),
		queryFilter('Acquiring Company', 'acquiring_company', 'Acquiring company name (partial match)'),
		queryFilter('Categories', 'categories', 'Pipe-separated industry labels, e.g. Software Development|Financial Services'),
		queryFilter('Currency', 'currency', 'ISO 4217 currency code, e.g. USD. Exact match, not a converter.'),
		queryFilter('Exclude Acquirer Countries', 'exclude_acquirer_countries', 'Comma-separated acquirer country codes to exclude'),
		queryFilter('Industry', 'industry', 'Comma-separated exact industry names'),
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
