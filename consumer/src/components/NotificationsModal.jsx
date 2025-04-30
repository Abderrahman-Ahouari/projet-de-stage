import { useState } from "react";

export default function NotificationsModal({
  notifications,
  handleAccept,
  handleReject,
}) {
  const [disabled, setDisabled] = useState({});

  const handleClick = (id) => {
    setDisabled((disabled) => ({ ...disabled, [id]: true }));
  };

  return (
    <div className="absolute right-1/2  translate-x-1/2 top-16 mt-2 min-w-64 max-w-100  bg-white shadow-lg rounded-md p-4 z-20">
      <h3 className="font-semibold text-lg">Notifications</h3>
      <ul className="mt-2 space-y-4 h-52 overflow-auto">
        {notifications?.map((notification) => (
          <li
            key={notification.id}
            className="flex justify-between items-center text-sm text-gray-700 p-2 rounded-md shadow-sm hover:bg-gray-100 transition duration-200"
          >
            <p className="flex-1 text-gray-800">{notification.data.message}</p>
            {!notification.data.is_accepted &&
              !notification.data.is_rejected &&
              !disabled[notification.id] && (
                <div className="ml-auto flex flex-col gap-y-1">
                  <button
                    onClick={async () => {
                      handleClick(notification.id);
                      await handleAccept(notification.id);
                   
                    }} // assuming handleAccept is the function to handle the accept action
                    className=" rounded-md bg-blue-500 text-white px-2 py-1 text-xm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    onClick={async () => {
                      handleClick(notification.id);
                      await handleReject(notification.id);
                     
                    }} // assuming handleAccept is the function to handle the accept action
                    className=" rounded-md bg-red-500 text-white px-2 py-1 text-xm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              )}
            {disabled[notification.id] &&
            !notification.data.is_accepted &&
            !notification.data.is_rejected && (
              <div className="ml-auto flex flex-col gap-y-1">
                <button
                  className=" rounded-md bg-gray-500 text-white px-2 py-1 text-xm  "
                  disabled
                >
                  Pending...
                </button>
              </div>
            )}
            {notification.data.is_accepted && (
              <div className="ml-auto flex flex-col gap-y-1">
                <button
                  className=" rounded-md bg-gray-500 text-white px-2 py-1 text-xm  "
                  disabled
                >
                  Accepted
                </button>
              </div>
            )}
            {notification.data.is_rejected && (
              <div className="ml-auto flex flex-col gap-y-1">
                <button
                  className=" rounded-md bg-gray-500 text-white px-2 py-1 text-xm  "
                  disabled
                >
                  Rejected
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
