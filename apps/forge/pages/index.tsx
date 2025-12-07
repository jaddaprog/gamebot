import React from 'react';
import { AutoForm } from '../src/components/AutoForm';
import { ItemSchema } from '@nexus/shared';

export default function Home() {
  const onSubmit = (data: any) => {
    // For now, just log the submission. Connect to Supabase function later.
    console.log('Form submitted:', data);
    alert('Submitted (check console)');
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>The Forge — Create Item</h1>
      <AutoForm schema={ItemSchema} onSubmit={onSubmit} />
    </div>
  );
}
