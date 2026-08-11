import type { INodeProperties } from 'n8n-workflow';
import {
	commonFilterOptions,
	filtersCollection,
	paginationProperties,
	queryFilter,
} from '../shared';

const show = { resource: ['company'] };
const showSearch = { ...show, operation: ['search'] };

export const companyDescription: INodeProperties[] = [
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
				action: 'Search companies',
				description: 'Browse and search companies with filtering and pagination',
				routing: {
					request: { method: 'GET', url: '/companies' },
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }],
					},
				},
			},
			{
				name: 'Count',
				value: 'count',
				action: 'Count companies',
				description: 'Return only the total count for a filter set. Costs 0 credits.',
				routing: {
					request: { method: 'GET', url: '/companies', qs: { count: 'true' } },
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'pagination' } }],
					},
				},
			},
		],
		default: 'search',
	},
	...paginationProperties(showSearch),
	filtersCollection({ ...show, operation: ['search', 'count'] }, [
		...commonFilterOptions([
			{ name: 'Created At', value: 'created_at' },
			{ name: 'Employee Count', value: 'employee_count' },
			{ name: 'Founded Year', value: 'founded_year' },
			{ name: 'Name', value: 'name' },
		]),
		queryFilter('Categories', 'categories', 'Pipe-separated industry labels, e.g. Software Development|Financial Services'),
		queryFilter('Domain', 'domain', 'Company website domain, e.g. novartis.com. Strict match.'),
		queryFilter('Industry', 'industry', 'Comma-separated exact industry names'),
		queryFilter('LinkedIn URL', 'linkedin_url', 'LinkedIn company URL, e.g. linkedin.com/company/novartis. Strict match.'),
		queryFilter('Subcategories', 'subcategories', 'Comma-separated Signalbase subcategory IDs, e.g. ai,fintech,saas'),
		{
			displayName: 'Employee Count Min',
			name: 'employee_count_min',
			type: 'number',
			default: 0,
			description: 'Minimum company employee count',
			routing: { send: { type: 'query', property: 'employee_count_min' } },
		},
		{
			displayName: 'Employee Count Max',
			name: 'employee_count_max',
			type: 'number',
			default: 0,
			description: 'Maximum company employee count',
			routing: { send: { type: 'query', property: 'employee_count_max' } },
		},
		{
			displayName: 'Founded Year Min',
			name: 'founded_year_min',
			type: 'number',
			default: 0,
			description: 'Minimum company founded year',
			routing: { send: { type: 'query', property: 'founded_year_min' } },
		},
		{
			displayName: 'Founded Year Max',
			name: 'founded_year_max',
			type: 'number',
			default: 0,
			description: 'Maximum company founded year',
			routing: { send: { type: 'query', property: 'founded_year_max' } },
		},
	]),
];
