// Country -> cities map for the Jobs filter's dependent dropdowns.
//
// Curated to the markets this pharma job board actually recruits in. To cover
// every country, replace COUNTRY_CITIES below with a map derived from the
// `country-state-city` package (City.getCitiesOfCountry) — nothing else here
// changes, the helpers just read the keys/values.
export const COUNTRY_CITIES = {
    Pakistan: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Hyderabad', 'Sialkot'],
    'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Al Ain', 'Ras Al Khaimah', 'Fujairah'],
    'Saudi Arabia': ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 'Khobar', 'Tabuk'],
    Qatar: ['Doha', 'Al Rayyan', 'Al Wakrah', 'Al Khor'],
    Oman: ['Muscat', 'Salalah', 'Sohar', 'Nizwa'],
    Bahrain: ['Manama', 'Riffa', 'Muharraq'],
    Kuwait: ['Kuwait City', 'Hawalli', 'Salmiya', 'Ahmadi'],
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Boston', 'San Francisco', 'Philadelphia', 'San Diego', 'Raleigh'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Cambridge', 'Leeds', 'Glasgow', 'Nottingham'],
    Canada: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa', 'Mississauga'],
    Australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    Germany: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Leverkusen'],
    India: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Pune', 'Chennai'],
};

// react-select option lists. Countries are the map keys; cities come from the
// selected country (empty array => caller disables the City dropdown).
export const COUNTRY_OPTIONS = Object.keys(COUNTRY_CITIES).map((name) => ({ value: name, label: name }));

export function cityOptionsFor(country) {
    return (COUNTRY_CITIES[country] ?? []).map((name) => ({ value: name, label: name }));
}
