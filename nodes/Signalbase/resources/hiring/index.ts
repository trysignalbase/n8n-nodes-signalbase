import type { INodeProperties } from 'n8n-workflow';
import {
	commonFilterOptions,
	companyMatchFilterOptions,
	dateFilterOptions,
	filtersCollection,
	paginationProperties,
	queryFilter,
} from '../shared';

const show = { resource: ['hiring'] };
const showSearch = { ...show, operation: ['search'] };

export const hiringDescription: INodeProperties[] = [
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
				action: 'Search hiring signals',
				description: 'Search open job postings with filtering and pagination',
				routing: {
					request: { method: 'GET', url: '/signals/hiring' },
					output: {
						postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }],
					},
				},
			},
			{
				name: 'Count',
				value: 'count',
				action: 'Count hiring signals',
				description: 'Return only the total count for a filter set. Costs 0 credits.',
				routing: {
					request: { method: 'GET', url: '/signals/hiring', qs: { count: 'true' } },
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
			{ name: 'Company Name', value: 'company_name' },
			{ name: 'Created At', value: 'created_at' },
			{ name: 'Date Posted', value: 'date_posted' },
			{ name: 'Location', value: 'location' },
			{ name: 'Title', value: 'title' },
		]),
		...dateFilterOptions(),
		...companyMatchFilterOptions(),
		queryFilter('Applicants', 'applicants', 'Comma-separated applicant count ranges, e.g. 0-25,26-50,201-plus'),
		queryFilter('Categories', 'categories', 'Pipe-separated industry labels, e.g. Software Development|Financial Services'),
		queryFilter('City', 'city', 'Free-text search on city, location and region'),
		queryFilter('Company Countries', 'company_countries', 'Country codes matching the company HQ only, ignoring job listing location'),
		queryFilter('Departments', 'departments', 'Comma-separated departments, e.g. marketing,sales,engineering'),
		queryFilter('Description', 'description', 'Full-text search over the job description body only'),
		queryFilter('Job Countries', 'job_countries', 'Country codes matching the job listing location only, ignoring company HQ'),
		queryFilter('Positions', 'positions', 'Comma-separated positions, e.g. ceo,cto,head of product'),
		queryFilter('Seniorities', 'seniorities', 'Comma-separated seniority levels, e.g. founder,c_level,vp,director'),
		queryFilter('States', 'states', 'Comma-separated US state codes'),
		queryFilter('Subcategories', 'subcategories', 'Comma-separated Signalbase subcategory IDs, e.g. ai,fintech,saas'),
		queryFilter('Team Size', 'team_size', 'Comma-separated team size ranges, e.g. 1-10,11-50,1000-plus'),
	]),
];
