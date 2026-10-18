import {
  PrismaClient,
  JobStatus,
  JobWorkType,
  JobSector,
  ScholarshipStatus,
  BlogStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

// One entry per role; the generator below spreads them across companies, cities, statuses and
// dates so listing, search, filters, sorting and pagination all have something to work with.
type JobRole = {
  title: string;
  sector: JobSector;
  jobFunction: string;
  qualification: string;
  experience: string;
  workTypes: JobWorkType[];
  jobDescription: string;
};

const roles: JobRole[] = [
  {
    title: 'Production Pharmacist',
    sector: JobSector.PRODUCTION,
    jobFunction: 'Production',
    qualification: 'Pharm.D',
    experience: '2-4 years',
    workTypes: [JobWorkType.ON_SITE],
    jobDescription:
      'Oversee daily production operations, ensure GMP compliance, and coordinate with QA/QC teams to maintain product quality standards.',
  },
  {
    title: 'Production Manager',
    sector: JobSector.MANUFACTURING,
    jobFunction: 'Production',
    qualification: 'Pharm.D / B.Pharm',
    experience: '8-10 years',
    workTypes: [JobWorkType.ON_SITE],
    jobDescription:
      'Lead the solid and liquid dosage production departments, plan batch schedules, manage shift supervisors and drive OEE improvements.',
  },
  {
    title: 'Quality Assurance Officer',
    sector: JobSector.QUALITY_ASSURANCE,
    jobFunction: 'Quality Assurance',
    qualification: 'Pharm.D / B.Pharm',
    experience: '1-3 years',
    workTypes: [JobWorkType.ON_SITE],
    jobDescription:
      'Review batch records, conduct internal audits, and ensure adherence to SOPs and regulatory requirements across manufacturing lines.',
  },
  {
    title: 'QA Manager',
    sector: JobSector.QUALITY_ASSURANCE,
    jobFunction: 'Quality Assurance',
    qualification: 'Pharm.D / MPhil Pharmaceutics',
    experience: '7-10 years',
    workTypes: [JobWorkType.ON_SITE, JobWorkType.HYBRID],
    jobDescription:
      'Own the site quality management system, host DRAP and client audits, approve change controls and lead CAPA investigations.',
  },
  {
    title: 'Quality Control Analyst',
    sector: JobSector.QUALITY_CONTROL,
    jobFunction: 'Quality Control',
    qualification: 'Pharm.D / MSc Chemistry',
    experience: '0-2 years',
    workTypes: [JobWorkType.ON_SITE],
    jobDescription:
      'Perform HPLC, dissolution and wet-chemistry testing on raw materials and finished products, and document results per GLP.',
  },
  {
    title: 'Microbiologist',
    sector: JobSector.MICROBIOLOGY,
    jobFunction: 'Quality Control',
    qualification: 'MSc / MPhil Microbiology',
    experience: '2-4 years',
    workTypes: [JobWorkType.ON_SITE],
    jobDescription:
      'Run environmental monitoring, sterility and endotoxin testing, and support aseptic process simulations in the sterile area.',
  },
  {
    title: 'Validation Specialist',
    sector: JobSector.VALIDATION,
    jobFunction: 'Validation',
    qualification: 'Pharm.D / B.E Chemical',
    experience: '3-5 years',
    workTypes: [JobWorkType.ON_SITE],
    jobDescription:
      'Prepare and execute process, cleaning and equipment qualification protocols (IQ/OQ/PQ) and compile validation reports.',
  },
  {
    title: 'Formulation Scientist',
    sector: JobSector.FORMULATION_DEVELOPMENT,
    jobFunction: 'Research & Development',
    qualification: 'MPhil Pharmaceutics',
    experience: '3-6 years',
    workTypes: [JobWorkType.ON_SITE, JobWorkType.HYBRID],
    jobDescription:
      'Develop and scale up generic oral solid formulations, run pre-formulation studies and support technology transfer to production.',
  },
  {
    title: 'Regulatory Affairs Associate',
    sector: JobSector.REGULATORY_AFFAIRS,
    jobFunction: 'Regulatory Affairs',
    qualification: 'Pharm.D',
    experience: '2-5 years',
    workTypes: [JobWorkType.HYBRID, JobWorkType.REMOTE, JobWorkType.ON_SITE],
    jobDescription:
      'Prepare and submit drug registration dossiers, liaise with DRAP, and track regulatory changes affecting product portfolios.',
  },
  {
    title: 'Pharmacovigilance Executive',
    sector: JobSector.PHARMACOVIGILANCE,
    jobFunction: 'Pharmacovigilance',
    qualification: 'Pharm.D',
    experience: '1-3 years',
    workTypes: [JobWorkType.REMOTE, JobWorkType.HYBRID],
    jobDescription:
      'Process adverse event reports, perform causality assessment, and contribute to PSURs and signal detection activities.',
  },
  {
    title: 'Clinical Research Associate',
    sector: JobSector.CLINICAL_RESEARCH,
    jobFunction: 'Clinical Research',
    qualification: 'Pharm.D / MPhil Pharmacology',
    experience: '3-5 years',
    workTypes: [JobWorkType.FIELD_BASED],
    jobDescription:
      'Monitor clinical trial sites, verify source data, ensure ICH-GCP compliance, and support investigators throughout the study lifecycle.',
  },
  {
    title: 'Medical Science Liaison',
    sector: JobSector.MEDICAL_AFFAIRS,
    jobFunction: 'Medical Affairs',
    qualification: 'Pharm.D / MBBS',
    experience: '3-6 years',
    workTypes: [JobWorkType.FIELD_BASED, JobWorkType.HYBRID, JobWorkType.REMOTE],
    jobDescription:
      'Build scientific relationships with key opinion leaders, deliver product trainings and respond to unsolicited medical information requests.',
  },
  {
    title: 'Medical Sales Representative',
    sector: JobSector.SALES_MARKETING,
    jobFunction: 'Sales & Marketing',
    qualification: 'B.Pharm / Pharm.D',
    experience: '0-2 years',
    workTypes: [JobWorkType.FIELD_BASED],
    jobDescription:
      'Promote the product portfolio to physicians and pharmacies, achieve territory sales targets and report market intelligence.',
  },
  {
    title: 'Product Manager',
    sector: JobSector.SALES_MARKETING,
    jobFunction: 'Marketing',
    qualification: 'Pharm.D + MBA',
    experience: '4-6 years',
    workTypes: [JobWorkType.HYBRID, JobWorkType.REMOTE, JobWorkType.ON_SITE],
    jobDescription:
      'Own brand strategy and annual plans, design promotional campaigns, and track brand performance against market share goals.',
  },
  {
    title: 'Warehouse Pharmacist',
    sector: JobSector.WAREHOUSE,
    jobFunction: 'Warehouse',
    qualification: 'B.Pharm / Pharm.D',
    experience: '1-3 years',
    workTypes: [JobWorkType.ON_SITE],
    jobDescription:
      'Supervise receipt, storage and dispatch of materials, maintain cold-chain records and ensure GDP compliance in the warehouse.',
  },
  {
    title: 'Supply Chain Officer',
    sector: JobSector.SUPPLY_CHAIN,
    jobFunction: 'Supply Chain',
    qualification: 'B.Pharm / BBA',
    experience: '2-4 years',
    workTypes: [JobWorkType.ON_SITE, JobWorkType.HYBRID],
    jobDescription:
      'Plan material requirements, coordinate with suppliers and production, and keep inventory levels aligned with the demand forecast.',
  },
  {
    title: 'Community Pharmacist',
    sector: JobSector.COMMUNITY_PHARMACY,
    jobFunction: 'Retail Pharmacy',
    qualification: 'Pharm.D (registered with PCP)',
    experience: '0-2 years',
    workTypes: [JobWorkType.ON_SITE],
    jobDescription:
      'Dispense prescriptions, counsel patients on safe medicine use, and manage stock and controlled-drug registers at the outlet.',
  },
  {
    title: 'Hospital Pharmacist',
    sector: JobSector.HOSPITAL_PHARMACY,
    jobFunction: 'Clinical Pharmacy',
    qualification: 'Pharm.D',
    experience: '1-2 years',
    workTypes: [JobWorkType.ON_SITE],
    jobDescription:
      'Review medication orders, participate in ward rounds, and support the pharmacy and therapeutics committee with formulary decisions.',
  },
  {
    title: 'Clinical Pharmacist (ICU)',
    sector: JobSector.HOSPITAL_PHARMACY,
    jobFunction: 'Clinical Pharmacy',
    qualification: 'Pharm.D + residency preferred',
    experience: '2-4 years',
    workTypes: [JobWorkType.ON_SITE],
    jobDescription:
      'Provide pharmacotherapy recommendations for critical care patients, monitor TDM drugs and manage antimicrobial stewardship.',
  },
  {
    title: 'Lecturer, Pharmaceutics',
    sector: JobSector.ACADEMIA,
    jobFunction: 'Teaching',
    qualification: 'MPhil / PhD Pharmaceutics',
    experience: '1-3 years',
    workTypes: [JobWorkType.ON_SITE],
    jobDescription:
      'Teach undergraduate Pharm.D courses, supervise laboratory sessions and student research projects, and publish research.',
  },
  {
    title: 'Biotechnology Research Officer',
    sector: JobSector.BIOTECHNOLOGY,
    jobFunction: 'Research & Development',
    qualification: 'MPhil Biotechnology',
    experience: '2-4 years',
    workTypes: [JobWorkType.ON_SITE],
    jobDescription:
      'Support biosimilar process development, cell culture and protein purification work, and maintain detailed lab records.',
  },
  {
    title: 'Drug Inspector',
    sector: JobSector.GOVERNMENT,
    jobFunction: 'Regulatory Inspection',
    qualification: 'Pharm.D',
    experience: '1-3 years',
    workTypes: [JobWorkType.FIELD_BASED],
    jobDescription:
      'Inspect pharmacies and distributors for licensing compliance, collect drug samples for testing and pursue enforcement cases.',
  },
  {
    title: 'Public Health Pharmacist',
    sector: JobSector.NGO,
    jobFunction: 'Public Health',
    qualification: 'Pharm.D / MPH',
    experience: '2-5 years',
    workTypes: [JobWorkType.FIELD_BASED, JobWorkType.HYBRID, JobWorkType.REMOTE],
    jobDescription:
      'Manage medicine supply for community health programmes, train health workers and monitor rational drug use in the field.',
  },
];

const companies = [
  'GlaxoSmithKline Pakistan',
  'Getz Pharma',
  'Searle Pakistan',
  'Novartis Pakistan',
  'Abbott Pakistan',
  'Sami Pharmaceuticals',
  'Highnoon Laboratories',
  'Ferozsons Laboratories',
  'AGP Limited',
  'CCL Pharmaceuticals',
  'Martin Dow',
  'Hilton Pharma',
  'Bosch Pharmaceuticals',
  'Pfizer Pakistan',
];

// Roles whose employer is an institution rather than a drug company.
const sectorEmployers: Partial<Record<JobSector, string[]>> = {
  [JobSector.COMMUNITY_PHARMACY]: [
    'D. Watson Chemist',
    'Servaid Pharmacy',
    'Fazal Din Pharma Plus',
    'Clinix Pharmacy',
  ],
  [JobSector.HOSPITAL_PHARMACY]: [
    'Aga Khan University Hospital',
    'Shaukat Khanum Memorial Hospital',
    'Shifa International Hospital',
    'Indus Hospital',
  ],
  [JobSector.ACADEMIA]: [
    'University of the Punjab',
    'Dow University of Health Sciences',
    'Riphah International University',
  ],
  [JobSector.GOVERNMENT]: ['Drug Regulatory Authority of Pakistan', 'Punjab Health Department'],
  [JobSector.NGO]: ['Indus Health Network', 'Marie Stopes Society'],
};

const cities = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Hyderabad',
  'Quetta',
  'Sialkot',
];

// Mostly ACTIVE so the public site has plenty to show, with every status represented.
const statuses = [
  JobStatus.ACTIVE,
  JobStatus.ACTIVE,
  JobStatus.ACTIVE,
  JobStatus.ACTIVE,
  JobStatus.ACTIVE,
  JobStatus.DRAFT,
  JobStatus.INACTIVE,
  JobStatus.CLOSED,
];

// Cycles through a non-empty list; the cast covers noUncheckedIndexedAccess.
const pick = <T>(list: T[], i: number): T => list[i % list.length] as T;

const JOB_COUNT = 72;
const HOUR = 60 * 60 * 1000;

// Deterministic, so reruns produce the same rows and the skip-existing check in main() works.
// createdAt stays within the last ~18 days: JobsService.removeExpiredJobs deletes anything past 21.
const jobs = Array.from({ length: JOB_COUNT }, (_, i) => {
  const round = Math.floor(i / roles.length);
  const { workTypes, ...role } = pick(roles, i);
  const employers = sectorEmployers[role.sector] ?? companies;
  return {
    ...role,
    company: pick(employers, i * 7),
    // Shifting by `round` keeps title + company + city unique, which the skip-existing check relies on.
    city: pick(cities, (i % roles.length) * 3 + round),
    workType: pick(workTypes, round),
    status: pick(statuses, i * 5),
    createdAt: new Date(Date.now() - i * 6 * HOUR - (i % 5) * 17 * 60 * 1000),
  };
});

const scholarships = [
  {
    image: 'https://placehold.co/800x450?text=DAAD+Scholarship',
    country: 'Germany',
    startDate: new Date('2026-09-01'),
    endDate: new Date('2028-08-31'),
    financialBenefits:
      'Full tuition waiver, monthly stipend of EUR 934, health insurance coverage, and travel allowance.',
    eligibilityCriteria:
      'Pharm.D degree with minimum CGPA 3.0, two years relevant work experience, and proof of English proficiency (IELTS 6.5+).',
    howToApply:
      'Submit application via the DAAD online portal including transcripts, CV, motivation letter, and two reference letters before the deadline.',
    status: ScholarshipStatus.ACTIVE,
  },
  {
    image: 'https://placehold.co/800x450?text=Commonwealth+Scholarship',
    country: 'United Kingdom',
    startDate: new Date('2026-10-01'),
    endDate: new Date('2027-09-30'),
    financialBenefits:
      'Approved tuition fees, monthly stipend, return airfare, and a grant towards study-related travel.',
    eligibilityCriteria:
      'Bachelor degree in Pharmacy with first-class honors, applicants must be Pakistani nationals unable to afford study costs.',
    howToApply:
      'Apply through the Commonwealth Scholarship Commission portal with an official nomination from HEC Pakistan.',
    status: ScholarshipStatus.ACTIVE,
  },
  {
    image: 'https://placehold.co/800x450?text=Fulbright+Scholarship',
    country: 'United States',
    startDate: new Date('2027-01-15'),
    endDate: new Date('2028-12-15'),
    financialBenefits:
      'Full funding for tuition, living stipend, health insurance, and round-trip airfare to the United States.',
    eligibilityCriteria:
      'Minimum 16 years of education, strong academic record, leadership potential, and TOEFL/GRE scores.',
    howToApply:
      'Complete the online Fulbright application including essays, transcripts, and standardized test scores by the annual deadline.',
    status: ScholarshipStatus.DRAFT,
  },
  {
    image: 'https://placehold.co/800x450?text=Erasmus+Mundus',
    country: 'European Union',
    startDate: new Date('2026-08-01'),
    endDate: new Date('2028-07-31'),
    financialBenefits:
      'Monthly scholarship installments, travel and installation allowance, and full tuition fee coverage.',
    eligibilityCriteria:
      'Pharm.D or MSc in Pharmaceutical Sciences, CGPA above 3.2, and English language certification.',
    howToApply:
      'Apply directly through the consortium university website, submitting academic records and a research proposal.',
    status: ScholarshipStatus.EXPIRED,
  },
];

const blogs = [
  {
    title: 'Understanding Pharmacovigilance in 2026',
    slug: 'understanding-pharmacovigilance-in-2026',
    content:
      '<p>Pharmacovigilance continues to evolve as regulators demand faster, data-driven adverse event reporting. This article explores the latest trends shaping drug safety monitoring.</p>',
    excerpt:
      'A look at how pharmacovigilance practices are adapting to new regulatory expectations in 2026.',
    featuredImage: 'https://placehold.co/1200x630?text=Pharmacovigilance',
    category: 'Regulatory Affairs',
    tags: ['pharmacovigilance', 'compliance', 'drug-safety'],
    status: BlogStatus.PUBLISHED,
    isFeatured: true,
    seoTitle: 'Understanding Pharmacovigilance in 2026 | PharmaConnect',
    seoDescription:
      'Learn how pharmacovigilance practices are evolving and what it means for drug safety.',
    publishedAt: new Date('2026-06-10'),
  },
  {
    title: 'Career Paths for Pharm.D Graduates in Pakistan',
    slug: 'career-paths-for-pharmd-graduates-in-pakistan',
    content:
      '<p>From hospital pharmacy to regulatory affairs, Pharm.D graduates have more career options than ever. We break down the top industries hiring pharmacists today.</p>',
    excerpt:
      'Explore the diverse career opportunities available to Pharm.D graduates across Pakistan.',
    featuredImage: 'https://placehold.co/1200x630?text=Career+Paths',
    category: 'Career Guidance',
    tags: ['career', 'pharmd', 'jobs'],
    status: BlogStatus.PUBLISHED,
    isFeatured: false,
    seoTitle: 'Career Paths for Pharm.D Graduates | PharmaConnect',
    seoDescription: 'Discover the top career paths available for Pharm.D graduates in Pakistan.',
    publishedAt: new Date('2026-05-22'),
  },
  {
    title: 'How to Write a Winning Scholarship Application',
    slug: 'how-to-write-a-winning-scholarship-application',
    content:
      '<p>A strong scholarship application balances academic achievement with a compelling personal narrative. Here are proven tips to help your application stand out.</p>',
    excerpt: 'Practical tips to help pharmacy students craft standout scholarship applications.',
    featuredImage: 'https://placehold.co/1200x630?text=Scholarship+Tips',
    category: 'Scholarships',
    tags: ['scholarships', 'study-abroad', 'tips'],
    status: BlogStatus.DRAFT,
    isFeatured: false,
    seoTitle: 'How to Write a Winning Scholarship Application | PharmaConnect',
    seoDescription: 'Tips and strategies for writing a scholarship application that gets noticed.',
    publishedAt: null,
  },
  {
    title: 'GMP Compliance: A Practical Guide for Production Teams',
    slug: 'gmp-compliance-a-practical-guide-for-production-teams',
    content:
      '<p>Maintaining Good Manufacturing Practice compliance requires more than following a checklist. This guide covers common pitfalls and how to avoid them.</p>',
    excerpt: 'A practical guide to maintaining GMP compliance on the production floor.',
    featuredImage: 'https://placehold.co/1200x630?text=GMP+Compliance',
    category: 'Manufacturing',
    tags: ['gmp', 'production', 'quality'],
    status: BlogStatus.PUBLISHED,
    isFeatured: true,
    seoTitle: 'GMP Compliance Guide for Production Teams | PharmaConnect',
    seoDescription:
      'Learn practical strategies for maintaining GMP compliance in pharmaceutical production.',
    publishedAt: new Date('2026-07-01'),
  },
];

async function main(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed dummy data with NODE_ENV=production');
  }

  console.log('Seeding jobs...');
  // Insert-only: a job already present (same title, company and city) is left untouched.
  let createdJobs = 0;
  for (const job of jobs) {
    const exists = await prisma.job.findFirst({
      where: { title: job.title, company: job.company, city: job.city },
      select: { id: true },
    });
    if (exists) continue;
    await prisma.job.create({ data: job });
    createdJobs++;
  }

  console.log('Seeding scholarships...');
  for (const scholarship of scholarships) {
    const exists = await prisma.scholarship.findFirst({
      where: { country: scholarship.country, startDate: scholarship.startDate },
      select: { id: true },
    });
    if (!exists) await prisma.scholarship.create({ data: scholarship });
  }

  console.log('Seeding blogs...');
  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: {},
      create: blog,
    });
  }

  console.log(
    `Done: ${createdJobs} new jobs (${jobs.length - createdJobs} already present), ${scholarships.length} scholarships, ${blogs.length} blogs seeded.`,
  );
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
