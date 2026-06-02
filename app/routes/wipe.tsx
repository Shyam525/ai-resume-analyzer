import { Link } from "react-router";

export const meta = () => [
  { title: "Resumind | Reset" },
  { name: "description", content: "Reset placeholder page." },
];

const WipePage = () => {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen px-4 py-10">
      <section className="mx-auto flex max-w-2xl flex-col gap-6 rounded-[28px] bg-white/90 p-8 shadow-[0_22px_60px_rgba(121,137,191,0.12)] backdrop-blur-sm">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Reset Data
          </p>
          <h1 className="max-w-none">Wipe Route Ready</h1>
          <h2>This page exists now, so the route config is valid.</h2>
        </div>

        <Link to="/" className="primary-button w-fit px-6">
          Back Home
        </Link>
      </section>
    </main>
  );
};

export default WipePage;
