import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { getMediator } from './mediator';

const useFetchEffect= <TRequest,TResponse> (event : string, body : TRequest, setData : Dispatch<SetStateAction<TResponse | undefined>> )=> {
    useEffect(() => {
        const fetchData = async () => {
            const response = await (getMediator().emit(event, body) as Promise<TResponse>)
            setData(response);
        }
        fetchData();
    }, [ event, body, setData ])
}

export const useMediator = <TRequest,TResponse> (event : string, body : TRequest)  => {
    const [ data, setData] = useState<undefined | TResponse>(undefined);
    useFetchEffect(event, body, setData);
    return data;
}

export const useMediatorWithState = <TRequest,TResponse> (event : string, body : TRequest) => {

    const [ data, setData] = useState<undefined | TResponse>(undefined);
    useFetchEffect(event, body, setData);
    return [ data as undefined | TResponse, setData ];
}