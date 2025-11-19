export default function AuthCard({ title, children, footer }: {title:string; children:React.ReactNode; footer?:React.ReactNode}) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-center text-xl font-semibold text-emerald-700">{title}</h1>
      <div className="space-y-3">{children}</div>
      {footer && <div className="mt-4 text-center text-sm text-neutral-600">{footer}</div>}
    </div>
  );
}
