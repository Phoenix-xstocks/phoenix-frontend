'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import type { Components } from 'react-markdown';

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-white mb-6 pb-3 border-b border-border">
      {children}
    </h1>
  ),
  h2: ({ children, id }) => (
    <h2 id={id} className="text-2xl font-semibold text-white mt-10 mb-4 pb-2 border-b border-border/50">
      {children}
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3 id={id} className="text-xl font-semibold text-white mt-8 mb-3">
      {children}
    </h3>
  ),
  h4: ({ children, id }) => (
    <h4 id={id} className="text-lg font-medium text-white mt-6 mb-2">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-gray-300 leading-7 mb-4">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-accent hover:text-accent-dim underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-6 mb-4 space-y-1 text-gray-300">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-6 mb-4 space-y-1 text-gray-300">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-7">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-accent text-sm font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-6 rounded-lg bg-surface border border-border p-4 overflow-x-auto text-sm font-mono leading-relaxed">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mb-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-surface-2 text-white">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left font-semibold border-b border-border">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-gray-300 border-b border-border/50">{children}</td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-accent/50 pl-4 my-4 text-gray-400 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-border" />,
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="docs-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
