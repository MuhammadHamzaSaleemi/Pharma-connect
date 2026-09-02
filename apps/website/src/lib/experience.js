// Experience filter. Job.experience is free text, consistently "N-M years"
// (e.g. "0-2 years", "3-5 years"). Each option is a half-open [min, max) year
// band; a job is placed in one band by its MINIMUM required years, so the bands
// don't overlap (a "3-5 years" job lands in 3-5, never in 1-3).
export const EXPERIENCE_OPTIONS = [
    { value: '0-1', label: '0 - 1 years', range: [0, 1] },
    { value: '1-3', label: '1 - 3 years', range: [1, 3] },
    { value: '3-5', label: '3 - 5 years', range: [3, 5] },
    { value: '5+', label: '5+ years', range: [5, Infinity] },
];

// Pull the year numbers out of the job's experience string. "3-5 years" -> [3, 5],
// "2 years" -> [2, 2], nothing parseable -> null.
function jobRange(experience) {
    const nums = String(experience ?? '').match(/\d+/g);
    if (!nums) return null;
    const a = Number(nums[0]);
    const b = nums[1] != null ? Number(nums[1]) : a;
    return [Math.min(a, b), Math.max(a, b)];
}

export function experienceMatches(experience, optionValue) {
    if (!optionValue) return true;
    const option = EXPERIENCE_OPTIONS.find((o) => o.value === optionValue);
    if (!option) return true;
    const jr = jobRange(experience);
    if (!jr) return false;
    const jMin = jr[0]; // the job's minimum required years decides its band
    const [oMin, oMax] = option.range;
    return jMin >= oMin && jMin < oMax; // half-open: 3 belongs to 3-5, not 1-3
}
