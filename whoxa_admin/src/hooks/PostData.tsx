import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const useApiPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const postData = async (url: any, bodyData: any, contentType = 'application/json') => {
    try {
      setLoading(true);
      setError(null);
      let token = Cookies.get('adminToken');
      // if (token == undefined || token == '') {
      //   token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpc19vd25lciI6MCwiY291bnRyeV9jb2RlIjoiIiwicGhvbmVfbnVtYmVyIjoiIiwiZGV2aWNlX3Rva2VuIjoiIiwiYmlvIjoiIiwiZW1haWxfaWQiOiJwYXdhbi5wcmltb2N5c0BnbWFpbC5jb20iLCJnb29nbGVfaWQiOiJsc2RrZWtka3Nsa2RsZWtkbCIsImFwcGxlX2lkIjoiIiwiZmlyc3RfbmFtZSI6IiIsImxhc3RfbmFtZSI6IiIsImRvYiI6IiIsImxvZ2luX3R5cGUiOiJnb29nbGUiLCJvdHAiOjAsImFkZHJlc3MiOiIiLCJjaXR5IjoiIiwic3RhdGUiOiIiLCJ6aXBfY29kZSI6IiIsIkNvdW50cnkiOiIiLCJnZW5kZXIiOiIiLCJwcm9maWxlX2ltYWdlIjoiIiwiY3JlYXRlZEF0IjoiMjAyNC0wMy0xMlQwNToyNjozNC4wMDBaIiwidXBkYXRlZEF0IjoiMjAyNC0wMy0xMlQwNToyNjozNC4wMDBaIiwiaWF0IjoxNzEwMjIyMTk2fQ.VFaF_NYE4qP5FLEKTtdh_M441ase89fBAMJX5-TjU3g`;
      // }

      const headers = {
        'Content-Type': contentType,
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post(
        import.meta.env.VITE_API_URL + url,

        bodyData,
        { headers },
      )
      
      setData(response.data);
      return response.data; // Return the response data
    } catch (err:any) {
      // console.log(err.response.data);
      
      setError(err);
      throw err; // Re-throw the error for the caller to handle
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, postData };
};

export default useApiPost;
