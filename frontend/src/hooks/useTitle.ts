import { useEffect } from 'react';

export default function useTitle(title: string): void {
  useEffect(() => {
    document.title = `Matcha Wallet | ${title}`;
  }, [title]);
}
