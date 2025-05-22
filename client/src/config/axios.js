import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
});


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // אם קיבלנו שגיאת 401 ולא ניסינו כבר לרענן
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
          await axios.post(
          import.meta.env.VITE_API_URL+"/auth/refreshToken",{},{ withCredentials: true } // חשוב לשלוח עוגיות
        );

        // שליחה מחדש של הבקשה
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("רענון הטוקן נכשל:", refreshError);
        // אפשר פה לנתב לדף התחברות למשל
        return Promise.reject(refreshError);
      }
    }

    // אם זה לא 401 או שכבר ניסינו לרענן – החזר את השגיאה כרגיל
    return Promise.reject(error);
  }
);


export default axiosInstance;
