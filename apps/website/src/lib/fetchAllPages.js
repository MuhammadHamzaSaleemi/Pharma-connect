// Walks every page of a public list endpoint (the API caps `limit` at 100), so
// server-rendered listings and the sitemap never silently stop at 100 items.
// ponytail: loads the whole published set per request; fine while jobs expire after
// 21 days. Move filtering into the API (URL search params) if a list grows to thousands.
export async function fetchAllPages(api, params) {
    const items = [];
    for (let page = 1; ; page++) {
        const res = await api.list(undefined, { ...params, page, limit: 100 });
        items.push(...(res?.data ?? []));
        if (page >= (res?.meta?.totalPages ?? 1)) return items;
    }
}
