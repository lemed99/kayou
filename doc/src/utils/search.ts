/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import { create, insert, search } from '@orama/orama';

export interface SearchDocument {
  path: string;
  label: string;
  category: string;
  keywords: string;
}

// Auto-generate search index from routes using Vite's import.meta.glob
// This automatically updates in dev when files are added/removed
const routeModules = import.meta.glob('../routes/**/*.tsx', { eager: true });

function generateSearchIndex(): SearchDocument[] {
  const docs: SearchDocument[] = [];

  for (const path of Object.keys(routeModules)) {
    // Skip layout files, index, 404, etc.
    if (path.includes('(doc).tsx')) continue;
    if (path.includes('[...404]')) continue;
    if (path.endsWith('/index.tsx')) continue;
    if (path.endsWith('/docs.tsx')) continue;
    if (path.endsWith('/icons.tsx')) continue;

    // Only process files inside (doc) folder
    if (!path.includes('(doc)/')) continue;

    // Extract route path: ../routes/(doc)/ui/button.tsx -> /ui/button
    const routePath = path
      .replace(/^.*\(doc\)/, '')
      .replace('.tsx', '');

    // Determine category from path
    let category = 'Getting Started';
    if (routePath.startsWith('/ui/')) {
      category = 'Components';
    } else if (routePath.startsWith('/hooks/')) {
      category = 'Hooks';
    }

    // Generate label from filename
    const filename = routePath.split('/').pop() || '';
    const label = formatLabel(filename, category);

    // Generate keywords from label
    const keywords = generateKeywords(label, filename);

    docs.push({
      path: routePath,
      label,
      category,
      keywords,
    });
  }

  // Add icons page (not in (doc) group)
  docs.push({
    path: '/icons',
    label: 'Icons',
    category: 'Resources',
    keywords: 'icons svg assets graphics search',
  });

  return docs;
}

function formatLabel(filename: string, category: string): string {
  if (category === 'Hooks') {
    // use-toast -> useToast
    return filename
      .split('-')
      .map((part, i) => (i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
      .join('');
  }

  // button -> Button, date-picker -> DatePicker
  return filename
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function generateKeywords(label: string, filename: string): string {
  const words = new Set<string>();

  // Add filename parts
  filename.split('-').forEach((part) => words.add(part.toLowerCase()));

  // Add label parts (camelCase split)
  label.split(/(?=[A-Z])/).forEach((part) => words.add(part.toLowerCase()));

  // Add common synonyms based on component type
  const synonyms: Record<string, string[]> = {
    button: ['click', 'action', 'submit'],
    modal: ['dialog', 'popup', 'overlay'],
    drawer: ['sidebar', 'panel', 'sheet'],
    select: ['dropdown', 'picker', 'choose'],
    input: ['field', 'form', 'text'],
    table: ['grid', 'data', 'rows'],
    chart: ['graph', 'visualization', 'data'],
    virtual: ['scroll', 'performance', 'list'],
    date: ['calendar', 'time', 'picker'],
    toggle: ['switch', 'boolean', 'on', 'off'],
    checkbox: ['check', 'boolean', 'select'],
    pagination: ['page', 'navigate', 'pages'],
    tooltip: ['hint', 'hover', 'info'],
    popover: ['popup', 'floating', 'dropdown'],
    accordion: ['collapse', 'expand', 'panel'],
    breadcrumb: ['navigation', 'path', 'trail'],
    badge: ['tag', 'label', 'status'],
    alert: ['message', 'warning', 'error', 'success'],
    skeleton: ['loading', 'placeholder'],
    spinner: ['loading', 'progress'],
    upload: ['file', 'drag', 'drop'],
    password: ['secure', 'hidden', 'secret'],
    textarea: ['multiline', 'text'],
    sidebar: ['navigation', 'menu'],
    quickstart: ['start', 'begin', 'intro', 'getting started'],
    installation: ['install', 'setup', 'npm', 'pnpm'],
    contributing: ['contribute', 'help', 'pr'],
    license: ['mit', 'open source'],
    floating: ['position', 'anchor', 'tooltip'],
    mutation: ['api', 'post', 'fetch', 'request'],
    intl: ['i18n', 'translate', 'locale', 'internationalization'],
    resource: ['fetch', 'api', 'cache', 'swr'],
  };

  // Add synonyms for matching keywords
  for (const [key, values] of Object.entries(synonyms)) {
    if (filename.includes(key) || label.toLowerCase().includes(key)) {
      values.forEach((v) => words.add(v));
    }
  }

  return Array.from(words).join(' ');
}

// Generate index once
const searchData = generateSearchIndex();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let searchDb: any = null;

function getSearchDb() {
  if (searchDb) return searchDb;

  searchDb = create({
    schema: {
      path: 'string',
      label: 'string',
      category: 'string',
      keywords: 'string',
    } as const,
  });

  for (const doc of searchData) {
    insert(searchDb, doc);
  }

  return searchDb;
}

export function searchDocs(query: string): SearchDocument[] {
  const db = getSearchDb();

  const results = search(db, {
    term: query,
    properties: ['label', 'category', 'keywords'],
    tolerance: 1,
    boost: {
      label: 2,
      category: 1,
      keywords: 1.5,
    },
  }) as { hits: Array<{ document: SearchDocument }> };

  return results.hits.map((hit) => hit.document);
}

// Export for debugging
export function getSearchIndex(): SearchDocument[] {
  return searchData;
}
