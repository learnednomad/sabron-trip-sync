import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';
import { formatCode } from '../utils/format.js';
import { getTemplateDir, getTargetDir } from '../utils/paths.js';

export interface ComponentOptions {
  preset: 'travel' | 'default';
  target: 'web' | 'mobile' | 'both';
  withValidation?: boolean;
  withState?: boolean;
  withI18n?: boolean;
}

export async function generateComponent(name: string, options: ComponentOptions) {
  const { preset, target, withValidation, withState, withI18n = true } = options;
  
  // Template data
  const templateData = {
    componentName: name,
    fileName: name.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1),
    preset,
    withValidation,
    withState,
    withI18n,
    imports: generateImports(options),
    variants: generateVariants(preset),
    props: generateProps(name, options),
    hooks: generateHooks(options),
  };

  const platforms = target === 'both' ? ['web', 'mobile'] : [target];

  for (const platform of platforms) {
    await generateComponentForPlatform(name, platform, templateData);
  }
}

function generateImports(options: ComponentOptions): string[] {
  const imports = [
    "import * as React from 'react';",
    "import { cva, type VariantProps } from 'class-variance-authority';",
  ];

  if (options.withI18n) {
    imports.push("import { useTranslation } from 'react-i18next';");
  }

  if (options.withState) {
    imports.push("import { useState } from 'react';");
  }

  if (options.withValidation) {
    imports.push("import { z } from 'zod';");
  }

  return imports;
}

function generateVariants(preset: string): string {
  const baseVariants = `cva(
  'relative rounded-lg border bg-card p-4 transition-all duration-200',
  {
    variants: {
      preset: {
        default: 'hover:shadow-md border-border',
        ${preset === 'travel' ? 'travel: \'border-blue-200 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50\',' : ''}
      },
      size: {
        small: 'p-2',
        default: 'p-4',
        large: 'p-6',
      },
    },
    defaultVariants: {
      preset: '${preset}',
      size: 'default',
    },
  }
)`;

  return baseVariants;
}

function generateProps(componentName: string, options: ComponentOptions): string {
  let props = `export interface ${componentName}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ${componentName.toLowerCase()}Variants> {`;

  if (options.withI18n) {
    props += `
  // Text content
  text?: string;
  tx?: string;
  txOptions?: Record<string, any>;`;
  }

  if (options.withState) {
    props += `
  
  // State
  value?: any;
  onChange?: (value: any) => void;`;
  }

  props += `
  
  // Actions
  onPress?: () => void;
  
  // Styling
  className?: string;
}`;

  return props;
}

function generateHooks(options: ComponentOptions): string {
  let hooks = '';

  if (options.withI18n) {
    hooks += '  const { t } = useTranslation();\n';
  }

  if (options.withState) {
    hooks += '  const [state, setState] = useState();\n';
  }

  return hooks;
}

async function generateComponentForPlatform(
  name: string, 
  platform: 'web' | 'mobile', 
  templateData: any
) {
  const templateDir = getTemplateDir();
  const templatePath = path.join(templateDir, 'component', `${platform}.hbs`);
  const templateContent = await fs.readFile(templatePath, 'utf8');
  
  const template = Handlebars.compile(templateContent);
  const code = template(templateData);
  const formattedCode = await formatCode(code);

  // Determine output path
  const fileName = `${templateData.fileName}.tsx`;
  const outputDir = platform === 'web' 
    ? getTargetDir('web', 'components', 'travel')
    : getTargetDir('mobile', 'components', 'travel');
  
  await fs.ensureDir(outputDir);
  const outputPath = path.join(outputDir, fileName);
  
  await fs.writeFile(outputPath, formattedCode);

  // Update index file
  await updateIndexFile(outputDir, name);
}

async function updateIndexFile(componentDir: string, componentName: string) {
  const indexPath = path.join(componentDir, 'index.ts');
  const fileName = componentName.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1);
  const exportLine = `export * from './${fileName}';`;

  let indexContent = '';
  if (await fs.pathExists(indexPath)) {
    indexContent = await fs.readFile(indexPath, 'utf8');
  }

  if (!indexContent.includes(exportLine)) {
    indexContent += `${exportLine}\n`;
    await fs.writeFile(indexPath, indexContent);
  }
}