import { BlogPost } from "./types";
import { post as juhu2026 } from "./posts/juhu-2026";
import { post as juhuConditions } from "./posts/juhu-conditions";
import { post as insuranceRates } from "./posts/insurance-rates";
import { post as netSalary } from "./posts/net-salary";
import { post as freelancer } from "./posts/freelancer-insurance";
import { post as severanceGuide } from "./posts/severance-guide";
import { post as annualNetTable } from "./posts/annual-net-salary-table";
import { post as yearEndRefund } from "./posts/year-end-tax-refund";

/** 전체 글 (최신순) */
export const BLOG_POSTS: BlogPost[] = [
  juhu2026,
  juhuConditions,
  insuranceRates,
  netSalary,
  freelancer,
  severanceGuide,
  annualNetTable,
  yearEndRefund,
].sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function allPostSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}

export type { BlogPost };
