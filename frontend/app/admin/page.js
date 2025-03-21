'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [serviceName, setServiceName] = useState("");
    const [serviceDetails, setServiceDetails] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("userRRTAXToken");
        if (!token) {
            router.push("/log_in/");
            return;
        }

        fetchUsers(token);
    }, [router]);

    const fetchUsers = async (token) => {
        try {
            const response = await fetch("http://localhost:3001/admin/users", {
                method: "GET",
                headers: {
                    Authorization: token,
                },
            });

            const data = await response.json();
            if (data.code === "0") {
                setUsers(data.users);
            } else {
                setError("Failed to fetch users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("An error occurred while fetching users");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateService = async (userId) => {
        const token = localStorage.getItem("userRRTAXToken");
        if (!serviceName || !serviceDetails) {
            alert("Please fill in all service details");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/admin/createService", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({
                    userId,
                    serviceName,
                    serviceDetails,
                }),
            });

            const data = await response.json();
            if (data.code === "0") {
                alert("Service created successfully");
                setServiceName("");
                setServiceDetails("");
            } else {
                alert("Failed to create service");
            }
        } catch (error) {
            console.error("Error creating service:", error);
            alert("An error occurred while creating the service");
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Admin Interface</h1>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">User ID</th>
                        <th className="border border-gray-300 px-4 py-2">Email</th>
                        <th className="border border-gray-300 px-4 py-2">Username</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.uid}>
                            <td className="border border-gray-300 px-4 py-2">{user.uid}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <input
                                    type="text"
                                    placeholder="Service Name"
                                    value={serviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                    className="border px-2 py-1 mr-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Service Details"
                                    value={serviceDetails}
                                    onChange={(e) => setServiceDetails(e.target.value)}
                                    className="border px-2 py-1 mr-2"
                                />
                                <button
                                    onClick={() => handleCreateService(user.uid)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Create Service
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}