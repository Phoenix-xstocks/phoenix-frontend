import fs from 'fs';
import path from 'path';
import { SIDEBAR } from './docs-sidebar';

const DOCS_DIR = path.join(process.cwd(), 'src/content/docs');

export interface DocPage {
  slug: string[];
  title: string;
  content: string;
}

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : 'Documentation';
}

export function getDocPage(slug: string[]): DocPage | null {
  let filePath: string;

  if (slug.length === 0) {
    filePath = path.join(DOCS_DIR, 'index.md');
  } else {
    filePath = path.join(DOCS_DIR, ...slug) + '.md';
  }

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const title = extractTitle(raw);

  return { slug, title, content: raw };
}

export function getAllDocSlugs(): string[][] {
  const slugs: string[][] = [[]];
  for (const section of SIDEBAR) {
    for (const item of section.items) {
      if (item.slug.length > 0) {
        slugs.push(item.slug);
      }
    }
  }
  return slugs;
}
