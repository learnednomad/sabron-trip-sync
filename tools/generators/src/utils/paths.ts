import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getTemplateDir(): string {
  return path.join(__dirname, '../../templates');
}

export function getTargetDir(platform: 'web' | 'mobile' | 'shared', ...segments: string[]): string {
  const rootDir = path.join(__dirname, '../../../..');
  
  switch (platform) {
    case 'web':
      return path.join(rootDir, 'apps', 'web', 'src', ...segments);
    case 'mobile':
      return path.join(rootDir, 'apps', 'mobile', 'src', ...segments);
    case 'shared':
      return path.join(rootDir, 'packages', ...segments);
    default:
      throw new Error(`Unknown platform: ${platform}`);
  }
}

export function getProjectRoot(): string {
  return path.join(__dirname, '../../../..');
}