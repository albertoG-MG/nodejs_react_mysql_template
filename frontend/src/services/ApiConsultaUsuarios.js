import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useAPI(token, {
  query = "",
  pagination: { limit = 10, skip = 0 } = {},
  sort: { field = "id", order = "ASC" } = {},
} = {}) {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('http://localhost:8080/api/users/getusers', {
		  headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            query,
            limit,
            skip,
            sortField: field,
            sortOrder: order,
          },
        });

        setData(response.data.items);
        setCount(response.data.total);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
   }, [token, query, limit, skip, field, order]);

  return { data, count, loading, error };
}