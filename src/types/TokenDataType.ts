import RoleType from "./RoleType";

type TokenDataType = {
  exp: number;
  email: string,
  roles: Array<RoleType>
}

export default TokenDataType;
