// Mirrors apps/admin-api/src/common/enums/jobs/*.enum.ts
export const WORK_TYPE_VALUES = ['ON_SITE', 'HYBRID', 'REMOTE', 'FIELD_BASED'];

export const SECTOR_VALUES = [
    'PRODUCTION', 'QUALITY_ASSURANCE', 'QUALITY_CONTROL', 'REGULATORY_AFFAIRS',
    'PHARMACOVIGILANCE', 'CLINICAL_RESEARCH', 'MEDICAL_AFFAIRS', 'SALES_MARKETING',
    'WAREHOUSE', 'SUPPLY_CHAIN', 'COMMUNITY_PHARMACY', 'HOSPITAL_PHARMACY',
    'ACADEMIA', 'MANUFACTURING', 'FORMULATION_DEVELOPMENT', 'VALIDATION',
    'MICROBIOLOGY', 'BIOTECHNOLOGY', 'HOSPITALITY', 'GOVERNMENT', 'NGO',
];

export const JOB_STATUS_VALUES = ['DRAFT', 'ACTIVE', 'INACTIVE', 'CLOSED'];

/**
 * @typedef {Object} Job
 * @property {string} id
 * @property {string} title
 * @property {string} company
 * @property {string} city
 * @property {string} qualification
 * @property {string} experience
 * @property {string} jobFunction
 * @property {string} workType
 * @property {string} sector
 * @property {string} status
 * @property {string} jobDescription
 */

/**
 * @typedef {Object} JobListParams
 * @property {number} [page]
 * @property {number} [limit]
 */

export {};
