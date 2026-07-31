import { PrismaClient, JobStatus, JobWorkType, JobSector, ScholarshipStatus, BlogStatus } from '@prisma/client';

const prisma = new PrismaClient();

const jobs = [
  {
    title: 'Production Pharmacist',
    company: 'GlaxoSmithKline Pakistan',
    city: 'Karachi',
    qualification: 'Pharm.D',
    jobDescription:
      'Oversee daily production operations, ensure GMP compliance, and coordinate with QA/QC teams to maintain product quality standards.',
    experience: '2-4 years',
    workType: JobWorkType.ON_SITE,
    jobFunction: 'Production',
    status: JobStatus.ACTIVE,
    sector: JobSector.PRODUCTION,
  },
  {
    title: 'Quality Assurance Officer',
    company: 'Getz Pharma',
    city: 'Karachi',
    qualification: 'Pharm.D / B.Pharm',
    jobDescription:
      'Review batch records, conduct internal audits, and ensure adherence to SOPs and regulatory requirements across manufacturing lines.',
    experience: '1-3 years',
    workType: JobWorkType.ON_SITE,
    jobFunction: 'Quality Assurance',
    status: JobStatus.ACTIVE,
    sector: JobSector.QUALITY_ASSURANCE,
  },
  {
    title: 'Regulatory Affairs Associate',
    company: 'Searle Pakistan',
    city: 'Lahore',
    qualification: 'Pharm.D',
    jobDescription:
      'Prepare and submit drug registration dossiers, liaise with DRAP, and track regulatory changes affecting product portfolios.',
    experience: '2-5 years',
    workType: JobWorkType.HYBRID,
    jobFunction: 'Regulatory Affairs',
    status: JobStatus.ACTIVE,
    sector: JobSector.REGULATORY_AFFAIRS,
  },
  {
    title: 'Clinical Research Associate',
    company: 'Novartis Pakistan',
    city: 'Islamabad',
    qualification: 'Pharm.D / MPhil Pharmacology',
    jobDescription:
      'Monitor clinical trial sites, ensure protocol compliance, and manage documentation for ongoing pharmaceutical research studies.',
    experience: '3-5 years',
    workType: JobWorkType.FIELD_BASED,
    jobFunction: 'Clinical Research',
    status: JobStatus.ACTIVE,
    sector: JobSector.CLINICAL_RESEARCH,
  },
  {
    title: 'Hospital Pharmacist',
    company: 'Aga Khan University Hospital',
    city: 'Karachi',
    qualification: 'Pharm.D',
    jobDescription:
      'Dispense medications, counsel patients, and collaborate with clinical staff to optimize therapeutic outcomes in a hospital setting.',
    experience: '1-2 years',
    workType: JobWorkType.ON_SITE,
    jobFunction: 'Clinical Pharmacy',
    status: JobStatus.ACTIVE,
    sector: JobSector.HOSPITAL_PHARMACY,
  },
  {
    title: 'Pharmacovigilance Executive',
    company: 'Abbott Pakistan',
    city: 'Lahore',
    qualification: 'Pharm.D',
    jobDescription:
      'Process adverse event reports, maintain safety databases, and support signal detection activities for marketed products.',
    experience: '1-3 years',
    workType: JobWorkType.REMOTE,
    jobFunction: 'Pharmacovigilance',
    status: JobStatus.DRAFT,
    sector: JobSector.PHARMACOVIGILANCE,
  },
  {
    title: 'Medical Sales Representative',
    company: 'Sami Pharmaceuticals',
    city: 'Faisalabad',
    qualification: 'B.Pharm / Pharm.D',
    jobDescription:
      'Promote pharmaceutical products to healthcare professionals, achieve sales targets, and build lasting client relationships.',
    experience: '0-2 years',
    workType: JobWorkType.FIELD_BASED,
    jobFunction: 'Sales & Marketing',
    status: JobStatus.ACTIVE,
    sector: JobSector.SALES_MARKETING,
  },
  {
    title: 'Warehouse & Supply Chain Officer',
    company: 'Highnoon Laboratories',
    city: 'Lahore',
    qualification: 'B.Pharm',
    jobDescription:
      'Manage inventory levels, coordinate logistics, and ensure timely distribution of pharmaceutical products across the supply network.',
    experience: '2-4 years',
    workType: JobWorkType.ON_SITE,
    jobFunction: 'Supply Chain',
    status: JobStatus.INACTIVE,
    sector: JobSector.SUPPLY_CHAIN,
  },
];

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
    excerpt: 'A look at how pharmacovigilance practices are adapting to new regulatory expectations in 2026.',
    featuredImage: 'https://placehold.co/1200x630?text=Pharmacovigilance',
    category: 'Regulatory Affairs',
    tags: ['pharmacovigilance', 'compliance', 'drug-safety'],
    status: BlogStatus.PUBLISHED,
    isFeatured: true,
    seoTitle: 'Understanding Pharmacovigilance in 2026 | PharmaConnect',
    seoDescription: 'Learn how pharmacovigilance practices are evolving and what it means for drug safety.',
    publishedAt: new Date('2026-06-10'),
  },
  {
    title: 'Career Paths for Pharm.D Graduates in Pakistan',
    slug: 'career-paths-for-pharmd-graduates-in-pakistan',
    content:
      '<p>From hospital pharmacy to regulatory affairs, Pharm.D graduates have more career options than ever. We break down the top industries hiring pharmacists today.</p>',
    excerpt: 'Explore the diverse career opportunities available to Pharm.D graduates across Pakistan.',
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
    seoDescription: 'Learn practical strategies for maintaining GMP compliance in pharmaceutical production.',
    publishedAt: new Date('2026-07-01'),
  },
];

async function main(): Promise<void> {
  console.log('Seeding jobs...');
  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }

  console.log('Seeding scholarships...');
  for (const scholarship of scholarships) {
    await prisma.scholarship.create({ data: scholarship });
  }

  console.log('Seeding blogs...');
  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: blog,
      create: blog,
    });
  }

  console.log(`Done: ${jobs.length} jobs, ${scholarships.length} scholarships, ${blogs.length} blogs seeded.`);
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
