import { useEffect, useState } from "react"
import axiosInstance from "../axios/axios";
import { useFormik } from "formik";
import * as Yup from 'yup';

interface User {
    username: string,
    password: string
}

const Login = () => {

    const [user, setUser] = useState<User>({username: '', password: ''});


    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required')
        }),
        onSubmit: async (values) => {
            try {
                const response = await axiosInstance.post('/login', values);
                console.log(response.data);
            } catch (error) {
                console.error('Error logging in:', error);
            }
        }
    });

    useEffect(() => {

        const fetchLoginPage = async () => {
            try {
                const response = await axiosInstance.get('/login');
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching login page:', error);
            }
        }

        fetchLoginPage();
    
    }, []);


    return <div>
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                        />
                        {formik.touched.username && formik.errors.username ? (
                            <div>{formik.errors.username}</div>
                        ) : null}
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div>{formik.errors.password}</div>
                        ) : null}
                    </div>

                    <button type="submit">Login</button>
                </form>
        </div>

}

export default Login;