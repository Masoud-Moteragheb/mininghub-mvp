'use client';

import { useState } from "react";
import Link from "next/link";
import AuthCard from "../../../components/ui/AuthCard";
import Input from "../../../components/ui/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [remember, setRemember] = useState(true);
  const disabled = !email || !pw;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log({ email, pw, remember });
    alert("Demo only — no backend connected.");
  }

  return (
    <section className="min-h-[70vh] grid place-items-center">
      <form onSubmit={onSubmit} className="w-full max-w-md">
        <AuthCard
          title="Sign in to MiningHub"
          footer={<span>Don’t have an account? <Link className="text-emerald-700 hover:underline" href="/auth/signup">Create one</Link></span>}
        >
          <Input label="Email" name="email" type="email" placeholder="you@company.com" value={email} onChange={setEmail} required />
          <Input label="Password" name="password" type="password" placeholder="••••••••" value={pw} onChange={setPw} required />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} />
            Remember me
          </label>
          <button
            disabled={disabled}
            className={`mt-2 w-full rounded-xl px-3 py-2 text-sm font-medium text-white ${disabled ? "bg-neutral-400" : "bg-neutral-900 hover:bg-neutral-800"}`}
          >
            Sign in
          </button>
        </AuthCard>
      </form>
    </section>
  );
}
