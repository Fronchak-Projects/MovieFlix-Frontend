import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import UserType from "../../types/models/UserType";
import { BASE_API_URL } from "../../utils/Contantes";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import UserImage from '../../assets/imgs/user.png';
import useFetchFunction from '../../hooks/useFetchFunction';

type Role = {
  id: number;
  name: string;
}

const roles: Array<Role> = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'worker' },
  { id: 3, name: 'member' },
  { id: 4, name: 'user' }
];

const UsersEdit = () => {

  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { hasAnyRole, logout, token, tokenData, isAuthenticated } = useAuth();
  const [user, setUser] = useState<UserType | undefined>();
  const [userRoles, setUserRoles] = useState<Array<number>>([]);
  const useFetchFunctionUpdateRoles = useFetchFunction<UserType>();
  const useFetchUser = useFetch<UserType>(`${BASE_API_URL}/api/users/${id}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  useEffect(() => {
    const status = useFetchUser.status;
    if(status === undefined || status < 400) return;
    if(status === 404) {
      navigate('/admin/users');
      toast.error("Usuário não encontrado");
    }
    else if(status === 401) {
      logout();
      navigate('/auth/login', {
        replace: true,
        state: {
          from: pathname
        }
      });
      toast.info("Você precisa estar logado para acessar esse conteúdo");
    }
    else if(status === 403) {
      navigate("/movies");
      toast.info("Você não possui permissão para acessar esse conteúdo");
    }
    else {
      navigate("/movies");
      toast.error("Algo deu errado, favor tentar novamente mais tarde");
    }
  }, [useFetchUser.status]);

  useEffect(() => {
    const data = useFetchUser.data;
    if(data) {
      const nextUserRoles = data.roles.map((roleName) => {
        const role = roles.find((roleAux) => roleAux.name === roleName);
        return role?.id ?? 0;
      });
      setUserRoles(nextUserRoles);
      setUser(data);
    }
  }, [useFetchUser.data, setUserRoles, setUser]);

  useEffect(() => {
    const data = useFetchFunctionUpdateRoles.data;
    if(data) {
      setUser(data);
      toast.success("Permissões atualizas com sucesso");
    }
  }, [useFetchFunctionUpdateRoles.data, setUser]);

  useEffect(() => {
    const status = useFetchFunctionUpdateRoles.status;
    if(!status || status < 400) return;
    if(status === 404) {
      navigate("/admin/users");
      toast.error("Erro ao atualizar permissões, usuário não encontrado");
    }
    if(status === 401) {
      logout();
      navigate("/auth/login", {
        replace: true,
        state: {
          from: pathname
        }
      });
      toast.info("Você precisa estar logado para executar essa ação");
    }
    else if(status === 403) {
      navigate("/admin/users");
      toast.info("Você não possuir permissão para alterar as permissões desse usuário");
    }
    else {
      navigate("/admin/users");
      toast.error("Algo deu errado, favor tentar novamente mais tarde");
    }
  }, [navigate, useFetchFunctionUpdateRoles.status, pathname]);

  const handleCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>, roleId: number) => {
    const isChecked = e.target.checked;
    if(isChecked) {
      const nextUserRoles = [...userRoles, roleId];
      setUserRoles(nextUserRoles);
    }
    else {
      const nextUserRoles = userRoles.filter((id) => id !== roleId);
      setUserRoles(nextUserRoles);
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(userRoles.length === 0) return;

    if(!isAuthenticated()) {
      logout();
      navigate('/auth/login', {
        replace: true,
        state: {
          from: pathname
        }
      });
      toast.info("Você precisa estar logado para executar essa ação");
      return;
    }

    const data = {
      roles: userRoles
    };
    useFetchFunctionUpdateRoles.fetchFunction(`${BASE_API_URL}/api/users/${id}/roles`, {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
  }

  const canShowForm = (): boolean => {
    if(!user) return false;
    if(tokenData?.email === user.email) return false;
    const otherUserIsAdmin = user.roles.some((role) => role === 'admin');
    const isAdmin = hasAnyRole(['admin']);
    if(otherUserIsAdmin) {
      return isAdmin;
    }
    return true;
  }

  return (
    <div className="container mx-auto my-6 px-2 md:my-10 text-black">
      <div className='rounded-md bg-white grid grid-cols-1 md:grid-cols-2'>
      { user ? (
        <>
          <div className='px-2 py-4 border-b border-gray-500 md:border-r md:border-b-0'>
            <img
              className='rounded-full w-44 h-44 mx-auto'
              src={user.image ? `${BASE_API_URL}/storage/${user.image}` : UserImage}
            />
          </div>
          <div className='p-4'>
            <p className='mb-1'><span className='font-bold'>Email: </span>{ user.email }</p>
            <p className='mb-1'><span className='font-bold'>Usuário: </span>{ user.name }</p>
            <div className='flex flex-wrap gap-1'>
              { user.roles.map((role) => (
                <span key={role} className='inline-block px-4 bg-blue-500 text-white rounded-full text-sm font-bold'>{ role }</span>
              )) }
            </div>
          </div>
        </>
      ) : (
        <p className="mx-3 my-3">Carregando informações do usuário</p>
      ) }
      </div>
        { canShowForm() && (
          <div className='bg-white text-black mt-6 px-6 py-4 rounded-lg'>
            <h3 className='text-2xl font-bold mb-3'>Atualize as permissões do usuário</h3>
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className='mb-3'>
                <div className='flex gap-2 flex-wrap'>
                  { roles.map((role) => (
                    <div className='flex items-center gap-1' key={role.id}>
                      <input
                        type='checkbox'
                        checked={ userRoles.some((roleId) => roleId === role.id) }
                        onChange={(e) => handleCheckboxClick(e, role.id)}
                        name={`${role.name}`}
                        id={`${role.name}`}
                      />
                      <label htmlFor={`${role.name}`}>{ role.name }</label>
                    </div>
                  )) }
                </div>
                { userRoles.length === 0 && <div className='error-form-feedback'>Selecionar pelo menos uma permissão</div> }

              </div>
              <button className="btn px-2 py-1 bg-blue-500 hover:bg-blue-700"
                type='submit'
                disabled={useFetchFunctionUpdateRoles.isLoading}
              >Salvar</button>
            </form>
          </div>
        ) }
    </div>
  )
}

export default UsersEdit;
