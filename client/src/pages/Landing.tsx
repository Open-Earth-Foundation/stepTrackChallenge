import { FC } from "react";
import { Link } from "wouter";
import logoTypeSvg from "../assets/branding/logo-type.svg";
import brazilCountrySvg from "../assets/branding/brazil-country.svg";
import { Button } from "@/components/ui/button";

const Landing: FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
        
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <img src={logoTypeSvg} alt="StepTogether" className="h-12" />
            <div className="flex space-x-4">
              <Button variant="ghost" className="text-primary hover:text-primary/80 dark:text-white">About</Button>
              <Button variant="ghost" className="text-primary hover:text-primary/80 dark:text-white">Features</Button>
              <Button variant="ghost" className="text-primary hover:text-primary/80 dark:text-white">Contact</Button>
              <Link href="/dashboard">
                <Button variant="default" className="bg-primary hover:bg-primary/90 text-white">Sign In</Button>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary mb-6">
              Challenge Yourself<br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Across Brazil
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
              Join our step tracking challenge and travel virtually across Brazil's beautiful landscapes. Track your progress, compete with friends, and reach important landmarks together.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg w-full sm:w-auto">
                  <span>Join Challenge</span>
                </Button>
              </Link>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <img src={brazilCountrySvg} alt="Brazil Map" className="w-full max-w-lg" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
      </div>
      
      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">How StepTogether Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-blue-50 dark:bg-gray-800 p-8 rounded-xl">
              <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Join a Challenge</h3>
              <p className="text-gray-600 dark:text-gray-300">Sign up and join our Brazil Steps Challenge. Connect with friends and colleagues to track progress together.</p>
            </div>
            
            <div className="bg-blue-50 dark:bg-gray-800 p-8 rounded-xl">
              <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Track Your Steps</h3>
              <p className="text-gray-600 dark:text-gray-300">Input your daily steps and watch as they translate into distance traveled across Brazil's beautiful landscapes.</p>
            </div>
            
            <div className="bg-blue-50 dark:bg-gray-800 p-8 rounded-xl">
              <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Reach Landmarks</h3>
              <p className="text-gray-600 dark:text-gray-300">Discover new landmarks as you progress through the journey, learning about the geography and culture of Brazil.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">Join thousands of people tracking their steps and exploring Brazil virtually. Start your journey today!</p>
          <Link href="/dashboard">
            <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg">
              Start Now
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <img src={logoTypeSvg} alt="StepTogether" className="h-10 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 max-w-md">Track your steps and explore the world virtually with friends and colleagues. Our Journey Across Brazil.</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-12">
              <div>
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">About</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">Features</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">Privacy</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-6 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} StepTogether. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;