import { readFileSync } from 'fs';
import path from 'path';
import type { SiteContent } from '@/types/content';
import ClientPage from './client-page';

async function getContent(): Promise<SiteContent> {
  const file = path.join(process.cwd(), 'data', 'content.json');
  return JSON.parse(readFileSync(file, 'utf-8'));
}

export default async function Page() {
  const content = await getContent();
  return <ClientPage content={content} />;
}
