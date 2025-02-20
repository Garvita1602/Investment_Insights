import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import './MyStocks.css'; // Ensure you have this CSS file imported

// Register ChartJS components
ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    Filler
);

function MyStocks() {
    const [company, setCompany] = useState(""); // State for storing the company name input
    const [stocks, setStocks] = useState([]); // Array to hold the stocks and their data
    const [stockData, setStockData] = useState({}); // Object to store stock data for each company

    const handleCompanyChange = (event) => {
        setCompany(event.target.value); // Update company state with input value
    };

    const handleAddStock = () => {
        if (company) {
            const newStock = { name: company, isGraphVisible: false }; // Create new stock entry
            setStocks((prevStocks) => [...prevStocks, newStock]); // Add the new stock to the list
            setCompany(""); // Clear the input field
            fetchStockData(company); // Fetch stock data for the new company
        } else {
            alert("Please enter a company name.");
        }
    };

    // Simulate fetching live stock data (replace with an actual API for live data)
    const fetchStockData = (company) => {
        const intervalId = setInterval(() => {
            const newPrice = Math.floor(Math.random() * (1200 - 1000 + 1)) + 1000; // Random stock price between 1000 and 1200

            setStockData((prevData) => {
                const updatedLabels = [
                    ...(prevData[company]?.labels || []),
                    new Date().toLocaleTimeString(),
                ];
                const updatedPrices = [
                    ...(prevData[company]?.datasets[0]?.data || []),
                    newPrice,
                ];

                return {
                    ...prevData,
                    [company]: {
                        labels: updatedLabels,
                        datasets: [
                            {
                                label: `${company} Stock Price`,
                                data: updatedPrices,
                                fill: false,
                                borderColor: "rgba(75,192,192,1)",
                                tension: 0.1,
                                pointBackgroundColor: updatedPrices.map((price, index) => {
                                    if (index > 0 && price !== updatedPrices[index - 1]) {
                                        return "red"; // Red color for points where the graph changes
                                    }
                                    return "rgba(75,192,192,1)"; // Default color
                                }),
                                pointBorderColor: "white", // Points border color
                            },
                        ],
                    },
                };
            });
        }, 5000); // Fetch new data every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on component unmount
    };

    const toggleGraphVisibility = (company) => {
        setStocks((prevStocks) =>
            prevStocks.map((stock) =>
                stock.name === company
                    ? { ...stock, isGraphVisible: !stock.isGraphVisible }
                    : stock
            )
        );
    };

    // If no stock data for a company, show loading
    const renderGraph = (company) => {
        const data = stockData[company];
        if (!data) return <div>Loading...</div>;

        return (
            <Line
                data={data}
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `Real-Time Data for ${company}`,
                            font: {
                                size: 16,
                                color: "white",
                            },
                        },
                        tooltip: {
                            callbacks: {
                                label: (tooltipItem) => {
                                    return `Price: $${tooltipItem.raw.toFixed(2)}`;
                                },
                            },
                            backgroundColor: "rgba(0,0,0,0.7)",
                            titleColor: "white",
                            bodyColor: "white",
                        },
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: "black", // Set x-axis numbers to black
                            },
                            grid: {
                                color: "rgba(255,255,255,0.3)", // Light grid lines
                            },
                        },
                        y: {
                            ticks: {
                                color: "black", // Set y-axis numbers to black
                            },
                            grid: {
                                color: "rgba(255,255,255,0.3)", // Light grid lines
                            },
                        },
                    },
                }}
                height={40} // Increased graph height
                width={100} // Increased graph width
            />
        );
    };

    return (
        <div className="my-stocks">
            <h2 className="header">My Stocks</h2>
            <div className="input-section">
                <input
                    type="text"
                    value={company}
                    onChange={handleCompanyChange}
                    placeholder="Enter stock symbol (e.g., AAPL)"
                    className="stock-input"
                />
                <button onClick={handleAddStock} className="add-stock-btn">
                    Add Stock
                </button>
            </div>

            <div className="stocks-list" style={{ marginTop: '20px', padding: '0', maxWidth: '80%', margin: 'auto' }}>
                <ul style={{ listStyle: 'none', padding: '0', margin: '20px auto' }}>
                    {stocks.map((stock, index) => (
                        <li key={index} style={{
                            margin: '20px 0',
                            padding: '20px',
                            borderRadius: '12px',
                            backgroundColor: '#f9f9f9',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer', // Add cursor pointer
                        }}
                            // Hover effect for the li element
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            <div className="stock-item" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <button
                                    onClick={() => toggleGraphVisibility(stock.name)}
                                    className="view-btn"
                                    style={{
                                        padding: '10px 15px',
                                        backgroundColor: '#4CAF50',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {stock.isGraphVisible ? "Hide" : "View"}
                                </button>
                                {/* Stock name with increased size and bold style */}
                                <span className="stock-name" style={{
                                    fontSize: '2rem',  // Increased font size
                                    fontWeight: 'bold', // Bold font
                                    margin: '15px 0',
                                    textTransform: 'uppercase',
                                    color: '#333'
                                }}>
                                    {stock.name}
                                </span>
                                <button
                                    onClick={() => setStocks(stocks.filter((_, i) => i !== index))}
                                    className="remove-btn"
                                    style={{
                                        backgroundColor: 'red',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        padding: '5px 10px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                            {stock.isGraphVisible && renderGraph(stock.name)}
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}

export default MyStocks;
