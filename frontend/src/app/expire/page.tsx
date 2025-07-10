import SessionExpiredClient from '@/components/expire/sessionExpiredClient';
import { Suspense } from 'react';


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionExpiredClient />
    </Suspense>
  );
}
