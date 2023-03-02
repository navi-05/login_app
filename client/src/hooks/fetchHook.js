import axios from "axios";
import { useEffect, useState } from "react";
import { getUserInfoFromToken } from "../utils/utils";

axios.defaults.baseURL = `http://localhost:8080`


export const useFetch = (query) => {
    const [getData, setData] = useState({
        isLoading: false,
        apiData: undefined,
        status: null,
        serverError: null
    })

    useEffect(() => {
        
        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true }))
                const { userName } =  !query ? await getUserInfoFromToken() : '';
                const { data, status } = !query ? await axios.get(`/api/user/${userName}`) : await axios.get(`/api/${query}`)
                if(status === 201){
                    setData(prev => ({ ...prev, isLoading: false }))
                    setData(prev => ({ ...prev, apiData: data, status: status }))
                }
                setData(prev => ({ ...prev, isLoading: false }))
            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error }))
            }
        }
        fetchData();
    }, [query])
    return [ getData, setData ]
}