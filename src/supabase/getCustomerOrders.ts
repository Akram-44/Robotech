import supabase from "./config";

export async function getCustomerOrders(customerID, orderId, tableName) {
    try {
        const { data, error } = await supabase
            .from('customer_purchures')
            .select('*')
            .eq('customer_id', customerID);

        if (error) {
            throw error;
        }

        const orderIds = data!.map((item) => item[orderId]);

        const result = [];

        const idQuantityMap = {}; // Map to track ID and its quantity

        for (const id of orderIds) {
            if (id) {
                if (idQuantityMap.hasOwnProperty(id)) {
                    idQuantityMap[id].quantity += 1; // Increment the quantity if ID already exists
                } else {
                    idQuantityMap[id] = { quantity: 1, data: null }; // Initialize with quantity 1
                }
            }
        }

        for (const id of Object.keys(idQuantityMap)) {
            const { data: orderData, error: orderError } = await supabase
                .from(tableName)
                .select('*')
                .eq('id', id);

            if (orderError) {
                throw orderError;
            }

            idQuantityMap[id].data = orderData[0]; // Store the data in the map
        }

        for (const id of Object.keys(idQuantityMap)) {
            result.push({ quantity: idQuantityMap[id].quantity, data: idQuantityMap[id].data });
        }

        console.log('wooo', result);
        return result;
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        return null; // or handle error as needed
    }
}