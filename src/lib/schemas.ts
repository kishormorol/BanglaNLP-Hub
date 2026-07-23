import { z } from 'zod';

/** Verified-date freshness window. Entries staler than this fail validation. */
export const VERIFY_MAX_AGE_MONTHS = 12;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be an ISO date (YYYY-MM-DD)')
  .refine((s) => !Number.isNaN(Date.parse(s)), 'is not a real calendar date');

/** http(s) only — no mailto:, no relative paths, no javascript:. */
const url = z
  .string()
  .url('is not a valid URL')
  .refine((u) => /^https?:\/\//.test(u), 'must use http(s)');

const id = z
  .string()
  .min(1)
  .regex(/^[a-z0-9][a-z0-9-_]*$/, 'must be lowercase alphanumeric with - or _');

const year = z.number().int().gte(1990).lte(new Date().getFullYear() + 1);

export const TaskSchema = z.object({
  id,
  name: z.string().min(1),
  bn: z.string().min(1),
  desc: z.string().min(1),
});

export const DatasetSchema = z.object({
  id,
  name: z.string().min(1),
  task: id,
  size: z.string().min(1),
  sizeN: z.number().nonnegative(),
  license: z.string().min(1),
  year,
  source: z.string().min(1),
  link: url,
  verified: isoDate,
  desc: z.string().min(1),
  // Optional by design: never synthesise a BibTeX entry. The UI hides the
  // copy button when absent; the gap is tracked in TODO-data.md.
  bibtex: z.string().min(1).optional(),
});

export const PaperSchema = z.object({
  id,
  title: z.string().min(1),
  authors: z.string().min(1),
  venue: z.string().min(1),
  year,
  link: url,
  task: id,
  note: z.string().min(1).optional(),
});

export const ModelSchema = z.object({
  id,
  name: z.string().min(1),
  task: id,
  arch: z.string().min(1),
  params: z.string().min(1),
  link: url,
  verified: isoDate,
  note: z.string().min(1).optional(),
});

export const ToolSchema = z.object({
  id,
  name: z.string().min(1),
  author: z.string().min(1),
  desc: z.string().min(1),
  lang: z.string().min(1),
  install: z.string().min(1),
  link: url,
  verified: isoDate,
});

export const LeaderboardRowSchema = z.object({
  model: z.string().min(1),
  score: z.string().min(1),
  paper: z.string().min(1),
  year,
});

export const LeaderboardSchema = z.object({
  /** Must match a dataset id — enforced cross-file in validate.ts. */
  dataset: id,
  /** Display label from the prototype, may carry direction/split info. */
  label: z.string().min(1),
  metric: z.string().min(1),
  rows: z.array(LeaderboardRowSchema),
});

export const VenueTone = z.enum(['green', 'red', 'blue', 'gold', 'gray']);
export const VenuesSchema = z.record(z.string().min(1), VenueTone);

/** One resource a contributor submitted. `authors` is the paper's full author
 *  list, verbatim from the authoritative source (ACL/arXiv/Crossref). */
export const ContributionSchema = z.object({
  title: z.string().min(1),
  task: id,
  authors: z.string().min(1),
  issue: z.number().int().positive(),
});

export const ContributorSchema = z.object({
  github: z.string().min(1),
  name: z.string().min(1),
  entries: z.array(ContributionSchema).min(1),
});

export const RecentSchema = z.object({
  type: z.enum(['Dataset', 'Paper', 'Model', 'Tool']),
  name: z.string().min(1),
  task: z.string().min(1),
  date: isoDate,
});

export type Task = z.infer<typeof TaskSchema>;
export type Dataset = z.infer<typeof DatasetSchema>;
export type Paper = z.infer<typeof PaperSchema>;
export type Model = z.infer<typeof ModelSchema>;
export type Tool = z.infer<typeof ToolSchema>;
export type Leaderboard = z.infer<typeof LeaderboardSchema>;
export type Recent = z.infer<typeof RecentSchema>;
export type Contributor = z.infer<typeof ContributorSchema>;
export type Contribution = z.infer<typeof ContributionSchema>;
export type VenueToneName = z.infer<typeof VenueTone>;
