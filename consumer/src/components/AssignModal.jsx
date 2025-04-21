import { useIsFetching } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";


export default function AssignModal({ onClose, onSelect, assignees, contributors,isLoading }) {
  
  const [clicked, setClicked] = useState('');
  const fetching = useIsFetching();
  isLoading = isLoading || fetching > 0;

  const enrichedContributors = contributors.map((c) => ({
    ...c,
    isAssigned: !!assignees.find((a) => a.id === c.id),
  }));
  useEffect(() => {
    console.log(contributors);
  }, [contributors]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-20">
      <div className="bg-white rounded-lg w-80 max-h-96 overflow-auto p-4">
        <div className="flex justify-between">
        <h2 className="text-lg font-medium mb-4">Assign to...</h2>
        {isLoading && <ClipLoader size={20}></ClipLoader>}
        </div>
        <div className="bg-white rounded-lg max-h-40 overflow-auto p-4 gap-1 flex flex-col">
          
        {enrichedContributors.map((c) => (
          <div
            key={c.id}
            className="flex justify-between items-center px-3 py-2  rounded"
          >
            <span>{c.username}</span>
            <button
              className="w-6 h-6 rounded-full border cursor-pointer border-gray-400 flex items-center justify-center text-sm font-bold hover:bg-gray-200"
              onClick={() => {
                onSelect(c)
                setClicked(c.id)
              }
              }
            >
              {(!isLoading || (c.id !== clicked))&& (c.isAssigned ? '-' : '+')}
              {(isLoading && (c.id === clicked)) && <ClipLoader size={20}></ClipLoader>}
            </button>
          </div>
        ))}
        </div>

        <button
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 w-full cursor-pointer"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
