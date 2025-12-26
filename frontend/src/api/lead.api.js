import api from "./axios";

export const getLeads = async () => {
  const { data } = await api.get("/api/leads");
  return data.leads;
};

export const createLead = async (payload) => {
  const { data } = await api.post("/api/leads", payload);
  return data.lead;
};


export const getLeadById = async (id) => {
  const { data } = await api.get(`/api/leads/${id}`);
  return data.lead;
};

export const updateLead = async (id, payload) => {
  const { data } = await api.put(`/api/leads/${id}`, payload);
  return data.lead;
};

export const deleteLead = async (id) => {
  await api.delete(`/api/leads/${id}`);
};
