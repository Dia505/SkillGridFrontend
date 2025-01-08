import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const serviceDetailsSchema = yup.object().shape({
    service_name: yup.string().required("*required"),
    hourly_rate: yup.string().required("*required"),
    skill_portfolio: yup.number().required("*required"),
});

function ServiceDetails({ data, updateData }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: data || {}, 
        resolver: yupResolver(serviceDetailsSchema), 
    });

    const onSubmit = (formData) => {
        updateData({ service_details: formData }); // Pass the form data back to the parent
    };

    return (
        <>
        </>
    )
}

export default ServiceDetails