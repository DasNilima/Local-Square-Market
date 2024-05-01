// import React from 'react';
// import { PaymentForm , CreditCard } from 'react-square-web-payments-sdk';

// export default Payment;
import { Box, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
// import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';


const Payment = ({ values, touched, errors, handleBlur, handleChange }) => {

//     // Assume this function is called after a successful order creation
// function redirectToConfirmationPage(orderId, successUrl) {
//     // Redirect the user to the confirmation page
//     window.location.href = successUrl;
// }
    
    
// // Assume this function is called to display an error message
// function displayErrorMessage(message) {
//     // Display the error message to the user (you can implement this according to your UI)
//     console.error('Error:', message);
// }


return (
    <Box m="30px 0">
      {/* CONTACT INFO */}
    <Box>
        <Typography sx={{ mb: "15px" }} fontSize="18px">
        Contact Info
        </Typography>
        <TextField
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
        />
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
        {/* <Box>
        <PaymentForm
                applicationId="sandbox-sq0idb-5eXPP6n6neJN94sQ_Tv-1w"
                locationId='L6ZZSAG3AYCP4'
                cardTokenizeResponseReceived=
                {
                async (token) => {
                const createOrderResponse = await fetch("http://localhost:1337/api/orders", {
                    method: "POST",
                    headers:
                    {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        sourceId: token.token,
                        userName: `${values.firstName} ${values.lastName}`,
                        products: cart.map(({ id, count }) => ({
                            id,
                            count,
                        })),
                    }),
                })
                const createOrderResult = await createOrderResponse.json();
                if (createOrderResult.id && createOrderResult.success_url) {
                    redirectToConfirmationPage(createOrderResult.id, createOrderResult.success_url);
                } else {
                    // Handle error case
                    displayErrorMessage(createOrderResult.error.message);
                }
                    
                    }
                } 
                
    >
        <CreditCard />
    </PaymentForm>
    </Box> */}
</Box>
);
};

export default Payment;
