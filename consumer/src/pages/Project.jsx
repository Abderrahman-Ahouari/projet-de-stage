import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { getPermissions, getProject } from "../services/services";


const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function Project() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Optional loading state

  useEffect(() => {
    const fetchProject = async () => {
      if (!id || !uuidRegex.test(id)) {
        navigate("/something-went-wrong", { replace: true });
        return;
      }

      try {
        const project = await getProject(id);

        if (!project || project.status === 404) {
          navigate("/404", { replace: true });
        } else {
          setLoading(false); 
        }
      } catch (err) {
        navigate("/404", { replace: true });
      }
    };

    fetchProject();
  }, [id, navigate]);
   const [permissions, setPermissions] = useState([]);
   const [loadingPermissions, setLoadingPermissions] = useState(true);
  
    useEffect(() => {
      if (id) {
      const fetchPermissions = async () => {
          try {
            const res = await getPermissions(id);
            setPermissions(res.data);
          } catch (error) {
            console.error("Failed to fetch permissions:", error);
          } finally {
            setLoadingPermissions(false); 
          };
        }
        fetchPermissions();
      }
    }, [id]);
    const permissionsNames = permissions.map((permission) => permission.name);



  return <Outlet  context={{ permissionsNames, loadingPermissions }} />;
}
