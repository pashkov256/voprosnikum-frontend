import {ReactNode} from 'react'
import {useParams} from "react-router-dom";
import {useSuxResultsQuery} from "entities/Test/model/slice/testSlice";
import Loader from "shared/ui/Loader/Loader";



export const Sux = () => {
    const {id} = useParams()
    const {data,isLoading,isError} = useSuxResultsQuery(id || "")
    console.log(data)
    if (isLoading || !data){
        return <Loader />
    }
    if (isError) {
        return <div>{isError}</div>
    }
    return <div style={{display: "flex", justifyContent: "center"}}>
        <p style={{ whiteSpace: 'pre-wrap',paddingTop:70 }}>{JSON.stringify(data, null, 2)}</p>
    </div>
};
