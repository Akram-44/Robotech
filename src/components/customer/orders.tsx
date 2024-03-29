import { getCustomerOrders } from "@/supabase/getCustomerOrders";
import { CourseType, OrderType } from '../../../type'
import { useEffect, useState } from "react";
import { ChevronRight, Loader, Plus } from "lucide-react";

const Orders = ({ customerId }) => {
    const [ordersList, setOrdersList] = useState<OrderType | null>(null);
    const [collapse, setCollapse] = useState({
        products: false,
        courses: false,
        services: false
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const services = await getCustomerOrders(customerId, 'service_id', 'services_duplicate');
                const courses = await getCustomerOrders(customerId, 'course_id', 'courses_duplicate');
                const products = await getCustomerOrders(customerId, 'product_id', 'products_duplicate');
                return { services, courses, products };
            } catch (error) {
                console.error('Error fetching customer orders:', error);
            }
        }
    
        fetchData().then(data => {
            console.log('UI',data)
            setOrdersList(data as OrderType);
        });
    }, []);

    const toggleCollapse = (category) => {
        setCollapse(prevState => ({
            ...prevState,
            [category]: !prevState[category]
        }));
    };

    const renderItems = (items, title, imageField, noItemsMessage, category) => (
        <div>
            <h2 onClick={() => toggleCollapse(category)} className='flex items-center mt-2 font-bold mb-1 text-blue-600 text-base cursor-pointer'><span>{title.toUpperCase()}</span> <ChevronRight className="ml-2" size={16} /></h2>
            {collapse[category] && (
                <ul>
                    {items && items.length > 0 ? (
                        items.map(item => (
                            <li className="flex items-center justify-between gap-2 bg-slate-200 rounded p-3" key={item.data.id}>
                                <div className="flex items-center gap-1">
                                    <img className="w-10 h-10 rounded-full" src={item.data[imageField]} alt={item.data.title} />
                                    <h3>{item.data.title}</h3>
                                </div>
                                <div>Quantity: {item.quantity}</div> {/* Updated to display quantity */}
                                <div>Price: ${item.data.price}</div>
                            </li>
                        ))
                    ) : (
                        <li>{noItemsMessage}</li>
                    )}
                </ul>
            )}
        </div>
    );

    return (
        <div className="h-[95%]">
            {ordersList ? (
                <div className="mt-2">
                    {renderItems(ordersList.products, "Products", "image1", "No products available", "products")}
                    {renderItems(ordersList.courses, "Courses", "poster", "No courses available", "courses")}
                    {renderItems(ordersList.services, "Services", "image1", "No services available", "services")}
                </div>
            ) : (
                <div className="text-center h-full flex items-center justify-center">
                    <span className="flex gap-1 items-center"><Loader className="animate-spin" />  </span>
                </div>
            )}
        </div>
    );
};

export default Orders;