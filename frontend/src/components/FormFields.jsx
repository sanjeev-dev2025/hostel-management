import React from 'react';

export function InputField({ label, type = "text", error, register, name, rules, placeholder, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {rules?.required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`input-field ${error ? 'input-error' : ''}`}
        {...register(name, rules)}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

export function SelectField({ label, error, register, name, rules, options, placeholder, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {rules?.required && <span className="text-red-500">*</span>}
      </label>
      <select
        className={`input-field ${error ? 'input-error' : ''}`}
        {...register(name, rules)}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

export function TextAreaField({ label, error, register, name, rules, placeholder, rows = 3, ...props }) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label} {rules?.required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          placeholder={placeholder}
          rows={rows}
          className={`input-field resize-y ${error ? 'input-error' : ''}`}
          {...register(name, rules)}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
      </div>
    );
  }
