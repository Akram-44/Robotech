import supabase from "./config";

export async function getCustomerOrders(customerID,orderId,tableName) {
    try {
        const { data, error } = await supabase
            .from('customer_purchures')
            .select(orderId)
            .eq('customer_id', customerID);
        if (error) {
            throw error;
        }

        const orderIds = data.map((item) => item[orderId]);
        const { data: ordersData, error: ordersError } = await supabase
        .from(tableName)
        .select('*')
        .in('id', orderIds);
        
        console.log('we',ordersData)
        if (ordersError) {
            throw ordersError;
        }
        return ordersData
    } catch (error) {
        console.error('Error fetching customer orders:', error);
    }
}


