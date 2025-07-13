import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';
import { formatCode } from '../utils/format.js';
import { getTemplateDir, getTargetDir } from '../utils/paths.js';

export interface ScreenOptions {
  target: 'web' | 'mobile' | 'both';
  withHeader?: boolean;
  withLoading?: boolean;
  withTabs?: boolean;
  type: 'single' | 'multi-step';
}

export async function generateScreen(name: string, options: ScreenOptions) {
  const { target, withHeader = true, withLoading = true, withTabs, type } = options;
  
  // Template data
  const templateData = {
    screenName: name,
    fileName: name.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1),
    withHeader,
    withLoading,
    withTabs,
    isMultiStep: type === 'multi-step',
    imports: generateScreenImports(options),
    hooks: generateScreenHooks(options),
    steps: generateSteps(type),
  };

  const platforms = target === 'both' ? ['web', 'mobile'] : [target];

  for (const platform of platforms) {
    await generateScreenForPlatform(name, platform, templateData);
  }
}

function generateScreenImports(options: ScreenOptions): string[] {
  const imports = [
    "import * as React from 'react';",
    "import { useState } from 'react';",
  ];

  if (options.withHeader) {
    imports.push("import { Header, Screen } from '@/components/travel';");
  }

  if (options.withLoading) {
    imports.push("import { LoadingState, ErrorState } from '@/components/travel';");
  }

  if (options.withTabs) {
    imports.push("import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';");
  }

  return imports;
}

function generateScreenHooks(options: ScreenOptions): string {
  let hooks = '';

  if (options.withLoading) {
    hooks += `  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
`;
  }

  if (options.type === 'multi-step') {
    hooks += `  const [currentStep, setCurrentStep] = useState(0);
`;
  }

  if (options.withTabs) {
    hooks += `  const [activeTab, setActiveTab] = useState('overview');
`;
  }

  return hooks;
}

function generateSteps(type: string): string[] {
  if (type === 'multi-step') {
    return [
      'Basic Information',
      'Travel Preferences', 
      'Budget & Duration',
      'Review & Confirm'
    ];
  }
  return [];
}

async function generateScreenForPlatform(
  name: string, 
  platform: 'web' | 'mobile', 
  templateData: any
) {
  const templateDir = getTemplateDir();
  const templatePath = path.join(templateDir, 'screen', `${platform}.hbs`);
  const templateContent = await fs.readFile(templatePath, 'utf8');
  
  const template = Handlebars.compile(templateContent);
  const code = template(templateData);
  const formattedCode = await formatCode(code);

  // Determine output path
  const fileName = `${templateData.fileName}.tsx`;
  const outputDir = platform === 'web' 
    ? getTargetDir('web', 'app', '(app)')
    : getTargetDir('mobile', 'app', '(app)');
  
  await fs.ensureDir(outputDir);
  const outputPath = path.join(outputDir, fileName);
  
  await fs.writeFile(outputPath, formattedCode);
}