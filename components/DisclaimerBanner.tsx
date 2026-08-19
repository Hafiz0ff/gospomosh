import React from 'react';
import { APP_CONFIG } from '@/lib/config';
import { ShieldAlert } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-[#FFD9A0]/40 border-b border-[#FFD9A0] text-[#08525a] px-4 py-2.5 text-xs sm:text-sm font-medium">
      <div className="max-w-7xl mx-auto flex items-start sm:items-center space-x-2.5">
        <ShieldAlert className="w-4 h-4 text-[#FF8C42] flex-shrink-0 mt-0.5 sm:mt-0" />
        <div>
          <span className="font-bold">Независимый сервис: </span>
          {APP_CONFIG.disclaimer}
        </div>
      </div>
    </div>
  );
}
