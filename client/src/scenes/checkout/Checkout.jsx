import React, { useState } from "react";
import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import { Formik } from "formik";
import { shades } from "../../theme";
import * as yup from "yup";
import Shipping from "./Shipping";
import Payment from "./Payment";


const Checkout = () => {
    const [activeStep, setActiveStep] = useState(0);
    const isFirstStep = activeStep === 0;
    const isSecondStep = activeStep === 1;

    const handleFormSubmit = async (values, actions) => {
        setActiveStep(activeStep + 1);
        // this copies the billing address onto shipping address
        if (isFirstStep && values.shippingAddress.isSameAddress) {
            actions.setFieldValue("shippingAddress", {
                ...values.billingAddress,
                isSameAddress: true,
            });
        }

        if (isSecondStep) {
            makePayment(values); // Wait for payment completion before proceeding
        }
        actions.setTouched({});
        };
    // frontend logic for square payment
    async function makePayment(values) {
    }
        // Initial form values
        const initialValues = {
            billingAddress: {
                // Define billing address fields here
                firstName: "",
                lastName: "",
                country: "",
                street1: "",
                street2: "",
                city: "",
                state: "",
                zipCode: "",
            },
            shippingAddress: {
                // Define shipping address fields here
                isSameAddress: true,
                firstName: "",
                lastName: "",
                country: "",
                street1: "",
                street2: "",
                city: "",
                state: "",
                zipCode: "",
            },
            // Add other form fields if needed
            email: "",
            phoneNumber: "",
        };
    
        // Define validation schema for each step
        const checkoutSchema = [
            yup.object().shape({
                billingAddress: yup.object().shape({
                    firstName: yup.string().required("required"),
                    lastName: yup.string().required("required"),
                    country: yup.string().required("required"),
                    street1: yup.string().required("required"),
                    street2: yup.string(),
                    city: yup.string().required("required"),
                    state: yup.string().required("required"),
                    zipCode: yup.string().required("required"),
                }),
                shippingAddress: yup.object().shape({
                    isSameAddress: yup.boolean(),
                    firstName: yup.string().when("isSameAddress", {
                        is: false,
                        then: yup.string().required("required"),
                    }),
                    lastName: yup.string().when("isSameAddress", {
                        is: false,
                        then: yup.string().required("required"),
                    }),
                    country: yup.string().when("isSameAddress", {
                        is: false,
                        then: yup.string().required("required"),
                    }),
                    street1: yup.string().when("isSameAddress", {
                        is: false,
                        then: yup.string().required("required"),
                    }),
                    street2: yup.string(),
                    city: yup.string().when("isSameAddress", {
                        is: false,
                        then: yup.string().required("required"),
                    }),
                    state: yup.string().when("isSameAddress", {
                        is: false,
                        then: yup.string().required("required"),
                    }),
                    zipCode: yup.string().when("isSameAddress", {
                        is: false,
                        then: yup.string().required("required"),
                    }),
                }),
            }),
            yup.object().shape({
                email: yup.string().required("required"),
                phoneNumber: yup.string().required("required"),
            }),
        ];
    
    return (
    <Box width="80%" m="100px auto">
    <Stepper activeStep={activeStep} sx={{ m: "20px 0" }}>
        <Step>
            <StepLabel>Billing</StepLabel>
        </Step>
        <Step>
            <StepLabel>Payment</StepLabel>
        </Step>
    </Stepper>
    <Box>
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema[activeStep]}
        >
        {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
        }) => (
        <form onSubmit={handleSubmit}>
            {isFirstStep && (
                <Shipping
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                />
            )}
            {isSecondStep && (
                <Payment
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                />
                            )}
            {(activeStep !== 1) &&
                        <Box display="flex" justifyContent="space-between" gap="50px">
                            {!isFirstStep && (
                                <Button
                                    fullWidth
                                    color="primary"
                                    variant="contained"
                                    sx={{
                                        backgroundColor: shades.primary[200],
                                        boxShadow: "none",
                                        color: "white",
                                        borderRadius: 0,
                                        padding: "15px 40px",
                                    }}
                                    onClick={() => setActiveStep(activeStep - 1)}
                                >Back
                                </Button>
                            )}
                            <Button
                                fullWidth
                                type="submit"
                                color="primary"
                                variant="contained"
                                sx={{
                                    backgroundColor: shades.primary[400],
                                    boxShadow: "none",
                                    color: "white",
                                    borderRadius: 0,
                                    padding: "15px 40px",
                                }}
                            >
                                {!isSecondStep ? "Next" : "Place Order"}
                            </Button>
                        </Box>}
            </form>
                    )}
                    
        </Formik>
            </Box>
    </Box>
    );
    };






export default Checkout;



