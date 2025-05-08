import { FC } from "react";
import { Link } from "wouter";
import logoTypeSvg from "../assets/branding/logo-type.svg";
import { useTheme } from "@/components/ui/theme-provider";

interface HeaderProps {
  user: {
    displayName: string;
    initials: string;
    avatarColor: string;
  };
}

const Header: FC<HeaderProps> = ({ user }) => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  
  return (
    <header className="bg-white shadow-sm dark:bg-gray-900">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <img src={logoTypeSvg} alt="StepTogether Logo" className="h-12" />
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className="text-primary hover:text-primary/80 transition-colors font-medium">Dashboard</a>
          </Link>
          <Link href="/">
            <a className="text-neutral-500 hover:text-primary transition-colors dark:text-neutral-300">Challenges</a>
          </Link>
          <Link href="/">
            <a className="text-neutral-500 hover:text-primary transition-colors dark:text-neutral-300">Team</a>
          </Link>
          <Link href="/">
            <a className="text-neutral-500 hover:text-primary transition-colors dark:text-neutral-300">Achievements</a>
          </Link>
        </div>
        
        <div className="flex items-center">
          <button 
            onClick={toggleTheme} 
            className="mr-4 text-neutral-500 dark:text-neutral-300 hover:text-primary dark:hover:text-primary transition-colors"
          >
            {theme === "light" ? (
              <i className="ri-moon-line text-xl"></i>
            ) : (
              <i className="ri-sun-line text-xl"></i>
            )}
          </button>
          <div className="mr-4 relative">
            <i className="ri-notification-3-line text-neutral-500 dark:text-neutral-300 text-xl cursor-pointer"></i>
            <div className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</div>
          </div>
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium cursor-pointer shadow-sm"
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
