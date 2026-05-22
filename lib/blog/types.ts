export interface BlogPost {
  /** URL slug */
  slug: string;
  /** 글 제목 (SEO title) */
  title: string;
  /** 메타 설명 (150자 내외) */
  description: string;
  /** 발행일 ISO yyyy-mm-dd */
  date: string;
  /** 최종 수정일 ISO */
  updated?: string;
  /** 검색 키워드 */
  keywords: string[];
  /** 관련 계산기 slug (CTA·내부링크용) */
  relatedCalculators: string[];
  /** 본문 (Markdown, GFM) */
  content: string;
}
