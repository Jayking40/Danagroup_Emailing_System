// TODO: Implement Login Page
// - Dana Group branded login form
// - Email + password fields
// - JWT token stored in httpOnly cookie via API
// - Redirect to /mail/inbox on success
// - Show error message on failed login
"use client"

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import Link from "next/link";
import * as z from "zod";
import Logo from "../login/logo.png"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/Toast";


// export default function LoginPage() {
//   return null;
// }



const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string()
  .min(8, "Password must be at least 8 characters")
  .max(100)
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
})

type LoginSchema = z.infer<typeof loginSchema>;


export default function LoginPage() {

  const {login} = useAuthStore();;

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema), // 3. Connect Zod to Hook Form
  });

  const onSubmit = async (data: LoginSchema) => {
    console.log("Form Data:", data);
    // Here you would call your Zustand 'login' or 'register' function
    try {
      await login(data);
      
      router.push("/mail/inbox")
    } catch (error) {
      
    }
    
  };



  return (
    <section className="min-h-screen flex w-full">
      <Toast />
      {/* Image */}
      <div className="h-screen w-full relative">
        {/* Logo */}
        <Image src={Logo} alt="Logo" className="mt-4 ml-4 object-contain absolute w-32"/>
      </div>

      

      <div className="shadow-xl h-screen w-full flex justify-center items-center relative ">
        
        {/* form */}
        <div className="shadow-md h-[80%] w-[70%] z-20 bg-white flex flex-col px-16 py-20 rounded">
          <form 
          onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <h3 className="font-medium tracking-wider">Welcome Back to Dana DIMS</h3>
                <p className="text-xs text-gray-600">Sign in your account</p>
              </div>

              <div className=" flex flex-col gap-4 ">
                <Input register={register("email")}  title="Your Email" placeholder="Enter your email"/>
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                <Input register={register("password")} title="Password" placeholder="Enter your password"/>
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

              </div>
              
              <div className="flex justify-between text-xs">

                <div>
                  <label className="flex items-center gap-[3px] text-gray-600 cursor-pointer">
                    <input className="border-gray-300 accent-dana-blue-600 w-[10px] h-[10px] cursor-pointer" type="checkbox" name="grocery-item" />
                    Remember Me
                  </label>
                </div>

                <Link className="hover:text-dana-blue-700 text-dana-blue-500" href="/forgotpassword">Forgot Password?</Link>
              </div>

              <div>
                <Button type="submit" label="Login"  disabled={isSubmitting} btnStyle="py-2 bg-black/95 w-full text-white rounded" />
              </div>
            </div>
          </form>
        </div>

        {/* boxes */}

        <div className="absolute top-[4vh] left-[2vw] h-24 w-24 rounded-lg bg-gradient-to-br from-red-600 via-blue-800 to-blue-400 p-[7px]">
          <div className="h-full w-full rounded-sm bg-white"></div>
        </div>


        <div className="absolute top-[20vw] right-[0vw] ">

          <div className="">
            <div className="absolute z-10 right-[5vw] -bottom-[5vh] h-16 w-16 rounded-lg bg-gradient-to-br from-red-600 via-blue-800 to-blue-400 p-[4px]">
              <div className="h-full w-full rounded-sm bg-white"></div>
            </div>

            <div className="absolute top-0 right-0 h-24 w-24 rounded-lg bg-gradient-to-br from-red-600 via-blue-800 to-blue-400 p-[4px]">
              <div className="h-full w-full rounded-sm"></div>
            </div>
          </div>

        </div>


        <div className="absolute bottom-[4vh] left-[4vw] h-24 w-24 rounded-lg bg-gradient-to-br from-red-600 via-blue-800 to-blue-400 p-[10px]">
          <div className="h-full w-full rounded-sm bg-white"></div>
        </div>


      </div>
    </section>
  );
}