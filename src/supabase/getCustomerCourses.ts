import supabase from "./config";

export async function getCustomerCourses(customerID) {
    try {
        // Retrieve the courses for the specific customer
        const { data, error } = await supabase
            .from('customer_purchures')
            .select('course_id')
            .eq('cusomter_id', customerID);
        if (error) {
            throw error;
        }

        const courseIds = data.map((item) => item.course_id);

        const { data: coursesData, error: coursesError } = await supabase
            .from('courses_duplicate')
            .select('*')
            .in('id', courseIds);

        if (coursesError) {
            throw coursesError;
        }
        return coursesData
    } catch (error) {
        console.error('Error fetching customer courses:', error);
    }
}


