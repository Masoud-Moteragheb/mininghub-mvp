'use client';
import { useState } from "react";

export default function Input({
  label, type="text", name, placeholder, required, value, onChange,
}: {
  label: string; type?: string; name: string; placeholder?: string;
  required?: boolean; value: string; onChange: (v: string)=>void;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <label className="block text-sm">
      <span className="mb-1 inline-block text-neutral-600">{label}</span>
      <div className="relative">
        <input
          name={name}
          type={isPassword ? (show ? "text" : "password") : type}
          value={value}
          onChange={(e)=>onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="w-full rounded-xl border px-3 py-2 pr-16 outline-none focus:ring-2 focus:ring-emerald-300"
        />
        {isPassword && (
          <button
            type="button"
            onClick={()=>setShow(s=>!s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs rounded-lg border px-2 py-1 text-neutral-600 hover:bg-neutral-50"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </label>
  );
}
