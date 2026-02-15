// services/userService.ts
import URL_API from "../components/api/axios";

export type UpdateProfilePayload = {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
};

export const UserService = {
  updateProfile(payload: UpdateProfilePayload) {
    return URL_API.put("/user/profile", payload);
  },

    changePassword(payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) {
    return URL_API.put("/change_password", payload);
  },

  updateEmail(payload: { email: string }) {
    return URL_API.put("/user/update_email", payload);
  }
  
};
//ADMIN
export const getUsers = () => {
  return URL_API.get("/user");
};

export const toggleUserStatus = (id: number) => {
  return URL_API.patch(`/user/${id}/toggle-status`);
};

export const updateUser = (id: number, data: any) => {
  return URL_API.put("/user/${id}", data);
};
