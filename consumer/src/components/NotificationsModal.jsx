import { useEffect, useRef, useState } from "react";

export default function NotificationsModal({
  notifications,
  handleAccept,
  handleReject,
  showNotifications,
  setShowNotifications
}) {
  const [disabled, setDisabled] = useState({});
  const modalRef = useRef(null);

  const handleClick = (id) => {
    setDisabled((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    if (!showNotifications) return;

    function closeModal(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", closeModal);
    return () => {
      document.removeEventListener("mousedown", closeModal);
    };
  }, [showNotifications, setShowNotifications]);

  if (!showNotifications) return null;

  return (
    <div
      ref={modalRef}
      className="absolute right-1/2 translate-x-1/2 top-16 mt-2 min-w-64 max-w-100 bg-white shadow-lg rounded-md p-4 z-20"
    >
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
                    }}
                    className="rounded-md bg-blue-500 text-white px-2 py-1 text-xm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    onClick={async () => {
                      handleClick(notification.id);
                      await handleReject(notification.id);
                    }}
                    className="rounded-md bg-red-500 text-white px-2 py-1 text-xm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              )}

            {disabled[notification.id] &&
              !notification.data.is_accepted &&
              !notification.data.is_rejected && (
                <button
                  className="ml-auto rounded-md bg-gray-500 text-white px-2 py-1 text-xm"
                  disabled
                >
                  Pending...
                </button>
              )}

            {notification.data.is_accepted && (
              <button
                className="ml-auto rounded-md bg-gray-500 text-white px-2 py-1 text-xm"
                disabled
              >
                Accepted
              </button>
            )}

            {notification.data.is_rejected && (
              <button
                className="ml-auto rounded-md bg-gray-500 text-white px-2 py-1 text-xm"
                disabled
              >
                Rejected
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
