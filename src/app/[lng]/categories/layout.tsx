'use server';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { initTranslation } from '@/app/i18n';

type LayoutProps = {
  readonly children: ReactNode;
  readonly params: { lng: string };
};

export async function generateMetadata({
  params: { lng },
}: LayoutProps): Promise<Metadata> {
  const { t } = await initTranslation(lng);
  return {
    alternates: {
      canonical: `/categories/`,
      languages: {
        en: `/en/categories/`,
        ru: `/ru/categories/`,
      },
    },
    title: {
      template: '%s | CODOGMA',
      default: t('categories'),
    },
    description: t('categoriesDescription'),
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
