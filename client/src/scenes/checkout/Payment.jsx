// import React from 'react';
// import { PaymentForm , CreditCard } from 'react-square-web-payments-sdk';

// export default Payment;
import { Box, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { useSelector } from "react-redux";

const Payment = ({ values, touched, errors, handleBlur, handleChange }) => {
    const cart = useSelector((state) => state.cart.cart);
return (
    <Box m="30px 0">
      {/* CONTACT INFO */}
    <Box>
        <Typography sx={{ mb: "15px" }} fontSize="18px">
        Contact Info
        </Typography>
        {/* <TextField
        fullWidth
        type="text"
        label="Email"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.email}
        name="email"
        error={!!touched.email && !!errors.email}
        helperText={touched.email && errors.email}
        sx={{ gridColumn: "span 4", marginBottom: "15px" }}
        /> */}
        <TextField
        fullWidth
        type="text"
        label="userName"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.userName}
        name="userName"
        error={!!touched.userName && !!errors.userName}
        helperText={touched.userName && errors.userName}
        sx={{ gridColumn: "span 4", marginBottom: "15px" }}
        />
        <TextField
        fullWidth
        type="text"
        label="Phone Number"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.phoneNumber}
        name="phoneNumber"
        error={!!touched.phoneNumber && !!errors.phoneNumber}
        helperText={touched.phoneNumber && errors.phoneNumber}
        sx={{ gridColumn: "span 4" }}
        />
        </Box>
        <box>
        <PaymentForm
        cardTokenizeResponseReceived={async(token) => {
            // const requestBody = {
            //     sourceId: token.token,
            //     userName: `${values.firstName} ${values.lastName}`,
            //     products: cart.map(({ id, count }) => ({
            //         id,
            //         count,
            //     })),
            // };
    
                const response = await fetch("http://localhost:1337/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sourceId: token.token,
                        userName: `${values.firstName} ${values.lastName}`,
                        products: cart.map(({ id, count }) => ({
                            id,
                            count,
                        })),
                    }),
                });
                const session = await response.json();
                // Handle the session response here if needed
                console.log(session);

        }} 
        applicationId="sandbox-sq0idb-5eXPP6n6neJN94sQ_Tv-1w"
        locationId='L6ZZSAG3AYCP4'
    >
        <CreditCard />
    </PaymentForm>

        </box>
</Box>
);
};

export default Payment;
