'use client';

import { useState, useMemo } from "react";
import Link from "next/link";
import AuthCard from "../../../components/ui/AuthCard";
import Input from "../../../components/ui/Input";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [agree, setAgree] = useState(true);

  const match = pw && pw2 && pw === pw2;
  const disabled = !name || !email || !pw || !pw2 || !agree || !match;

  const pwHint = useMemo(()=>{
    if (!pw) return "Use 8+ chars with letters & numbers.";
    if (pw.length < 8) return "Password is too short.";
    return "";
  }, [pw]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log({ name, email, pw });
    alert("Demo only — account not actually created.");
  }

  return (
    <section className="min-h-[70vh] grid place-items-center">
      <form onSubmit={onSubmit} className="w-full max-w-md">
        <AuthCard
          title="Create your MiningHub account"
          footer={<span>Already have an account? <Link className="text-emerald-700 hover:underline" href="/auth/login">Sign in</Link></span>}
        >
          <Input label="Full name" name="name" value={name} onChange={setName} placeholder="Jane Doe" required />
          <Input label="Email" name="email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" required />
          <Input label="Password" name="password" type="password" value={pw} onChange={setPw} placeholder="••••••••" required />
          {pwHint && <p className="text-xs text-amber-700">{pwHint}</p>}
          <Input label="Confirm password" name="password2" type="password" value={pw2} onChange={setPw2} placeholder="••••••••" required />
          {pw && pw2 && !match && <p className="text-xs text-amber-700">Passwords do not match.</p>}

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
            I agree to the <a className="text-emerald-700 hover:underline" href="#">Terms</a> and <a className="text-emerald-700 hover:underline" href="#">Privacy</a>.
          </label>

          <button
            disabled={disabled}
            className={`mt-2 w-full rounded-xl px-3 py-2 text-sm font-medium text-white ${disabled ? "bg-neutral-400" : "bg-neutral-900 hover:bg-neutral-800"}`}
          >
            Create account
          </button>
        </AuthCard>
      </form>
    </section>
  );
}
