import { enumToOptions } from "../../lib/enumOptions";
import { WORK_TYPE_VALUES, SECTOR_VALUES, JOB_STATUS_VALUES } from "./jobs.types";

export const jobFormFields = [
    { name: 'title', label: 'Title', type: 'text', required: true, colSpan: 'half', placeholder: 'Production Pharmacist' },
    { name: 'company', label: 'Company', type: 'text', required: true, colSpan: 'half', placeholder: 'PharmaConnect Labs' },
    { name: 'city', label: 'City', type: 'text', required: true, colSpan: 'half', placeholder: 'Lahore' },
    { name: 'qualification', label: 'Qualification', type: 'text', required: true, colSpan: 'half', placeholder: 'PharmD / B.Pharm' },
    { name: 'experience', label: 'Experience', type: 'text', required: true, colSpan: 'half', placeholder: '2-4 years' },
    { name: 'jobFunction', label: 'Job Function', type: 'text', required: true, colSpan: 'half', placeholder: 'Production' },
    { name: 'workType', label: 'Work Type', type: 'select', required: true, colSpan: 'half', options: enumToOptions(WORK_TYPE_VALUES) },
    { name: 'sector', label: 'Sector', type: 'select', required: true, colSpan: 'half', options: enumToOptions(SECTOR_VALUES) },
    { name: 'status', label: 'Status', type: 'select', colSpan: 'half', options: enumToOptions(JOB_STATUS_VALUES) },
    { name: 'jobDescription', label: 'Job Description', type: 'richtext', required: true, colSpan: 'full', placeholder: 'Describe the role, responsibilities, and requirements...' },
];

export const jobFormInitialValues = {
    status: 'DRAFT',
};
