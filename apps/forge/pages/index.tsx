import React from 'react';
import { AutoForm } from '../src/components/AutoForm';
import { ItemSchema } from '@nexus/shared';

export default function Home() {
  const [loading, setLoading] = React.useState(false);
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const fnUrl = (process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL) || '/api/create_item';
      const resp = await fetch(fnUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        console.error('Function error', json);
        alert('Error: ' + JSON.stringify(json));
      } else {
        console.log('Created', json);
        alert('Item created successfully');
      }
    } catch (err) {
      console.error('Submit error', err);
      alert('Submit failed: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>The Forge — Create Item</h1>
      <AutoForm schema={ItemSchema} onSubmit={onSubmit} />
      {loading && <p>Submitting...</p>}
    </div>
  );
}
