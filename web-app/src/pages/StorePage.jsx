import { useState } from "react";
import stores from "../data/stores";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function ChangeMap({ store }) {

    const map = useMap();

    map.setView(
        [store.lat, store.lng],
        15
    );

    return null;
}

export default function StorePage() {

    const [selected, setSelected] =
        useState(stores[0]);

    return (

        <div className="store-page">

            {/* LEFT */}

            <div className="store-sidebar">

                <h1>HỆ THỐNG CỬA HÀNG</h1>

                <p>
                    Chọn chi nhánh để xem vị trí
                </p>

                <div className="branch-list">

                    {stores.map(store => (

                        <div
                            key={store.id}
                            className={`branch-card ${
                                selected.id === store.id
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setSelected(store)
                            }
                        >

                            <h3>
                                {store.name}
                            </h3>

                            <p>
                                {store.address}
                            </p>

                        </div>

                    ))}

                </div>

            </div>

            {/* MAP */}

            <div className="store-map">

                <MapContainer
                    center={[
                        selected.lat,
                        selected.lng
                    ]}
                    zoom={15}
                    style={{
                        height:"700px",
                        width:"100%"
                    }}
                >

                    <ChangeMap
                        store={selected}
                    />

                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {stores.map(store => (

                        <Marker
                            key={store.id}
                            position={[
                                store.lat,
                                store.lng
                            ]}
                        >

                            <Popup>

                                <b>
                                    {store.name}
                                </b>

                                <br/>

                                {store.address}

                            </Popup>

                        </Marker>

                    ))}

                </MapContainer>

            </div>

        </div>

    );
}