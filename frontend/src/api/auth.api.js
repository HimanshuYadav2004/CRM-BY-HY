import api from "./axios";

export const loginRequest = (payload) => {

    return api.post("auth/login" , payload)
    
};

    