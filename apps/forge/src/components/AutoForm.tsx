'use client';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const FieldMapper = ({ name, schema, register, error }: any) => {
  const def = schema._def;

  if (def.typeName === 'ZodEnum') {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold text-gray-300 capitalize">{name}</label>
        <select 
          {...register(name)} 
          className="bg-gray-800 border border-gray-700 rounded p-2 text-white"
        >
          {def.values.map((val: string) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
        {error && <span className="text-red-500 text-xs">{error.message}</span>}
      </div>
    );
  }

  if (def.typeName === 'ZodNumber') {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold text-gray-300 capitalize">{name}</label>
        <input 
          type="number" 
          {...register(name, { valueAsNumber: true })} 
          className="bg-gray-900 border border-gray-700 rounded p-2 text-white"
        />
        {error && <span className="text-red-500 text-xs">{error.message}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-bold text-gray-300 capitalize">{name}</label>
      <input 
        {...register(name)} 
        className="bg-gray-900 border border-gray-700 rounded p-2 text-white"
        placeholder={`Enter ${name}...`}
      />
      {error && <span className="text-red-500 text-xs">{error.message}</span>}
    </div>
  );
};

interface AutoFormProps<T extends z.ZodTypeAny> {
  schema: T;
  onSubmit: SubmitHandler<z.infer<T>>;
}

export function AutoForm<T extends z.ZodTypeAny>({ schema, onSubmit }: AutoFormProps<T>) {
  const form = useForm({ resolver: zodResolver(schema) });
  const shape = (schema as any).shape || {};

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6 bg-gray-800 rounded-lg border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(shape).map((key) => {
          if (key === 'id') return null;
          return (
            <FieldMapper 
              key={key} 
              name={key} 
              schema={shape[key]} 
              register={form.register}
              error={form.formState.errors[key]}
            />
          );
        })}
      </div>
      <div className="pt-4 border-t border-gray-700 flex justify-end">
        <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded">
          Forge Item
        </button>
      </div>
    </form>
  );
}
