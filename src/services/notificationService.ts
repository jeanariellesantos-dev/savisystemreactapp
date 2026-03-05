import URL_API from "../components/api/axios";

export const NotificationService = {

  async getAll() {
    const { data } = await URL_API.get("/notifications");
    return data;
  },

  async unreadCount() {
    const { data } = await URL_API.get("/notifications/unread-count");
    return data.unread;
  },

  async markAsRead(id:number) {
    await URL_API.patch(`/notifications/${id}/read`);
  },

  async markAll() {
    await URL_API.patch(`/notifications/read-all`);
  }

};