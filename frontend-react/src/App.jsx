import { useEffect, useState } from "react";
import "./App.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const API = "https://powerwatch-u47p.onrender.com/api/equipment";


function getStatus(temperature) {

    if (temperature > 85) {
        return "Critical";
    }

    if (temperature >= 75) {
        return "Warning";
    }

    return "Normal";
}


function App() {

    const [equipment, setEquipment] = useState([]);

    const [search, setSearch] = useState("");

    const [error, setError] = useState("");

    const [newEquipment, setNewEquipment] = useState({
        id: "",
        type: "Transformer",
        temperature: "",
        load: ""
    });


    // =========================
    // LOAD EQUIPMENT
    // =========================

    const loadEquipment = async () => {

        try {

            const response = await fetch(API);

            if (!response.ok) {
                throw new Error("Failed to fetch equipment");
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Invalid equipment data");
            }

            setEquipment(data);

            setError("");

        } catch (error) {

            console.error(error);

            setError(
                "Unable to connect to PowerWatch backend."
            );

        }

    };


    useEffect(() => {

        loadEquipment();

    }, []);


    // =========================
    // ADD EQUIPMENT
    // =========================

    const addEquipment = async (event) => {

        event.preventDefault();

        if (
            !newEquipment.id ||
            !newEquipment.temperature ||
            !newEquipment.load
        ) {

            alert("Please fill all fields.");

            return;

        }


        const temperature =
            Number(newEquipment.temperature);

        const load =
            Number(newEquipment.load);


        const equipmentData = {

            id: newEquipment.id,

            type: newEquipment.type,

            temperature: temperature,

            load: load,

            status: getStatus(temperature),

            maintenanceDue: false,

            lastMaintenance: "Not recorded"

        };


        try {

            const response = await fetch(API, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(equipmentData)

            });


            if (!response.ok) {

                const result =
                    await response.json();

                throw new Error(
                    result.message || "Failed to add equipment"
                );

            }


            setNewEquipment({

                id: "",

                type: "Transformer",

                temperature: "",

                load: ""

            });


            await loadEquipment();


        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Failed to add equipment."
            );

        }

    };


    // =========================
    // INCREASE TEMPERATURE
    // =========================

    const increaseTemperature = async (item) => {

        const newTemperature =
            Number(item.temperature) + 5;


        const newStatus =
            getStatus(newTemperature);


        try {

            const response = await fetch(
                `${API}/${item.id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        temperature:
                            newTemperature,

                        status:
                            newStatus

                    })

                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to update temperature"
                );

            }


            await loadEquipment();


        } catch (error) {

            console.error(error);

            alert(
                "Failed to update temperature."
            );

        }

    };


    // =========================
    // MAINTENANCE
    // =========================

    const toggleMaintenance = async (item) => {

        try {

            const response = await fetch(
                `${API}/${item.id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        maintenanceDue:
                            !item.maintenanceDue,

                        lastMaintenance:
                            !item.maintenanceDue
                                ? new Date()
                                    .toISOString()
                                    .split("T")[0]
                                : item.lastMaintenance

                    })

                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to update maintenance"
                );

            }


            await loadEquipment();


        } catch (error) {

            console.error(error);

            alert(
                "Failed to update maintenance."
            );

        }

    };


    // =========================
    // DELETE EQUIPMENT
    // =========================

    const deleteEquipment = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this equipment?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(
                `${API}/${id}`,
                {
                    method: "DELETE"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete equipment"
                );

            }


            await loadEquipment();


        } catch (error) {

            console.error(error);

            alert(
                "Failed to delete equipment."
            );

        }

    };


    // =========================
    // SEARCH
    // =========================

    const filteredEquipment =
        equipment.filter((item) => {

            const searchText =
                search.toLowerCase();

            return (

                item.id
                    .toLowerCase()
                    .includes(searchText)

                ||

                item.type
                    .toLowerCase()
                    .includes(searchText)

                ||

                item.status
                    .toLowerCase()
                    .includes(searchText)

            );

        }).sort((a, b) => {
    const order = {
        Transformer: 1,
        Motor: 2,
        Generator: 3
    };

    return order[a.type] - order[b.type];
});


    // =========================
    // SUMMARY
    // =========================

    const totalEquipment =
        equipment.length;


    const normalCount =
        equipment.filter(
            item => item.status === "Normal"
        ).length;


    const warningCount =
        equipment.filter(
            item => item.status === "Warning"
        ).length;


    const criticalCount =
        equipment.filter(
            item => item.status === "Critical"
        ).length;


    const maintenanceCount =
        equipment.filter(
            item => item.maintenanceDue
        ).length;


    // =========================
    // CHART DATA
    // =========================

    const chartData = {

        labels:
            equipment.map(
                item => item.id
            ),

        datasets: [

            {

               label: "Temperature (°C)",
    data: equipment.map(
        item => item.temperature
    ),
    backgroundColor: "#2563eb",
    borderColor: "#1d4ed8",
    borderWidth: 1

            },

            {
    label: "Load (%)",
    data: equipment.map(
        item => item.load
    ),
    backgroundColor: "#60a5fa",
    borderColor: "#2563eb",
    borderWidth: 1
}

        ]

    };


    const chartOptions = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                position: "top"
            },

            title: {

                display: true,

                text:
                    "Equipment Temperature & Load Analysis"

            }

        }

    };


    return (

        <div className="app">

            {/* =========================
                SIDEBAR
            ========================= */}

            <aside className="sidebar">

                <div className="logo">

                    ⚡ PowerWatch

                </div>


                <nav>

                    <a
                        href="#dashboard"
                        className="active"
                    >
                        Dashboard
                    </a>


                    <a href="#equipment">
                        Equipment
                    </a>


                    <a href="#alerts">
                        Alerts
                    </a>


                    <a href="#maintenance">
                        Maintenance
                    </a>


                    <a href="#analytics">
                        Analytics
                    </a>

                </nav>

            </aside>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="main-content">


                {/* =========================
                    HEADER
                ========================= */}

                <header className="topbar">

                    <div>

                        <h1>
                            PowerWatch
                        </h1>

                        <p>
                            Monitor electrical equipment and maintenance status
                        </p>

                    </div>


                    <div className="system-status">

                        <span className="status-dot"></span>

                        System Online

                    </div>

                </header>


                {/* =========================
                    ERROR
                ========================= */}

                {error && (

                    <div className="error-message">

                        {error}

                    </div>

                )}


                {/* =========================
                    SUMMARY
                ========================= */}

                <section
                    id="dashboard"
                    className="stats"
                >

                    <div className="stat-card">

                        <span>
                            Total Equipment
                        </span>

                        <strong>
                            {totalEquipment}
                        </strong>

                    </div>


                    <div className="stat-card">

                        <span>
                            Normal
                        </span>

                        <strong>
                            {normalCount}
                        </strong>

                    </div>


                    <div className="stat-card">

                        <span>
                            Warning
                        </span>

                        <strong>
                            {warningCount}
                        </strong>

                    </div>


                    <div className="stat-card">

                        <span>
                            Critical
                        </span>

                        <strong>
                            {criticalCount}
                        </strong>

                    </div>


                    <div className="stat-card">

                        <span>
                            Maintenance Due
                        </span>

                        <strong>
                            {maintenanceCount}
                        </strong>

                    </div>

                </section>


                {/* =========================
                    ADD EQUIPMENT
                ========================= */}

                <section className="panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                Add Equipment
                            </h2>

                            <p>
                                Register a new electrical equipment unit
                            </p>

                        </div>

                    </div>


                    <form
                        className="add-form"
                        onSubmit={addEquipment}
                    >

                        <input

                            type="text"

                            placeholder="Equipment ID"

                            value={
                                newEquipment.id
                            }

                            onChange={(event) =>

                                setNewEquipment({

                                    ...newEquipment,

                                    id:
                                        event.target.value

                                })

                            }

                        />


                        <select

                            value={
                                newEquipment.type
                            }

                            onChange={(event) =>

                                setNewEquipment({

                                    ...newEquipment,

                                    type:
                                        event.target.value

                                })

                            }

                        >

                            <option>
                                Transformer
                            </option>

                            <option>
                                Motor
                            </option>

                            <option>
                                Generator
                            </option>

                        </select>


                        <input

                            type="number"

                            placeholder="Temperature °C"

                            value={
                                newEquipment.temperature
                            }

                            onChange={(event) =>

                                setNewEquipment({

                                    ...newEquipment,

                                    temperature:
                                        event.target.value

                                })

                            }

                        />


                        <input

                            type="number"

                            placeholder="Load %"

                            value={
                                newEquipment.load
                            }

                            onChange={(event) =>

                                setNewEquipment({

                                    ...newEquipment,

                                    load:
                                        event.target.value

                                })

                            }

                        />


                        <button
                            type="submit"
                            className="primary-button"
                        >

                            + Add Equipment

                        </button>

                    </form>

                </section>


                {/* =========================
                    EQUIPMENT
                ========================= */}

                <section
                    id="equipment"
                    className="panel"
                >

                    <div className="panel-header">

                        <div>

                            <h2>
                                Equipment
                            </h2>

                            <p>
                                Live equipment data from MongoDB
                            </p>

                        </div>


                        <input

                            className="search-input"

                            type="text"

                            placeholder="Search equipment..."

                            value={search}

                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }

                        />

                    </div>


                    <div className="equipment-grid">

                        {filteredEquipment.map(
                            (item) => (

                                <div

                                    className={`equipment-card ${item.status.toLowerCase()}`}

                                    key={item._id || item.id}

                                >

                                    <div className="equipment-header">

                                        <div>

                                            <h3>
                                                {item.id}
                                            </h3>

                                            <p>
                                                {item.type}
                                            </p>

                                        </div>


                                        <span
                                            className={`status-badge ${item.status.toLowerCase()}`}
                                        >

                                            {item.status}

                                        </span>

                                    </div>


                                    <div className="equipment-values">

                                        <div>

                                            <span>
                                                Temperature
                                            </span>

                                            <strong>
                                                {item.temperature}°C
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Load
                                            </span>

                                            <strong>
                                                {item.load}%
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="maintenance-info">

                                        Maintenance:

                                        <strong>

                                            {item.maintenanceDue
                                                ? " Due"
                                                : " OK"}

                                        </strong>

                                    </div>


                                    <div className="equipment-actions">

                                        <button
                                            onClick={() =>
                                                increaseTemperature(
                                                    item
                                                )
                                            }
                                        >

                                            +5°C

                                        </button>


                                        <button
                                            onClick={() =>
                                                toggleMaintenance(
                                                    item
                                                )
                                            }
                                        >

                                            {item.maintenanceDue
                                                ? "Mark Done"
                                                : "Maintenance"}

                                        </button>


                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                deleteEquipment(
                                                    item.id
                                                )
                                            }
                                        >

                                            Delete

                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </section>


                {/* =========================
                    ALERTS
                ========================= */}

                <section
                    id="alerts"
                    className="panel"
                >

                    <div className="panel-header">

                        <div>

                            <h2>
                                Alerts
                            </h2>

                            <p>
                                Current equipment conditions
                            </p>

                        </div>

                    </div>


                    <div className="alerts-list">

                        {equipment.filter(
                            item =>
                                item.status === "Warning" ||
                                item.status === "Critical"
                        ).length === 0 ? (

                            <div className="no-alert">

                                ✓ No active alerts

                            </div>

                        ) : (

                            equipment

                                .filter(
                                    item =>
                                        item.status === "Warning" ||
                                        item.status === "Critical"
                                )

                                .map(item => (

                                    <div
                                        className="alert-item"
                                        key={item._id || item.id}
                                    >

                                        <strong>
                                            {item.id}
                                        </strong>


                                        <span>

                                            {item.status}
                                            {" — "}
                                            Temperature:
                                            {" "}
                                            {item.temperature}°C

                                        </span>

                                    </div>

                                ))

                        )}

                    </div>

                </section>


                {/* =========================
                    MAINTENANCE
                ========================= */}

                <section
                    id="maintenance"
                    className="panel"
                >

                    <div className="panel-header">

                        <div>

                            <h2>
                                Maintenance
                            </h2>

                            <p>
                                Equipment maintenance status
                            </p>

                        </div>

                    </div>


                    <div className="maintenance-list">

                        {equipment.map(item => (

                            <div
                                className="maintenance-row"
                                key={item._id || item.id}
                            >

                                <div>

                                    <strong>
                                        {item.id}
                                    </strong>

                                    <span>
                                        {item.type}
                                    </span>

                                </div>


                                <div>

                                    {item.maintenanceDue ? (

                                        <span className="maintenance-due">

                                            Maintenance Due

                                        </span>

                                    ) : (

                                        <span className="maintenance-ok">

                                            Maintenance OK

                                        </span>

                                    )}

                                </div>


                                <button
                                    onClick={() =>
                                        toggleMaintenance(
                                            item
                                        )
                                    }
                                >

                                    {item.maintenanceDue
                                        ? "Mark Done"
                                        : "Mark Due"}

                                </button>

                            </div>

                        ))}

                    </div>

                </section>


                {/* =========================
                    ANALYTICS
                ========================= */}

                <section
                    id="analytics"
                    className="panel analytics-panel"
                >

                    <div className="panel-header">

                        <div>

                            <h2>
                                Analytics
                            </h2>

                            <p>
                                Equipment temperature and load analysis
                            </p>

                        </div>

                    </div>


                    <div
                        className="chart-container"
                        style={{
                            height: "400px"
                        }}
                    >

                        {equipment.length > 0 ? (

                            <Bar
                                data={chartData}
                                options={chartOptions}
                            />

                        ) : (

                            <p>
                                No equipment data available.
                            </p>

                        )}

                    </div>

                </section>


                {/* =========================
                    FOOTER
                ========================= */}

                <footer>

                    <p>
                        PowerWatch • Industrial Electrical Equipment Monitoring System
                    </p>
                    <div className="developer-credit">
    <strong>Designed & Developed by Aayush Kumar</strong>
    <span>aayushkmr024@gmail.com</span>
</div>

                </footer>

            </main>

        </div>

    );

}


export default App;