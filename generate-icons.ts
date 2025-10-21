import fs from 'fs';
import path from 'path';

const inputDir = path.resolve('./icons');
const outputDir = path.resolve('./src/icons');

const iconWrapperImportPath = '../components/IconWrapper';

if (!fs.existsSync(inputDir)) {
  console.error('❌ Input directory not found:', inputDir);
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

const indexExports: string[] = [];

function cleanSvgInner(svg: string): string {
  const match = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  if (!match) return svg;

  let inner = match[1];

  inner = inner
    .replace(/\s*(stroke|fill)="(black|#000|none)"/gi, '')
    .replace(/\s*stroke-width="[^"]*"/gi, '')
    .replace(/\s*fill-rule="[^"]*"/gi, '')
    .replace(/\s*clip-rule="[^"]*"/gi, '');

  return inner.replace(/>\s+</g, '><').trim();
}

for (const file of fs.readdirSync(inputDir)) {
  if (!file.endsWith('.svg')) continue;

  const svgContent = fs.readFileSync(path.join(inputDir, file), 'utf8');
  const inner = cleanSvgInner(svgContent);
  if (!inner) continue;

  const baseName = path.basename(file, '.svg');
  const componentName =
    baseName
      .replace(/-./g, (s) => s[1].toUpperCase())
      .replace(/^\w/, (c) => c.toUpperCase()) + 'Icon';

  const tsx = `import { JSX } from 'solid-js';
import { IconWrapper, IconProps } from '${iconWrapperImportPath}';

export const ${componentName} = (props: IconProps): JSX.Element => (
  <IconWrapper {...props}>
    ${inner}
  </IconWrapper>
);
`;

  const outFile = path.join(outputDir, `${baseName}.tsx`);
  fs.writeFileSync(outFile, tsx, 'utf8');

  indexExports.push(`export { ${componentName} } from './${baseName}';`);
}

fs.writeFileSync(path.join(outputDir, 'index.ts'), indexExports.join('\n') + '\n');

console.warn(`✅ Generated ${indexExports.length} cleaned icons in ${outputDir}`);
