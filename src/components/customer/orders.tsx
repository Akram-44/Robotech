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
                return {services,courses,products}
            } catch (error) {
                console.error('Error fetching customer courses:', error);
            }
        }
        fetchData().then(data => setOrdersList((data! as OrderType)));
    }, []);
    return <div>
        {ordersList ? (
            <div className="mt-2">
                <h2>Courses</h2>
                <ul>
                    {ordersList.courses ? ordersList.courses.map((course) => (
                        <li className="flex gap-2 bg-slate-200 rounded p-3 " key={course.id}>
                            <img className="w-14" src={course.poster} alt={course.title} />
                            <h3>{course.title}</h3>
                            <p>Price: ${course.price}</p>
                        </li>
                    )) : 'No courses available'}
                </ul>
            </div>
        ) : (
            <div className="text-center h-[200px] border rounded mt-2 flex items-center justify-center">
                <span className="flex gap-1 items-center"><Loader className="animate-spin" />  </span></div>
        )}

    </div>
}

export default Orders