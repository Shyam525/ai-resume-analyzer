import { Link } from "react-router";
import ScoreCard from "~/components/ScoreCircule";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
  return (
    <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
      <div className="resume-card-header w-full">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h2 className="break-words text-[2rem] font-bold leading-none !text-black">{companyName}</h2>
          <h3 className="break-words text-xl font-medium text-gray-500">{jobTitle}</h3>
        </div>

        <div className="flex-shrink-0">
          <ScoreCard score={feedback.overallScore} />
        </div>
      </div>

      <div className="gradient-border resume-preview-shell animate-in fade-in duration-1000">
        <div className="resume-preview-frame">
          <img
            src={imagePath}
            alt="resume"
            className="resume-preview-image"
          />
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;
