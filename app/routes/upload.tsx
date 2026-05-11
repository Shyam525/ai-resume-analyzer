import { Link } from "react-router";

export const meta = () => [
  { title: "Resumind | Upload" },
  { name: "description", content: "Upload your resume for analysis." },
];

const UploadPage = () => {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen px-4 py-10">
      <section className="mx-auto flex max-w-3xl flex-col gap-6 rounded-[28px] bg-white/90 p-8 shadow-[0_22px_60px_rgba(121,137,191,0.12)] backdrop-blur-sm">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Resume Upload
          </p>
          <h1 className="max-w-none">Upload Your Resume</h1>
          <h2 className="max-w-2xl">
            This route is now connected correctly. You can build the upload form here next.
          </h2>
        </div>

        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
          Drop zone placeholder
        </div>

        <div className="flex gap-3">
          <Link to="/" className="primary-button w-fit px-6">
            Back Home
          </Link>
          <Link to="/auth" className="primary-button w-fit px-6">
            Go to Auth
          </Link>
        </div>
      </section>
    </main>
  );
};

export default UploadPage;
