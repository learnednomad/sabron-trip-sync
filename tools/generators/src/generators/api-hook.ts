import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';
import { formatCode } from '../utils/format.js';
import { getTemplateDir, getTargetDir } from '../utils/paths.js';

export interface ApiHookOptions {
  withMutation?: boolean;
  withCache?: boolean;
}

export async function generateApiHook(name: string, options: ApiHookOptions) {
  const { withMutation, withCache = true } = options;
  
  // Extract operation from hook name
  const operation = extractOperation(name);
  const entityName = extractEntity(name);
  
  // Template data
  const templateData = {
    hookName: name,
    fileName: name.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1),
    operation,
    entityName,
    entityNameLower: entityName.toLowerCase(),
    withMutation,
    withCache,
    imports: generateApiImports(options),
    queryKey: generateQueryKey(entityName, operation),
    endpoint: generateEndpoint(entityName, operation),
  };

  await generateApiHookFile(name, templateData);
}

function extractOperation(hookName: string): string {
  // Extract operation from useTripBooking -> booking, useTrips -> fetch
  const withoutUse = hookName.replace(/^use/, '');
  if (withoutUse.includes('Create') || withoutUse.includes('Add')) return 'create';
  if (withoutUse.includes('Update') || withoutUse.includes('Edit')) return 'update';
  if (withoutUse.includes('Delete') || withoutUse.includes('Remove')) return 'delete';
  if (withoutUse.includes('Book')) return 'booking';
  return 'fetch';
}

function extractEntity(hookName: string): string {
  // Extract entity from useTripBooking -> Trip, useTrips -> Trip
  const withoutUse = hookName.replace(/^use/, '');
  const withoutOperation = withoutUse
    .replace(/(Create|Add|Update|Edit|Delete|Remove|Book)/, '')
    .replace(/s$/, ''); // Remove plural
  
  return withoutOperation || 'Item';
}

function generateApiImports(options: ApiHookOptions): string[] {
  const imports = [
    "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';",
    "import { apiClient } from '@/lib/api-client';",
  ];

  if (options.withMutation) {
    imports.push("import { toast } from 'sonner';");
  }

  return imports;
}

function generateQueryKey(entity: string, operation: string): string {
  const entityLower = entity.toLowerCase();
  switch (operation) {
    case 'fetch':
      return `['${entityLower}s']`;
    case 'booking':
      return `['${entityLower}', 'booking']`;
    default:
      return `['${entityLower}', '${operation}']`;
  }
}

function generateEndpoint(entity: string, operation: string): string {
  const entityLower = entity.toLowerCase();
  switch (operation) {
    case 'fetch':
      return `/${entityLower}s`;
    case 'create':
      return `/${entityLower}s`;
    case 'update':
      return `/${entityLower}s/\${id}`;
    case 'delete':
      return `/${entityLower}s/\${id}`;
    case 'booking':
      return `/${entityLower}s/\${id}/book`;
    default:
      return `/${entityLower}s`;
  }
}

async function generateApiHookFile(name: string, templateData: any) {
  const templateDir = getTemplateDir();
  const templatePath = path.join(templateDir, 'api-hook', 'hook.hbs');
  const templateContent = await fs.readFile(templatePath, 'utf8');
  
  const template = Handlebars.compile(templateContent);
  const code = template(templateData);
  const formattedCode = await formatCode(code);

  // Determine output path - both web and mobile use same API hooks
  const fileName = `${templateData.fileName}.ts`;
  const outputDir = getTargetDir('shared', 'api', templateData.entityNameLower);
  
  await fs.ensureDir(outputDir);
  const outputPath = path.join(outputDir, fileName);
  
  await fs.writeFile(outputPath, formattedCode);

  // Update index file
  await updateApiIndexFile(outputDir, name);
}

async function updateApiIndexFile(apiDir: string, hookName: string) {
  const indexPath = path.join(apiDir, 'index.ts');
  const fileName = hookName.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1);
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