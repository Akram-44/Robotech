import { getCustomerOrders } from "@/supabase/getCustomerOrders";
import { CourseType, OrderType } from '../../../type'
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

const Orders = ({ customerId }) => {
    const [ordersList, setOrdersList] = useState<OrderType | null>(null)
    useEffect(() => {
        async function fetchData() {
            try {
                const services = await getCustomerOrders(customerId, 'service_id', 'services_duplicate');
                const courses = await getCustomerOrders(customerId, 'course_id', 'courses_duplicate');
                const products = await getCustomerOrders(customerId, 'product_id', 'products_duplicate');
                return { services, courses, products }
            } catch (error) {
                console.error('Error fetching customer courses:', error);
            }
        }
        fetchData().then(data => setOrdersList((data! as OrderType)));
    }, []);
    return <div className="h-[300px] border overflow-auto rounded mt-3 p-3">
        {ordersList ? (
            <div className="mt-2">
                <h2>Products</h2>
                <ul>
                    {ordersList.products ? ordersList.products.map((product) => (
                        <li className="flex items-center justify-between gap-2 bg-slate-200 rounded p-3 " key={product.id}>
                            <div className="flex items-center gap-1">
                                <img className="w-10 h-10 rounded-full" src={product.image1} alt={product.title} />
                                <h3>{product.title}</h3>
                            </div>
                            <div>Price: ${product.price}</div>
                        </li>
                    )) : 'No products available'}
                </ul>
                <h2>Courses</h2>
                <ul>
                    {ordersList.courses ? ordersList.courses.map((course) => (
                        <li className="flex items-center justify-between gap-2 bg-slate-200 rounded p-3 " key={course.id}>
                            <div className="flex items-center gap-1">
                                <img className="w-10 h-10 rounded-full" src={course.poster} alt={course.title} />
                                <h3>{course.title}</h3>
                            </div>
                            <div>Price: ${course.price}</div>
                        </li>
                    )) : 'No courses available'}
                </ul>
                <h2>Services</h2>
                <ul>
                    {ordersList.services ? ordersList.services.map((service) => (
                        <li className="flex items-center justify-between gap-2 bg-slate-200 rounded p-3 " key={service.id}>
                            <div className="flex items-center gap-1">
                                <img className="w-10 h-10 rounded-full" src={service.image1} alt={service.title} />
                                <h3>{service.title}</h3>
                            </div>
                            <div>Price: ${service.price}</div>
                        </li>
                    )) : 'No services available'}
                </ul>
            </div>
        ) : (
            <div className="text-center h-full flex items-center justify-center">
                <span className="flex gap-1 items-center"><Loader className="animate-spin" />  </span></div>
        )}

    </div>
}

export default Orders