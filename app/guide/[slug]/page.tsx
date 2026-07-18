import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, guides } from "@/lib/guides";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import AdSlot from "@/components/AdSlot";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guide/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function GuideArticlePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = guide.related
    .map((s) => getGuide(s))
    .filter((g): g is NonNullable<typeof g> => g !== undefined);

  // 구조화 데이터: Article + FAQPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        dateModified: guide.updated,
        inLanguage: "ko",
        mainEntityOfPage: `${SITE_URL}/guide/${guide.slug}`,
        author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
      ...(guide.faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: guide.faq.map(({ q, a }) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-2xl font-extrabold leading-snug">{guide.title}</h1>
      <p className="mt-2 text-sm text-muted">마지막 업데이트: {guide.updated}</p>

      <div className="mt-6 space-y-4 text-[15px] leading-relaxed">
        {guide.intro.map((p) => (
          <p key={p.slice(0, 20)}>{p}</p>
        ))}
      </div>

      {guide.sections.map((section, i) => (
        <section key={section.heading} className="mt-10">
          <h2 className="border-l-4 border-accent pl-3 text-xl font-bold leading-snug">
            {section.heading}
          </h2>
          <div className="mt-3 space-y-4 text-[15px] leading-relaxed">
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
            {section.list && (
              <ul className="list-disc space-y-2 pl-5">
                {section.list.map((item) => (
                  <li key={item.slice(0, 20)}>{item}</li>
                ))}
              </ul>
            )}
          </div>
          {i === 1 && <AdSlot slot="guide-in-article" />}
        </section>
      ))}

      {guide.faq.length > 0 && (
        <section className="mt-10">
          <h2 className="border-l-4 border-accent pl-3 text-xl font-bold leading-snug">
            자주 묻는 질문
          </h2>
          <dl className="mt-4 space-y-4">
            {guide.faq.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-xl border border-border-soft bg-card p-4 shadow-sm"
              >
                <dt className="font-bold">
                  <span className="text-accent">Q.</span> {q}
                </dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-muted">
                  {a}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {guide.cta && (
        <div className="mt-10 rounded-2xl border-2 border-accent bg-card p-5 text-center">
          <p className="font-bold">직접 확인해 보세요</p>
          <Link
            href={guide.cta.href}
            className="mt-3 inline-block rounded-xl bg-accent px-6 py-2.5 font-bold text-white transition-colors hover:bg-accent-strong"
          >
            {guide.cta.label} →
          </Link>
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-bold">함께 보면 좋은 글</h2>
          <ul className="space-y-2">
            {related.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guide/${g.slug}`}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  {g.title} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10 text-xs text-muted">
        본 글은 정보 제공·오락용이며 세무·법률 자문이 아닙니다. 로또는 완전
        무작위 추첨으로 당첨을 예측·보장하지 않습니다.
      </p>
    </article>
  );
}
