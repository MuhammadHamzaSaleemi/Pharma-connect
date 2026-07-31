// Mirrors apps/admin-api/src/common/enums/scholarships/scholarship-status.enum.ts
export const SCHOLARSHIP_STATUS_VALUES = ['DRAFT', 'ACTIVE', 'INACTIVE', 'EXPIRED'];

/**
 * @typedef {Object} Scholarship
 * @property {string} id
 * @property {string} image
 * @property {string} country
 * @property {string} status
 * @property {string} startDate
 * @property {string} endDate
 * @property {string} eligibilityCriteria
 * @property {string} financialBenefits
 * @property {string} howToApply
 */

/**
 * @typedef {Object} ScholarshipListParams
 * @property {number} [page]
 * @property {number} [limit]
 */

export {};
