import React, { useEffect, useState } from "react";
import { Box, Typography, Tab, Tabs, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Item from "../../components/item";
import { setItems } from "../../state";

const ShoppingList = () => {
    const dispatch = useDispatch();
    const [value, setValue] = useState("all");
    const items = useSelector((state) => state.cart.items);
    const breakPoint = useMediaQuery("(min-width:600px)");
    console.log("item", items);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    async function getItems() {
        const items = await fetch(
            "http://localhost:1337/api/items?populate=image",
            { method: "GET" }
        );
        const itemsJson = await items.json();
        dispatch(setItems(itemsJson.data));
    }
    useEffect(() => {
        getItems();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


const  newReleasesItems = items.filter(
    (item) => item.attributes.category === "NewReleases"
);
const todaysDealItems = items.filter(
    (item) => item.attributes.category === "Today'sDeals"
);
const bestSellersItems = items.filter(
    (item) => item.attributes.category === "BestSellers"
);
    return (
        <Box width="80%" margin="80px auto">
        <Typography variant="h3" textAlign="center">
            Our Featured <b>Products</b>
        </Typography>
        <Tabs
            textColor="primary"
            indicatorColor="primary"
            value={value}
            onChange={handleChange}
            centered
            TabIndicatorProps={{ sx: { display: breakPoint ? "block" : "none" } }}
        sx={{
            m: "25px",
            "& .MuiTabs-flexContainer": {
            flexWrap: "wrap",
            },
        }}
        >
            <Tab label="ALL" value="all" />
            <Tab label="NEW RELEASES" value="NewReleases" />
            <Tab label="TODAY'S DEALS" value="Today'sDeals" />
            <Tab label="BEST SELLERS" value="BestSellers" />
        </Tabs>
        <Box
            margin="0 auto"
            display="grid"
            gridTemplateColumns="repeat(auto-fill, 300px)"
            justifyContent="space-around"
            rowGap="20px"
            columnGap="1.33%"
        >
        {value === "all" &&
            items.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
            ))}
        {value === "NewReleases" &&
            newReleasesItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
            ))}
        {value === "Today'sDeals" &&
            todaysDealItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
            ))}
        {value === "BestSellers" &&
            bestSellersItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
            ))}
        </Box>
    </Box>
    );
};


export default ShoppingList;