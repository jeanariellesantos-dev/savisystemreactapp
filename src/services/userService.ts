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

