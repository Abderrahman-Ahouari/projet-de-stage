import { createContext, useContext, useEffect, useState } from "react";
import { getPermissions } from "../services/services";

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const pathParts = location.pathname.split("/");
  const id = pathParts[2];

  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchPermissions = async () => {
      if (id) {
        try {
          const res = await getPermissions(id);
          setPermissions(res.data);
        } catch (error) {
          console.error("Failed to fetch permissions:", error);
        } finally {
          setLoading(false); // Permissions fetched (success or fail)
        }
      }
    };

    fetchPermissions();
  }, [id]);

  return (
    <PermissionContext.Provider value={{ permissions, loading }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) throw new Error('usePermissions must be used within a PermissionProvider');
  return context;
};
