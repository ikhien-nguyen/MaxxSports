import { useState } from "react"
import stores from "../data/stores"

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet"

import "leaflet/dist/leaflet.css"

function StorePage(){

    const [selectedStore,setSelectedStore] = useState(stores[0])

    return(

        <div
            style={{
                display:"flex",
                gap:"20px",
                padding:"20px"
            }}
        >

            <div
                style={{
                    width:"35%"
                }}
            >

                <h2>Danh sách cửa hàng</h2>

                {

                    stores.map(store=>(

                        <div
                            key={store.id}

                            style={{
                                border:"1px solid gray",
                                marginBottom:"10px",
                                padding:"10px",
                                cursor:"pointer"
                            }}

                            onClick={()=>{
                                setSelectedStore(store)
                            }}

                        >

                            <h3>{store.name}</h3>

                            <p>{store.address}</p>

                            <p>{store.phone}</p>

                        </div>

                    ))
                }

            </div>


            <div style={{width:"65%"}}>

                <MapContainer

                    center={[
                        selectedStore.lat,
                        selectedStore.lng
                    ]}

                    zoom={15}

                    style={{
                        height:"600px",
                        width:"100%"
                    }}

                    key={selectedStore.id}

                >

                    <TileLayer

                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                    />

                    <Marker

                        position={[
                            selectedStore.lat,
                            selectedStore.lng
                        ]}

                    >

                        <Popup>

                            {selectedStore.name}

                        </Popup>

                    </Marker>

                </MapContainer>

            </div>

        </div>

    )

}

export default StorePage