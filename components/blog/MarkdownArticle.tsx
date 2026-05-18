import Link from 'next/link';

function inlineMarkdown(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;

    const href = match[2];
    const external = href.startsWith('http') && !href.includes('founderstackhub.com');

    return (
      <Link key={`${href}-${index}`} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
        {match[1]}
      </Link>
    );
  });
}

export function MarkdownArticle({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <article className="prose prose-invert prose-cyan max-w-none prose-headings:text-white prose-a:text-cyan-200 prose-a:no-underline hover:prose-a:text-white prose-p:leading-8 prose-li:leading-7">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('# ')) {
          return <h1 key={index}>{trimmed.replace(/^#\s+/, '')}</h1>;
        }

        if (trimmed.startsWith('## ')) {
          return <h2 key={index}>{trimmed.replace(/^##\s+/, '')}</h2>;
        }

        if (trimmed.startsWith('### ')) {
          return <h3 key={index}>{trimmed.replace(/^###\s+/, '')}</h3>;
        }

        if (trimmed.startsWith('- ')) {
          return <p key={index} className="pl-4 text-slate-300">- {inlineMarkdown(trimmed.replace(/^-\s+/, ''))}</p>;
        }

        return <p key={index}>{inlineMarkdown(trimmed)}</p>;
      })}
    </article>
  );
}
