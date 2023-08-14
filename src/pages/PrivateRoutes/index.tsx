import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const useEffectRef = useRef<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if(!useEffectRef.current) {
      if(!isAuthenticated()) {
        navigate("/auth/login", {
          replace: true,
          state: {
            from: pathname
          }
        });
        toast.info("Você precisar estar logado para acessar esse conteúdo");
      }
      else if(roles.length > 0 && !hasAnyRole(roles)) {
        navigate(redirectTo, { replace: true });
        toast.info("Você não possui permissão para acessar esse conteúdo");
      }
      setIsReady(true);
      useEffectRef.current = true;
    }
  }, [isAuthenticated, navigate, hasAnyRole, roles, redirectTo]);

  if(isReady) {
    return <Outlet />
  }
  else {
    return <></>
  }

}

export default PrivateRoutes;
