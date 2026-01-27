/**
 * Script to generate kayou data from documentation files
 * Run with: pnpm run generate
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PropDefinition {
  name: string;
  type: string;
  default: string;
  description: string;
  required?: boolean;
}

interface ExampleDefinition {
  title: string;
  description: string;
  code?: string;
}

interface ComponentData {
  name: string;
  description: string;
  package: '@kayou/ui';
  importPath: string;
  props: PropDefinition[];
  examples: ExampleDefinition[];
  usage: string;
  keyConcepts?: { term: string; explanation: string }[];
  dependencies?: { name: string; url: string; usage: string }[];
}

interface HookParameter {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}

interface HookReturn {
  name: string;
  type: string;
  description: string;
}

interface HookData {
  name: string;
  description: string;
  package: '@kayou/hooks';
  importPath: string;
  parameters: HookParameter[];
  returnType?: string;
  returns: HookReturn[];
  examples: ExampleDefinition[];
  usage: string;
}

interface IconData {
  name: string;
  exportName: string;
  fileName: string;
}

interface KayouData {
  version: string;
  generatedAt: string;
  components: ComponentData[];
  hooks: HookData[];
  icons: IconData[];
}

const ROOT_DIR = path.resolve(__dirname, '../../..');
const DOC_DIR = path.join(ROOT_DIR, 'doc/src/pages');
const ICONS_DIR = path.join(ROOT_DIR, 'packages/icons/src');
const OUTPUT_FILE = path.join(__dirname, '../data/kayou-data.json');

// Helper to extract string content between delimiters
function extractBetween(content: string, start: string, end: string): string | null {
  const startIdx = content.indexOf(start);
  if (startIdx === -1) return null;
  const endIdx = content.indexOf(end, startIdx + start.length);
  if (endIdx === -1) return null;
  return content.slice(startIdx + start.length, endIdx);
}

// Extract array of objects from JSX props
function extractArrayProp(content: string, propName: string): string | null {
  const regex = new RegExp(`${propName}=\\{\\[([\\s\\S]*?)\\]\\}`, 'g');
  const match = regex.exec(content);
  if (!match) return null;
  return match[1];
}

// Parse props array from doc file - handles multiline format
function parsePropsArray(propsContent: string): PropDefinition[] {
  const props: PropDefinition[] = [];

  // Split by opening braces that start prop objects
  const propBlocks = propsContent.split(/\{\s*\n?\s*name:/);

  for (let i = 1; i < propBlocks.length; i++) {
    const block = 'name:' + propBlocks[i];

    const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
    // Handle types that may contain quotes (like union types)
    const typeMatch = block.match(/type:\s*['"`]((?:[^'"`]|"[^"]*")+)['"`]/);
    const defaultMatch = block.match(/default:\s*['"`]((?:[^'"`]|"[^"]*")*)['"`]/);
    const descMatch = block.match(/description:\s*['"`]([^'"`]+)['"`]/);

    if (nameMatch) {
      props.push({
        name: nameMatch[1],
        type: typeMatch?.[1] || 'unknown',
        default: defaultMatch?.[1] || '-',
        description: descMatch?.[1] || '',
      });
    }
  }

  return props;
}

// Parse parameters array from hook doc file - handles multiline format
function parseParametersArray(content: string): HookParameter[] {
  const params: HookParameter[] = [];

  // Split by opening braces that start param objects
  const paramBlocks = content.split(/\{\s*\n?\s*name:/);

  for (let i = 1; i < paramBlocks.length; i++) {
    const block = 'name:' + paramBlocks[i];

    const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
    const typeMatch = block.match(/type:\s*['"`]([^'"`]+)['"`]/);
    const descMatch = block.match(/description:\s*['"`]([^'"`]+)['"`]/);
    const requiredMatch = block.match(/required:\s*(true|false)/);

    if (nameMatch) {
      params.push({
        name: nameMatch[1],
        type: typeMatch?.[1] || 'unknown',
        description: descMatch?.[1] || '',
        required: requiredMatch?.[1] === 'true',
      });
    }
  }

  return params;
}

// Parse returns array from hook doc file
function parseReturnsArray(content: string): HookReturn[] {
  const returns: HookReturn[] = [];
  const returnRegex = /\{\s*name:\s*['"]([^'"]+)['"]\s*,\s*type:\s*['"`]([^'"`]+)['"`]\s*,\s*description:\s*['"`]([^'"`]+)['"`]/g;

  let match;
  while ((match = returnRegex.exec(content)) !== null) {
    returns.push({
      name: match[1],
      type: match[2],
      description: match[3],
    });
  }
  return returns;
}

// Extract examples - simplified version focusing on code examples
function parseExamples(content: string): ExampleDefinition[] {
  const examples: ExampleDefinition[] = [];
  const exampleRegex = /\{\s*title:\s*['"]([^'"]+)['"]\s*,\s*description:\s*['"`]([^'"`]+)['"`](?:[\s\S]*?code:\s*`([^`]+)`)?/g;

  let match;
  while ((match = exampleRegex.exec(content)) !== null) {
    examples.push({
      title: match[1],
      description: match[2],
      code: match[3]?.trim(),
    });
  }
  return examples;
}

// Parse a component doc file
function parseComponentDoc(filePath: string): ComponentData | null {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract title
  const titleMatch = content.match(/title=["']([^"']+)["']/);
  if (!titleMatch) return null;

  // Extract description
  const descMatch = content.match(/description=["']([^"']+)["']/);

  // Extract props
  const propsSection = extractArrayProp(content, 'props');
  const props = propsSection ? parsePropsArray(propsSection) : [];

  // Extract usage
  const usageMatch = content.match(/usage=\{`([\s\S]*?)`\}/);

  // Extract examples
  const examplesSection = extractArrayProp(content, 'examples');
  const examples = examplesSection ? parseExamples(examplesSection) : [];

  const name = titleMatch[1];

  return {
    name,
    description: descMatch?.[1] || '',
    package: '@kayou/ui',
    importPath: `import { ${name} } from '@kayou/ui';`,
    props,
    examples,
    usage: usageMatch?.[1]?.trim() || `import { ${name} } from '@kayou/ui';`,
  };
}

// Parse a hook doc file
function parseHookDoc(filePath: string): HookData | null {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract title
  const titleMatch = content.match(/title=["']([^"']+)["']/);
  if (!titleMatch) return null;

  // Extract description
  const descMatch = content.match(/description=["']([^"']+)["']/);

  // Extract parameters
  const paramsSection = extractArrayProp(content, 'parameters');
  const parameters = paramsSection ? parseParametersArray(paramsSection) : [];

  // Extract returns
  const returnsSection = extractArrayProp(content, 'returns');
  const returns = returnsSection ? parseReturnsArray(returnsSection) : [];

  // Extract returnType
  const returnTypeMatch = content.match(/returnType=["']([^"']+)["']/);

  // Extract usage
  const usageMatch = content.match(/usage=\{`([\s\S]*?)`\}/);

  // Extract examples with code
  const examplesSection = extractArrayProp(content, 'examples');
  const examples = examplesSection ? parseExamples(examplesSection) : [];

  const name = titleMatch[1];

  return {
    name,
    description: descMatch?.[1] || '',
    package: '@kayou/hooks',
    importPath: `import { ${name} } from '@kayou/hooks';`,
    parameters,
    returnType: returnTypeMatch?.[1],
    returns,
    examples,
    usage: usageMatch?.[1]?.trim() || `import { ${name} } from '@kayou/hooks';`,
  };
}

// Parse icons from index file
function parseIcons(): IconData[] {
  const indexPath = path.join(ICONS_DIR, 'index.ts');
  const content = fs.readFileSync(indexPath, 'utf-8');

  const icons: IconData[] = [];
  const iconRegex = /export\s*\{\s*(\w+Icon)\s*\}\s*from\s*['"]\.\/([^'"]+)['"]/g;

  let match;
  while ((match = iconRegex.exec(content)) !== null) {
    const exportName = match[1];
    const fileName = match[2];
    // Convert PascalCase to readable name
    const name = exportName
      .replace(/Icon$/, '')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/(\d+)/g, ' $1');

    icons.push({
      name,
      exportName,
      fileName,
    });
  }

  return icons;
}

// Main function
async function main() {
  console.log('Generating kayou MCP data...');

  const components: ComponentData[] = [];
  const hooks: HookData[] = [];

  // Parse UI component docs
  const uiDocsDir = path.join(DOC_DIR, 'ui');
  if (fs.existsSync(uiDocsDir)) {
    const uiFiles = fs.readdirSync(uiDocsDir).filter(f => f.endsWith('.tsx'));
    for (const file of uiFiles) {
      const filePath = path.join(uiDocsDir, file);
      const component = parseComponentDoc(filePath);
      if (component) {
        components.push(component);
        console.log(`  Parsed component: ${component.name}`);
      }
    }
  }

  // Parse hook docs
  const hooksDocsDir = path.join(DOC_DIR, 'hooks');
  if (fs.existsSync(hooksDocsDir)) {
    const hookFiles = fs.readdirSync(hooksDocsDir).filter(f => f.endsWith('.tsx'));
    for (const file of hookFiles) {
      const filePath = path.join(hooksDocsDir, file);
      const hook = parseHookDoc(filePath);
      if (hook) {
        hooks.push(hook);
        console.log(`  Parsed hook: ${hook.name}`);
      }
    }
  }

  // Parse icons
  console.log('  Parsing icons...');
  const icons = parseIcons();
  console.log(`  Found ${icons.length} icons`);

  // Build output data
  const data: KayouData = {
    version: '0.1.0',
    generatedAt: new Date().toISOString(),
    components,
    hooks,
    icons,
  };

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`\nGenerated ${OUTPUT_FILE}`);
  console.log(`  Components: ${components.length}`);
  console.log(`  Hooks: ${hooks.length}`);
  console.log(`  Icons: ${icons.length}`);
}

main().catch(console.error);
