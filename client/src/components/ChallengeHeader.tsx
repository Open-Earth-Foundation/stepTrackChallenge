import { FC } from "react";

interface ChallengeHeaderProps {
  challenge: {
    name: string;
    description: string;
    endDate: Date;
  };
  participants: number;
}

const ChallengeHeader: FC<ChallengeHeaderProps> = ({ challenge, participants }) => {
  // Calculate days remaining
  const today = new Date();
  const endDate = new Date(challenge.endDate);
  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center mb-2">
            <h2 className="text-2xl font-heading font-bold text-neutral-800">{challenge.name}</h2>
            <span className="ml-3 px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">ACTIVE</span>
          </div>
          <p className="text-neutral-500 mb-2">{challenge.description}</p>
          <div className="flex items-center">
            <div className="flex -space-x-3">
              {/* These would be user avatars - for now using placeholders */}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-xs">JD</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-secondary text-white flex items-center justify-center text-xs">KL</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-accent text-white flex items-center justify-center text-xs">MR</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-500 text-white flex items-center justify-center text-xs">+5</div>
            </div>
            <span className="ml-4 text-sm text-neutral-500">{participants} team members</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-1">
              <i className="ri-time-line text-primary mr-1"></i>
              <span className="text-sm text-neutral-500">Ends in:</span>
            </div>
            <div className="text-xl font-bold text-neutral-800">{daysRemaining} days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeHeader;
