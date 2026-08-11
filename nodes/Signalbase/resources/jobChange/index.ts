import type { INodeProperties } from 'n8n-workflow';
import {
	commonFilterOptions,
	companyMatchFilterOptions,
	dateFilterOptions,
	filtersCollection,
	paginationProperties,
	queryFilter,
} from '../shared';

const show = { resource: ['jobChange'] };
const showSearch = { ...show, operation: ['search'] };

export const jobChangeDescription: INodeProperties[] = [
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
				action: 'Search job change signals',
				description: 'Search people who changed roles, with filtering and pagination',
				routing: {
					request: { method: 'GET', url: '/signals/job-changes' },
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
			{ name: 'Company Name', value: 'company_name' },
			{ name: 'Discovered At', value: 'discovered_at' },
			{ name: 'Occurred At', value: 'occurred_at' },
			{ name: 'Person Name', value: 'person_name' },
		]),
		...dateFilterOptions(),
		...companyMatchFilterOptions(),
		queryFilter('City', 'city', 'Free-text search on person city and location'),
		queryFilter('Departments', 'departments', 'Comma-separated departments, e.g. marketing,sales,engineering'),
		queryFilter('Keyword', 'keyword', 'Search by keyword tag (partial match)'),
		queryFilter('New Role', 'new_role', 'Search by new role or job title (partial match)'),
		queryFilter('Person LinkedIn URL', 'personLinkedinUrl', 'Exact LinkedIn profile URL of the person'),
		queryFilter('Positions', 'positions', 'Comma-separated positions, e.g. ceo,cto,head of product'),
		queryFilter('Seniorities', 'seniorities', 'Comma-separated seniority levels, e.g. founder,c_level,vp,director'),
		{
			displayName: 'Source',
			name: 'source',
			type: 'multiOptions',
			options: [
				{ name: 'LinkedIn', value: 'linkedin' },
				{ name: 'Other', value: 'other' },
				{ name: 'Press Release', value: 'press_release' },
			],
			default: [],
			description: 'Filter by the source the change was detected from',
			routing: { send: { type: 'query', property: 'source', value: '={{ $value.join(",") }}' } },
		},
	]),
];
