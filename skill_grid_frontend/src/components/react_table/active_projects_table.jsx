import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import PaymentStatusForm from "./payment_status_form";

const ActiveProjectsTable = ({ activeProjects = [], paymentDetails = {} }) => {
    const [updatedPaymentDetails, setUpdatedPaymentDetails] = useState(paymentDetails);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    useEffect(() => {
        setUpdatedPaymentDetails(paymentDetails);
    }, [paymentDetails]);

    const columns = useMemo(
        () => [
            {
                header: "Client",
                accessorKey: "client_id",
                cell: ({ row }) => {
                    const { first_name, last_name, profile_picture } = row.original.client_id || {};
                    return (
                        <div className="flex items-center gap-3">
                            <img
                                src={`http://localhost:3000/client_images/${profile_picture}`}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <span>{first_name} {last_name}</span>
                        </div>
                    );
                },
            },
            {
                header: "Project",
                accessorKey: "appointment_purpose",
            },
            {
                header: "Payment",
                accessorKey: "projectId",
                cell: ({ row }) => {
                    const projectId = row.original._id;
                    const paymentData = updatedPaymentDetails[projectId];

                    return paymentData && paymentData.amount ? (
                        <span>Rs. {paymentData.amount}</span>
                    ) : (
                        <span>N/A</span>
                    );
                },
            },
            {
                header: "Deadline",
                accessorKey: "deadline",
                cell: ({ row }) => {
                    const { appointment_date, appointment_time, project_duration } = row.original;

                    let startDate = new Date(appointment_date || 0);

                    // If appointment_time exists, combine it with appointment_date
                    if (appointment_time) {
                        const [hours, minutes] = appointment_time.split(":").map(Number);
                        startDate.setHours(hours, minutes, 0, 0); // Set the time of the startDate
                    }

                    let endDate = new Date(startDate);

                    // Calculate the end date based on project_duration's value and unit
                    if (project_duration && project_duration.value && project_duration.unit) {
                        const { value, unit } = project_duration;
                        switch (unit) {
                            case "hour":
                                endDate.setHours(endDate.getHours() + value);
                                break;
                            case "day":
                                endDate.setDate(endDate.getDate() + value);
                                break;
                            case "week":
                                endDate.setDate(endDate.getDate() + value * 7);
                                break;
                            case "month":
                                endDate.setMonth(endDate.getMonth() + value);
                                break;
                            case "year":
                                endDate.setFullYear(endDate.getFullYear() + value);
                                break;
                            default:
                                break;
                        }
                    }

                    const now = new Date();
                    if (endDate < now) {
                        return <span>Completed</span>;
                    }

                    // Calculate remaining days
                    const deadlineDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

                    return <span>{`${deadlineDays} days`}</span>;
                },
            },
            {
                header: "Progress",
                accessorKey: "progress",
                cell: ({ row }) => {
                    const { appointment_date, appointment_time, project_duration } = row.original;

                    let startDate = new Date(appointment_date || 0);

                    // If appointment_time exists, combine it with appointment_date
                    if (appointment_time) {
                        const [hours, minutes] = appointment_time.split(":").map(Number);
                        startDate.setHours(hours, minutes, 0, 0); // Set the time of the startDate
                    }

                    let endDate = new Date(startDate);

                    // Calculate the end date based on project_duration's value and unit
                    if (project_duration && project_duration.value && project_duration.unit) {
                        const { value, unit } = project_duration;
                        switch (unit) {
                            case "hour":
                                endDate.setHours(endDate.getHours() + value);
                                break;
                            case "day":
                                endDate.setDate(endDate.getDate() + value);
                                break;
                            case "week":
                                endDate.setDate(endDate.getDate() + value * 7);
                                break;
                            case "month":
                                endDate.setMonth(endDate.getMonth() + value);
                                break;
                            case "year":
                                endDate.setFullYear(endDate.getFullYear() + value);
                                break;
                            default:
                                break;
                        }
                    }

                    const currentDate = new Date();

                    // Calculate progress percentage
                    let progress = ((currentDate - startDate) / (endDate - startDate)) * 100;
                    progress = Math.max(0, Math.min(progress, 100)); // Ensure between 0-100

                    return (
                        <div className="flex items-center gap-2">
                            {/* Progress Bar */}
                            <div className="w-[150px] bg-grey-100 rounded-full h-3 mt-2">
                                <div
                                    className="bg-blue-500 h-3 rounded-full"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-right mt-1">{progress.toFixed(1)}%</p>
                        </div>
                    );
                },
                className: "hidden 858:table-cell",
            },

            {
                header: "Payment status",
                accessorKey: "project_status",
                cell: ({ row }) => {
                    const projectId = row.original._id;
                    const paymentData = updatedPaymentDetails[projectId];

                    const handlePaymentStatusClick = () => {
                        setSelectedProjectId(projectId);  // Set selected project
                        setShowPaymentForm(true);  // Show the form
                    };

                    if (!paymentData) {
                        return <span className="bg-gray-100 py-1 px-3 rounded-2xl text-gray-500">N/A</span>;
                    }

                    return (
                        <span
                            className={`py-1 px-3 rounded-2xl cursor-pointer ${paymentData.payment_status
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-500"
                                }`}
                            onClick={handlePaymentStatusClick}
                        >
                            {paymentData.payment_status ? "Paid" : "Unpaid"}
                        </span>
                    );
                },
                className: "hidden 858:table-cell"
            }
        ], [updatedPaymentDetails]);

    const table = useReactTable({
        data: activeProjects || [],  // Prevents undefined errors
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (!activeProjects || !Array.isArray(activeProjects)) {
        return <p>Loading projects...</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="rounded-xl bg-white">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(column => (
                                <th key={column.id} className={`px-4 py-2 text-left text-grey-500 font-medium ${column.column.columnDef.className}`}>
                                    {flexRender(column.column.columnDef.header, column.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-grey-50">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className={`px-4 py-2 ${cell.column.columnDef.className}`}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {showPaymentForm && (
                <>
                    <div className="fixed inset-0 bg-grey-500 bg-opacity-50 z-10"></div>
                    <div className="fixed inset-0 flex justify-center items-center z-20">
                        <PaymentStatusForm projectId={selectedProjectId} onClose={() => setShowPaymentForm(false)} />
                    </div>
                </>
            )}
        </div>
    );
};

export default ActiveProjectsTable;
