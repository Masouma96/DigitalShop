import React from 'react';
import NextLink from 'next/link';
import { Link as LinkIcon, MonitorSmartphone } from 'lucide-react';
import { Button } from './ui';

function Welcome() {
  return (
    <div className="flex flex-col justify-center items-center mt-6">
      <span>Welcome to</span>
      <div className="flex items-center gap-3">
        <MonitorSmartphone />
        <h1 className="text-2xl font-bold text-grey-600">Digital Shop</h1>
      </div>
      <Button asChild variant="secondary" className="mt-6">
        <NextLink href="/products" className="inline-flex items-center gap-2">
          <LinkIcon className="size-4" />
          Browse products
        </NextLink>
      </Button>
    </div>
  );
}

export default Welcome;
