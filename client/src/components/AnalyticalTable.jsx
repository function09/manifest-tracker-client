import "@ui5/webcomponents-icons/dist/AllIcons.js";
import { useEffect, useState } from "react"
import {AnalyticalTable, FlexBox, Button, FileUploader} from "@ui5/webcomponents-react"
import fetchManifests from "../networkRequests/fetchRequests"

export default function DocumentTable() {
    const [data, setData] = useState([])

    useEffect(()=>{
        // Handle when the array returned is empty, an error occurs as a result
        const fetchData = async ()=> {
            try{
                const manifestData =  await fetchManifests()
                setData(manifestData)
            }catch(error){
                console.log(error)
            }
        }
        fetchData()
    }, [])

    const tableColumns = [
            {
                Header: 'Document Number',
                accessor: 'documentNumber',
                headerTooltip: 'Document Number'
            },
            {
                Header: 'Material Document',
                accessor: 'materialDocument',
                headerTooltip: 'Material Document'
            },
            {
                Header: 'Sending Warehouse',
                accessor: 'sendingWarehouse',
                headerTooltip: 'Sending Warehouse'
            },
            {
                Header: 'Departure Date',
                accessor: 'departureDate',
                headerTooltip: 'Departure Date'
            },
            {
                Header: 'Arrival Date',
                accessor: 'arrivalDate',
                headerTooltip: 'Arrival Date'
            },
            {
                Header: 'Actions',
                accessor: '.',
                headerTooltip: 'actions',
                Cell: () => {
                    return(
                        <FlexBox>
                            <Button icon="edit"/>
                            <Button icon="delete"/>
                            <Button icon= "activity-items"/>
                        </FlexBox>
                    )
                }
            }
    ]

    return (
        <div>
        <AnalyticalTable columns={tableColumns} data={data}/>
        <FileUploader hideInput>
            <Button>
                Upload single file
            </Button>
        </FileUploader>
        </div>
    )
}