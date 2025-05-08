import { FC } from "react";
import { Link } from "wouter";

interface HeaderProps {
  user: {
    displayName: string;
    initials: string;
    avatarColor: string;
  };
}

const Header: FC<HeaderProps> = ({ user }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <i className="ri-footprint-line text-primary text-2xl mr-2"></i>
          <h1 className="text-xl font-heading font-bold text-neutral-800">StepTogether</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className="text-primary hover:text-primary/80 transition-colors">Dashboard</a>
          </Link>
          <Link href="/challenges">
            <a className="text-neutral-500 hover:text-primary transition-colors">Challenges</a>
          </Link>
          <Link href="/team">
            <a className="text-neutral-500 hover:text-primary transition-colors">Team</a>
          </Link>
          <Link href="/achievements">
            <a className="text-neutral-500 hover:text-primary transition-colors">Achievements</a>
          </Link>
        </div>
        
        <div className="flex items-center">
          <div className="mr-3 relative">
            <i className="ri-notification-3-line text-neutral-500 text-xl cursor-pointer"></i>
            <div className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</div>
          </div>
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium cursor-pointer"
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.initials}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
