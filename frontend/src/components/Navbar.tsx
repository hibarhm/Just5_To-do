import { CalendarDays, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();

     
      const dayName = now.toLocaleDateString("en-GB", { weekday: "long" });

      // Format date as DD/MM/YYYY
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      setCurrentDate(`${dayName}, ${formattedDate}`);
    };

    updateDate(); 

    const interval = setInterval(updateDate, 60 * 1000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#cbb5b0] w-full py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8">
        {/* Left Title */}
        <h1 className="text-2xl font-semibold text-[#6b4b4b]">
          Just5 <span className="text-gray-100 font-bold">To-Do</span>
        </h1>

        {/* Search Bar */}
        <div className="flex items-center w-2/4 relative">
          <input
            type="text"
            placeholder="Search your task here..."
            className="w-full rounded-full py-2 pl-4 pr-10 text-sm text-gray-700 placeholder-gray-100 focus:outline-none focus:ring-2 focus:ring-[#a47376] shadow-sm bg-white/20"
          />
          <Search className="absolute right-3 text-[#a47376] w-5 h-5" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 text-white">
          <p className="text-sm font-medium">{currentDate}</p>
        </div>
      </div>
    </header>
  );
}
