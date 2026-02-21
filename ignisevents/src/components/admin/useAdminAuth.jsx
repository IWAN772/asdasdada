import { useState, useEffect } from 'react';

import { STORED_KEY, EXPECTED } from '@/lib/adminAuth';

export function useAdminAuth() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORED_KEY);
    setIsAuthorized(stored === EXPECTED);
    setChecked(true);
  }, []);

  return { isAuthorized, checked, setIsAuthorized };
}