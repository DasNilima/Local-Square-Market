import React, { useState } from "react";
import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import { Formik } from "formik";
import { shades } from "../../theme";
import * as yup from "yup";
import Shipping from "./Shipping";
import Payment from "./Payment";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
    "pk_test_51P5KIzFyGLQkC1b3QC7booCUSTl3dEFXOOwELcwK7WKhIaLX2YijcSQe8bXiSFyUKah06ewSCmqU6WzHOXj4s76i005SPDCtqK"
);


const Checkout = () => {
    const [activeStep, setActiveStep] = useState(0);
    const cart = useSelector((state) => state.cart.cart);
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
    // frontend logic for stripe payment
    // async function makePayment(values) {
    //     // try {
    //     //     // Make a POST request to the server-side endpoint for creating payments
    //     //     const response = await fetch("http://localhost:1337/api/orders", {
    //     //         method: "POST",
    //     //         headers: { "Content-Type": "application/json" },
    //     //         body: JSON.stringify({
    //     //             sourceId: token.token,
    //     //             userName: `${values.firstName} ${values.lastName}`,
    //     //             products: cart.map(({ id, count }) => ({
    //     //                 id,
    //     //                 count,
    //     //             })),
    //     //         }),
    //     //     });
    
    //     //     if (!response.ok) {
    //     //         throw new Error('Failed to create payment');
    //     //     }
    
    //     //     const session = await response.json();
    
    //     //     // Redirect the user to the Square checkout page
    //     //     window.location.href = session.successUrl; // Adjust this based on the response from your server
    //     // } catch (error) {
    //     //     console.error('Error initiating Square payment:', error);
    //     //     // Handle error (e.g., display error message to the user)
    //     // }
    // }
    async function makePayment(values) {
        const stripe = await stripePromise;
        const requestBody = {
            userName: [values.firstName, values.lastName].join(" "),
            email: values.email,
            products: cart.map(({ id, count }) => ({
            id,
            count,
        })),
    };
        const response = await fetch("http://localhost:1337/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });
        const session = await response.json();
        await stripe.redirectToCheckout({
            sessionId: session.id,
        });
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
                >
                    Back
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
            </Box>
        </form>
    )}
        </Formik>
    </Box>
</Box>
);
};


export default Checkout;


// this for square payment
// {(activeStep !== 1) &&
//     <Box display="flex" justifyContent="space-between" gap="50px">
//         {!isFirstStep && (
//             <Button
//                 fullWidth
//                 color="primary"
//                 variant="contained"
//                 sx={{
//                     backgroundColor: shades.primary[200],
//                     boxShadow: "none",
//                     color: "white",
//                     borderRadius: 0,
//                     padding: "15px 40px",
//                 }}
//                 onClick={() => setActiveStep(activeStep - 1)}
//             >Back
//             </Button>
//         )}
//         <Button
//             fullWidth
//             type="submit"
//             color="primary"
//             variant="contained"
//             sx={{
//                 backgroundColor: shades.primary[400],
//                 boxShadow: "none",
//                 color: "white",
//                 borderRadius: 0,
//                 padding: "15px 40px",
//             }}
//             // onClick={() => this.cardTokenizeResponseReceived(token)}
//         >
//         {!isSecondStep ? "Next" : "Place Order"}
//                 </Button>
//         {/* <PaymentForm values={this.state.values} cart={this.state.cart} /> */}
//     </Box>}
