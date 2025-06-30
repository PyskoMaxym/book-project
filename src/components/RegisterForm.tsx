import { Formik, Form, Field } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import {useNavigate, Link } from "react-router-dom";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

interface RegisterFormProps {
  onRegister: () => void;
} 

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too short!").max(20, "Too long!").required("Required"),
  email: Yup.string().email("Must be a valid email!").required("Required"),
  password: Yup.string().min(3, "Too short!").max(20, "Too long!").required("Required"),
});

const initialValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
};

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {

  const navigate = useNavigate();

  const handleSubmit = (
    values: RegisterFormValues,
    actions: FormikHelpers<RegisterFormValues>
  ) => {
    console.log("Register:", values);
    localStorage.setItem("token", "fake-token");
    onRegister();
    actions.resetForm();
    navigate("/meet-rooms");
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-sm bg-white border-2 border-gray-300 p-10 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Register</h2>

      <Formik initialValues={initialValues} validationSchema={RegisterSchema} onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <Form className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-1">
                Name
              </label>
              <Field
                id="name"
                name="name"
                className={`w-full px-4 py-3 text-base border rounded-md ${
                  errors.name && touched.name ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                placeholder="Your name"
              />
              {errors.name && touched.name && (
                <p className="text-red-600 mt-1 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-1">
                Email
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                className={`w-full px-4 py-3 text-base border rounded-md ${
                  errors.email && touched.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                placeholder="you@example.com"
              />
              {errors.email && touched.email && (
                <p className="text-red-600 mt-1 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-1">
                Password
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                className={`w-full px-4 py-3 text-base border rounded-md ${
                  errors.password && touched.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                placeholder="••••••••"
              />
              {errors.password && touched.password && (
                <p className="text-red-600 mt-1 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-md"
            >
              Register
            </button>
          </Form>
        )}
      </Formik>

      {/* Кнопка для переключення на Login */}
       <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 underline">
          Login
        </Link>
      </p>
    </div>
  </div> 
  );
};

export default RegisterForm;
