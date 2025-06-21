'use client';

import dynamic from 'next/dynamic';

// import ClientNav dynamically with ssr: false
const ClientNav = dynamic(() => import('./ClientNav'), { ssr: false });

export default function ClientOnlyNavWrapper() {
  return <ClientNav />;
}
