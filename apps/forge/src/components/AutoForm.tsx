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
        'use client';
        import React from 'react';
        import { useForm, useFieldArray, SubmitHandler, Control } from 'react-hook-form';
        import { zodResolver } from '@hookform/resolvers/zod';
        import { z } from 'zod';

        // ---------------------------------------------------------------------------
        // Sub-Component: Array Field Manager (Handles Nested Lists like 'Abilities')
        // ---------------------------------------------------------------------------
        const ArrayField = ({ 
          name, 
          control, 
          schema, 
          register, 
          error 
        }: { 
          name: string; 
          control: Control<any>; 
          schema: z.ZodArray<any>; 
          register: any; 
          error?: any 
        }) => {
          const { fields, append, remove } = useFieldArray({
            control,
            name
          });

          // Extract the schema for a single item in the array
          const itemSchema = schema.element;

          return (
            <div className="flex flex-col gap-2 border-l-2 border-gray-600 pl-4 mt-2">
              <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">{name}</label>
      
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 bg-gray-900 rounded border border-gray-700 relative group">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-300 text-xs uppercase font-bold">
                      Remove
                    </button>
                  </div>
          
                  {/* Recursive rendering for the object inside the array */}
                  <div className="grid grid-cols-1 gap-4">
                     {/* Note: In a full prod version, we would recursively call FieldMapper here. 
                         For this implementation, we assume the array contains Objects. */}
                     {Object.keys((itemSchema as any).shape).map((subKey) => (
                        <FieldMapper
                          key={`${name}.${index}.${subKey}`}
                          name={`${name}.${index}.${subKey}`}
                          schema={(itemSchema as any).shape[subKey]}
                          register={register}
                          control={control}
                          // Error handling for nested fields is complex; simplified here for readability
                          error={undefined} 
                        />
                     ))}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({})} // Appends a blank object based on schema defaults
                className="self-start text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
              >
                + Add {name.slice(0, -1)}
              </button>
              {error && <span className="text-red-500 text-xs">{error.message}</span>}
            </div>
          );
        };

        // ---------------------------------------------------------------------------
        // Main Field Mapper: Selects UI based on Zod Type
        // ---------------------------------------------------------------------------
        const FieldMapper = ({ name, schema, register, control, error }: any) => {
          const def = schema._def;

          // 1. Enum -> Select
          if (def.typeName === 'ZodEnum') {
            return (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-400 uppercase">{name.split('.').pop()}</label>
                <select {...register(name)} className="bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm">
                  {def.values.map((val: string) => <option key={val} value={val}>{val}</option>)}
                </select>
              </div>
            );
          }

          // 2. Number -> Input
          if (def.typeName === 'ZodNumber') {
            return (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-400 uppercase">{name.split('.').pop()}</label>
                <input type="number" {...register(name, { valueAsNumber: true })} className="bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm" />
                {error && <span className="text-red-500 text-xs">{error.message}</span>}
              </div>
            );
          }

          // 3. Array -> ArrayField Component (Recursive handling)
          if (def.typeName === 'ZodArray') {
            return <ArrayField name={name} control={control} schema={schema} register={register} error={error} />;
          }

          // 4. Object -> Render Nested Fields Flattened
          if (def.typeName === 'ZodObject') {
             return (
                <div className="border border-gray-700 p-4 rounded bg-gray-800/50">
                   <label className="text-sm font-bold text-blue-400 mb-2 block capitalize">{name.split('.').pop()}</label>
                   <div className="grid grid-cols-2 gap-4">
                      {Object.keys(schema.shape).map((subKey) => (
                         <FieldMapper
                            key={`${name}.${subKey}`}
                            name={`${name}.${subKey}`}
                            schema={schema.shape[subKey]}
                            register={register}
                            control={control}
                            error={error}
                         />
                      ))}
                   </div>
                </div>
             )
          }

          // 5. Default -> Text Input
          return (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase">{name.split('.').pop()}</label>
              <input {...register(name)} className="bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm" placeholder="..." />
              {error && <span className="text-red-500 text-xs">{error.message}</span>}
            </div>
          );
        };

        // ---------------------------------------------------------------------------
        // The AutoForm Container
        // ---------------------------------------------------------------------------
        interface AutoFormProps<T extends z.ZodTypeAny> {
          schema: T;
          onSubmit: SubmitHandler<z.infer<T>>;
          defaultValues?: any;
        }

        export function AutoForm<T extends z.ZodTypeAny>({ schema, onSubmit, defaultValues }: AutoFormProps<T>) {
          const form = useForm({
            resolver: zodResolver(schema),
            defaultValues
          });

          const shape = (schema as any).shape || {};

          return (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 bg-[#0b1220] text-gray-100 rounded-xl shadow-2xl border border-gray-800">
              <div className="space-y-4">
                {Object.keys(shape).map((key) => {
                  if (key === 'id') return null; // Auto-generated
                  return (
                    <FieldMapper 
                      key={key} 
                      name={key} 
                      schema={shape[key]} 
                      register={form.register}
                      control={form.control}
                      error={form.formState.errors[key]}
                    />
                  );
                })}
              </div>

              <div className="pt-6 border-t border-gray-700 flex justify-end gap-3">
                <button type="button" className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-lg transition-all transform hover:scale-105">
                  Forge Item
                </button>
              </div>
            </form>
          );
        }
