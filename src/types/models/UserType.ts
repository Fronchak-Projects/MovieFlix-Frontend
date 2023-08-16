import RoleType from "../RoleType";

type UserType = {
  id: number;
  name: string;
  email: string;
  image: string | null;
  roles: Array<RoleType>;
}

export default UserType;
