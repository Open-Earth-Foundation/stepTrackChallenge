import { FC } from "react";
import { Link, useLocation } from "wouter";

const MobileNav: FC = () => {
  const [location] = useLocation();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white bottom-nav">
      <div className="flex justify-around items-center py-3">
        <Link href="/">
          <a className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${location === "/" ? "text-primary" : "text-neutral-500"}`}>
              <i className="ri-home-5-line text-xl"></i>
            </div>
            <span className={`text-xs ${location === "/" ? "text-primary font-medium" : "text-neutral-500"} mt-1`}>Home</span>
          </a>
        </Link>
        
        <Link href="/challenges">
          <a className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${location === "/challenges" ? "text-primary" : "text-neutral-500"}`}>
              <i className="ri-trophy-line text-xl"></i>
            </div>
            <span className={`text-xs ${location === "/challenges" ? "text-primary font-medium" : "text-neutral-500"} mt-1`}>Challenges</span>
          </a>
        </Link>
        
        <Link href="/steps">
          <a className="flex flex-col items-center">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary text-white -mt-8 shadow-lg">
              <i className="ri-footprint-line text-2xl"></i>
            </div>
            <span className="text-xs text-primary font-medium mt-1">Steps</span>
          </a>
        </Link>
        
        <Link href="/team">
          <a className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${location === "/team" ? "text-primary" : "text-neutral-500"}`}>
              <i className="ri-team-line text-xl"></i>
            </div>
            <span className={`text-xs ${location === "/team" ? "text-primary font-medium" : "text-neutral-500"} mt-1`}>Team</span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${location === "/profile" ? "text-primary" : "text-neutral-500"}`}>
              <i className="ri-user-line text-xl"></i>
            </div>
            <span className={`text-xs ${location === "/profile" ? "text-primary font-medium" : "text-neutral-500"} mt-1`}>Profile</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
