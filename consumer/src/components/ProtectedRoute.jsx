import { useEffect, useState } from "react";
import { Navigate, useOutletContext, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { getPermissions } from "../services/services";

const ProtectedRoute = ({ permission, children }) => {
    const {permissionsNames, loadingPermissions} = useOutletContext();

  if (loadingPermissions) {
    return <div className="flex justify-center items-center py-10"><ClipLoader></ClipLoader></div>; // Or a spinner if you have one
  }

  if (!permissionsNames.includes(permission)) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default ProtectedRoute;
