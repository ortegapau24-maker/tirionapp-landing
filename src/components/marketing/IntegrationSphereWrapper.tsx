'use client';
import dynamic from 'next/dynamic';

export const IntegrationSphere = dynamic(
    () => import('./IntegrationSphere'),
    { ssr: false }
);
