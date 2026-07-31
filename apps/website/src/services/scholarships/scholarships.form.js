import { enumToOptions } from "../../lib/enumOptions";
import { COUNTRY_OPTIONS } from "../../lib/countries";
import { SCHOLARSHIP_STATUS_VALUES } from "./scholarships.types";

export const scholarshipFormFields = [
    { name: 'image', label: 'Image', type: 'image', required: true, colSpan: 'full' },
    { name: 'country', label: 'Country', type: 'searchselect', required: true, colSpan: 'half', options: COUNTRY_OPTIONS, placeholder: 'Search country...' },
    { name: 'status', label: 'Status', type: 'select', colSpan: 'half', options: enumToOptions(SCHOLARSHIP_STATUS_VALUES) },
    { name: 'startDate', label: 'Start Date', type: 'date', required: true, colSpan: 'half' },
    { name: 'endDate', label: 'End Date', type: 'date', required: true, colSpan: 'half' },
    { name: 'eligibilityCriteria', label: 'Eligibility Criteria', type: 'textarea', required: true, colSpan: 'full', rows: 4, placeholder: 'Minimum GPA of 3.5, pharmacy or related discipline' },
    { name: 'financialBenefits', label: 'Financial Benefits', type: 'richtext', required: true, colSpan: 'full', placeholder: 'Describe the financial support provided...' },
    { name: 'howToApply', label: 'How to Apply', type: 'richtext', required: true, colSpan: 'full', placeholder: 'Explain the application process...' },
];

export const scholarshipFormInitialValues = {
    status: 'DRAFT',
};
