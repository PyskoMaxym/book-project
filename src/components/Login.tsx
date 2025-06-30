import { Formik, Form, Field } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import {useNavigate, Link } from "react-router-dom";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onLogin: () => void;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Must be a valid email!").required("Required"),
  password: Yup.string().min(3, "Too short!").max(20, "Too long!").required("Required"),
});

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    
    const navigate = useNavigate();

    const handleSubmit = (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) => {
    console.log("Login:", values);
    localStorage.setItem("token", "fake-token");
    onLogin();
    actions.resetForm();
    navigate("/meeting-rooms");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-sm bg-white border-2 border-gray-300 p-10 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Login</h2>

      <Formik initialValues={initialValues} validationSchema={LoginSchema} onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <Form className="space-y-6">
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
              Login
            </button>
          </Form>
        )}
      </Formik>

      {/* Кнопка для переключення на Register */}
       <p className="mt-4 text-center">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 underline">
          Register
        </Link>
      </p>
    </div>
</div>
  );
};

export default LoginForm;
