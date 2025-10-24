import { CalendarDays, Bell, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-[#cbb5b0] w-full py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-8 gap-4 md:gap-0">
        {/* Left Title */}
        <h1 className="text-2xl font-semibold text-[#6b4b4b] mb-2 md:mb-0">
          Just5 <span className="text-gray-100 font-bold">To-Do</span>
        </h1>

        {/* Search Bar */}
        <div className="flex items-center w-full md:w-2/4 relative order-2 md:order-none mb-2 md:mb-0">
          <input
            type="text"
            placeholder="Search your task here..."
            className="w-full rounded-full py-2 pl-4 pr-10 text-sm text-gray-700 placeholder-gray-100 focus:outline-none focus:ring-2 focus:ring-[#a47376] shadow-sm bg-white/20"
          />
          <Search className="absolute right-3 text-[#a47376] w-5 h-5" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 text-white">
          <Bell className="w-5 h-5" />
          <p className="text-sm font-medium text-center md:text-right">
            Tuesday
            <br />
            25/06/2023
          </p>
        </div>
      </div>
    </header>
  );
}