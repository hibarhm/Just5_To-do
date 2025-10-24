import { Edit, Trash } from "lucide-react";

export default function TaskItem() {
  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-200 px-5 py-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">
            Attend Nischal’s Birthday Party
          </h3>
          <p className="text-gray-500 text-sm">
            Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh
            Elements)...
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Created on: 20/06/2023
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <button className="p-1 text-[#a47376] hover:text-[#8b5b5e]">
            <Edit size={18} />
          </button>
          <button className="p-1 text-[#a47376] hover:text-[#8b5b5e]">
            <Trash size={18} />
          </button>
          <button className="bg-[#a47376] text-white text-sm px-3 py-1 rounded-md hover:bg-[#8b5b5e]">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
