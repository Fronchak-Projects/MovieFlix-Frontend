import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import RoleType from "../../types/RoleType"
import useAuth from '../../hooks/useAuth';

type Props = {
  roles?: RoleType[],
  redirectTo?: string
}

const PrivateRoutes = ({ roles = [], redirectTo = "/" }: Props) => {

  const { pathname } = useLocation();
  const { isAuthenticated, hasAnyRole } = useAuth();

  if(!isAuthenticated()) {
    toast.info("Você precisar estar logado para acessar esse conteúdo");
    return <Navigate to={"/auth/login"} replace state={{
      from: pathname
    }} />
  }

  if(roles.length === 0 || hasAnyRole(roles)) {
    return <Outlet />
  }
  else {
    toast.info("Você não possui permissão para acessar esse conteúdo");
    return <Navigate to={redirectTo} replace />
  }
}

export default PrivateRoutes;
