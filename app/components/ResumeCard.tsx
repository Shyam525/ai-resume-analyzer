import { link } from "fs";
import { Link } from "react-router";
import ScoreCard from "~/components/ScoreCircule";

interface ResumeCardProps {
  resume: any;
}

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
  return (
  <Link to = " to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000>
    <div className="flex flex-col gap-2">
        <h2 className="!text-black font-bold break-words">{companyName}</h2>
        <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
    </div>
    <div className="flex-shrink-0" >
        <ScoreCard score={feedback.OverallScore}/>
    </div>
  </Link>
  );
};

export default ResumeCard;