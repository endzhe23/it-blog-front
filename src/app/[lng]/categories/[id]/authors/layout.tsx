'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { initTranslation } from '@/app/i18n';
import { getCategoryById } from '@/helpers/categoryApi';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { id: number; lng: string };
};

export async function generateMetadata({
  params: { id, lng },
}: LayoutProps): Promise<Metadata> {
  const category = await getCategoryById(id, lng);
  const { t } = await initTranslation(lng, 'categories');
  return {
    alternates: {
      canonical: `/categories/${id}/authors`,
      languages: {
        en: `/en/categories/${id}/authors`,
        ru: `/ru/categories/${id}/authors`,
      },
    },
    title: {
      template: '%s | CODOGMA',
      default: t('authorsInCategory') + ' ' + category.name,
    },
    description: category.description,
    keywords: category.tags.map((tag) => tag.name),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}