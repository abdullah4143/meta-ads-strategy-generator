'use client';

import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { Globe } from 'lucide-react';

type Locale = 'en' | 'lv';

export default function LanguageSwitcher() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  
  const currentLocale = (params.locale as Locale) || 'en';

  function onSelectChange(nextLocale: Locale) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => onSelectChange(currentLocale === 'en' ? 'lv' : 'en')}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
      >
        <Globe size={16} />
        <span className="uppercase">{currentLocale === 'en' ? 'LV' : 'EN'}</span>
      </button>
    </div>
  );
}
