import type { INodeProperties } from 'n8n-workflow';

/**
 * Relative date shorthands accepted by the Signalbase API.
 * Takes precedence over dateFrom/dateTo when both are provided.
 */
export const datePresetOptions = [
	{ name: 'Last 14 Days', value: 'last_14d' },
	{ name: 'Last 2 Years', value: 'last_2y' },
	{ name: 'Last 30 Days', value: 'last_30d' },
	{ name: 'Last 6 Months', value: 'last_6m' },
	{ name: 'Last 60 Days', value: 'last_60d' },
	{ name: 'Last 7 Days', value: 'last_7d' },
	{ name: 'Last 90 Days', value: 'last_90d' },
	{ name: 'Last Month', value: 'last_month' },
	{ name: 'Last Quarter', value: 'last_quarter' },
	{ name: 'Last Week', value: 'last_week' },
	{ name: 'Last Year', value: 'last_1y' },
	{ name: 'Previous Year', value: 'last_year' },
	{ name: 'This Month', value: 'this_month' },
	{ name: 'This Quarter', value: 'this_quarter' },
	{ name: 'This Week', value: 'this_week' },
	{ name: 'This Year', value: 'this_year' },
	{ name: 'Today', value: 'today' },
	{ name: 'Yesterday', value: 'yesterday' },
];

/**
 * Signalbase paginates with `page` + `limit` (1-indexed) and reports
 * `pagination.hasNextPage` in the response envelope.
 */
export function paginationProperties(show: Record<string, string[]>): INodeProperties[] {
	return [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			displayOptions: { show },
			default: false,
			description: 'Whether to return all results or only up to a given limit',
			routing: {
				send: { paginate: '={{ $value }}' },
				operations: {
					pagination: {
						type: 'generic',
						properties: {
							continue: '={{ $response.body?.pagination?.hasNextPage === true }}',
							request: {
								qs: {
									page: '={{ $pageCount + 1 }}',
								},
							},
						},
					},
				},
			},
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			displayOptions: { show: { ...show, returnAll: [false] } },
			typeOptions: { minValue: 1, maxValue: 100 },
			default: 50,
			description: 'Max number of results to return',
			routing: {
				send: { type: 'query', property: 'limit' },
				output: { maxResults: '={{$value}}' },
			},
		},
	];
}

const queryFilter = (
	displayName: string,
	name: string,
	description: string,
	extra: Partial<INodeProperties> = {},
): INodeProperties => ({
	displayName,
	name,
	type: 'string',
	default: '',
	description,
	routing: { send: { type: 'query', property: name } },
	...extra,
});

/** Filters accepted by every searchable Signalbase resource. */
export function commonFilterOptions(
	sortByOptions: Array<{ name: string; value: string }>,
): INodeProperties[] {
	return [
		queryFilter(
			'Countries',
			'countries',
			'Comma-separated ISO 3166-1 alpha-2 country codes, e.g. US,GB,DE. Region shortcuts CEE, WE, NORDICS, NA and LATAM are also accepted.',
		),
		queryFilter(
			'Exclude Countries',
			'exclude_countries',
			'Comma-separated country names or codes to exclude, e.g. CN',
		),
		queryFilter('Search', 'search', 'Free-text search across the resource'),
		{
			displayName: 'Sort By',
			name: 'sort_by',
			type: 'options',
			// Empty default means "not set" inside a Filters collection, so the
			// API's own default ordering applies unless the user picks a field.
			default: '',
			options: sortByOptions,
			description: 'Field to sort results by',
			routing: { send: { type: 'query', property: 'sort_by' } },
		},
		{
			displayName: 'Sort Order',
			name: 'sort_order',
			type: 'options',
			options: [
				{ name: 'Ascending', value: 'asc' },
				{ name: 'Descending', value: 'desc' },
			],
			default: 'desc',
			description: 'Sort direction',
			routing: { send: { type: 'query', property: 'sort_order' } },
		},
	];
}

/** Date filters, shared by every resource except Company. */
export function dateFilterOptions(): INodeProperties[] {
	return [
		{
			displayName: 'Date Preset',
			name: 'date_preset',
			type: 'options',
			options: datePresetOptions,
			default: 'last_30d',
			description:
				'Relative date range. Takes precedence over Date From / Date To when both are set.',
			routing: { send: { type: 'query', property: 'date_preset' } },
		},
		{
			displayName: 'Date From',
			name: 'dateFrom',
			type: 'dateTime',
			default: '',
			description: 'Filter signals from this date',
			routing: {
				send: { type: 'query', property: 'dateFrom', value: '={{ $value.split("T")[0] }}' },
			},
		},
		{
			displayName: 'Date To',
			name: 'dateTo',
			type: 'dateTime',
			default: '',
			description: 'Filter signals up to this date',
			routing: {
				send: { type: 'query', property: 'dateTo', value: '={{ $value.split("T")[0] }}' },
			},
		},
	];
}

/** Company-matching filters, shared by the four signal resources. */
export function companyMatchFilterOptions(): INodeProperties[] {
	return [
		queryFilter(
			'Company Domain',
			'company_domain',
			'Company website domain, e.g. novartis.com. Strict match — recommended over Company Name.',
		),
		queryFilter(
			'Company LinkedIn URL',
			'company_linkedin_url',
			'LinkedIn company URL, e.g. linkedin.com/company/novartis. Strict match — recommended over Company Name.',
		),
		queryFilter('Company Name', 'company_name', 'Company name (fuzzy partial match)'),
	];
}

/** Builds the "Filters" collection shown for a search operation. */
export function filtersCollection(
	show: Record<string, string[]>,
	options: INodeProperties[],
): INodeProperties {
	return {
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show },
		options: options.sort((a, b) => a.displayName.localeCompare(b.displayName)),
	};
}

export { queryFilter };
