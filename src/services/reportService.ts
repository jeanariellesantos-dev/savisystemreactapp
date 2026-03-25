import URL_API from "../components/api/axios";

export const ReportService = {
  async getInventoryReport(params: any) {
    return URL_API.get("/reports/inventory", { params });
  },

  exportInventoryExcel(params: any) {
    return URL_API.get("/reports/inventory/excel", {
      params,
      responseType: "blob",
    });
  },

  exportInventoryPdf(params: any) {
    return URL_API.get("/reports/inventory/pdf", {
      params,
      responseType: "blob",
    });
  },
};