type PremiumAccessPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function PremiumAccessPage({
  searchParams,
}: PremiumAccessPageProps) {
  const params = await searchParams;
  const hasError = params.error === "invalid";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <section className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
          Creator OS Premium
        </p>

        <h1 className="mt-3 text-3xl font-extrabold">
          เข้าสู่ Premium Library
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-300">
          กรอกรหัสที่ได้รับเพื่อเข้าถึง Premium Content Library
        </p>

        <form
          action="/api/premium-login"
          method="post"
          className="mt-7"
        >
          <label
            htmlFor="accessCode"
            className="text-sm font-bold text-slate-200"
          >
            Premium Access Code
          </label>

          <input
            id="accessCode"
            name="accessCode"
            type="password"
            required
            autoComplete="current-password"
            placeholder="กรอกรหัส Premium"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
          />

          {hasError && (
            <p className="mt-3 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
              รหัสไม่ถูกต้อง กรุณาลองใหม่
            </p>
          )}

          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3 font-extrabold text-white transition hover:bg-indigo-500"
          >
            เข้าสู่ Premium Library
          </button>
        </form>

        <p className="mt-5 text-xs leading-6 text-slate-500">
          ระบบนี้เป็นประตูสำหรับ Private Beta ก่อนพัฒนาเป็นระบบสมาชิกเต็มรูปแบบ
        </p>
      </section>
    </main>
  );
}