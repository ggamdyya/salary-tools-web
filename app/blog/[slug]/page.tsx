import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, allPostSlugs } from "@/lib/blog";
import { BlogContent } from "@/components/BlogContent";
import { AdUnit } from "@/components/AdSense";
import { AD_SLOTS } from "@/lib/ads";
import { getCalc, SITE_NAME, SITE_URL } from "@/lib/calculatorsMeta";

export function generateStaticParams() {
  return allPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = post.relatedCalculators
    .map((slug) => getCalc(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/blog" className="text-sm font-semibold text-juhyu dark:text-juhyu-light">
        ← 블로그 목록
      </Link>

      <header className="mb-6 mt-3">
        <time className="text-xs text-slate-400">{post.date}</time>
        <h1 className="mt-1 text-2xl font-extrabold leading-snug text-slate-900 dark:text-white">
          {post.title}
        </h1>
      </header>

      <BlogContent markdown={post.content} />

      <AdUnit slot={AD_SLOTS.article} />

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-base font-extrabold text-slate-900 dark:text-white">
            관련 계산기
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5 dark:bg-[#2C2C2E]"
              >
                <span className="text-2xl">{c.emoji}</span>
                <span>
                  <span className="block font-bold text-slate-900 dark:text-white">{c.title}</span>
                  <span
                    className={`text-sm font-semibold ${
                      c.accent === "juhyu" ? "text-juhyu dark:text-juhyu-light" : "text-saboheom"
                    }`}
                  >
                    계산하기 →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
