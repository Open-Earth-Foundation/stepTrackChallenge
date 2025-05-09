import { FC } from "react";
import { Link } from "wouter";
import logoTypeSvg from "../assets/branding/logo-type.svg";
import { useTheme } from "@/components/ui/theme-provider";
import AuthWidget from "./AuthWidget";
import { differenceInCalendarDays } from "date-fns";

const Header: FC = () => {
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

        <div className="flex items-center">
          <AuthWidget />
        </div>
      </div>
    </header>
  );
};

export default Header;
