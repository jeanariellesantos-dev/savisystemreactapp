import React, { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import Alert from "../ui/alert/Alert";
import URL_API from "../api/axios";
import LoadingOverlay from "../common/LoadingOverlay";


export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    show: false,
    variant: "success" as "success" | "error",
    title: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      email,
      password
      
    };

    try {
        const res = await URL_API.post('/user/login', payload);

        console.log(res.data);

        const { token, user } = res.data;
        
        // store auth data
        localStorage.setItem("role", user.role);
        localStorage.setItem("email", user.email);
        localStorage.setItem("firstname", user.firstname);
        localStorage.setItem("lastname", user.lastname);
        localStorage.setItem("mobile", user.mobile);
        localStorage.setItem("role_description", user.role_description);
        localStorage.setItem("token", token);

        // redirect by role
        if (user.role === "ADMINISTRATOR") {
          navigate("/admin");
        } else {
          navigate("/home");
        }

    } catch (err:unknown) {
        console.error(err);

        const message =
        err instanceof Error ? err.message : "Please check your username and password.";

        setAlert({
          show: true,
          variant: "error",
          title: "Login Failed!",
          message: message || "Please check your username and password.",
        });

        setTimeout(() => setAlert({ ...alert, show: false }), 5000);

    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
        <LoadingOverlay isLoading={isLoading} />

      {/* <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div> */}
<div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto ">
  {/* Box Container */}
  <div className="border rounded-2xl shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-6">
    <div>
      <div className="mb-2 sm:mb-4">
        <h1 className="mb-5 font-semibold text-gray-800 text-center text-title-sm dark:text-white/90 sm:text-title-md">
          SAVI
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your email and password to sign in!
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6 mb-5">
          <div>
            <Label>
              Email <span className="text-error-500">*</span>
            </Label>
            <Input
              placeholder="info@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>
              Password <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                Keep me logged in
              </span>
            </div>
            <Link
              to="/reset-password"
              className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Forgot password?
            </Link>
          </div>

          <div>
            <Button className="w-full" size="sm">
              Sign in
            </Button>
          </div>
        </div>

        {/* Alert */}
        {alert.show && (
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
          />
        )}
      </form>
    </div>
  </div>
</div>

    </div>
  );
}
