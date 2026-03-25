// TODO: Implement Login Page
// - Dana Group branded login form
// - Email + password fields
// - JWT token stored in httpOnly cookie via API
// - Redirect to /mail/inbox on success
// - Show error message on failed login

// export default function LoginPage() {
//   return null;
// }
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      {/* Image */}
      <div className="h-screen w-full"></div>

      

      <div className="shadow-xl h-screen w-full flex justify-center items-center relative">
        
        {/* form */}
        <div className="shadow-md h-[70%] w-[60%] z-20 bg-white">
          <div>
            <h3 className="font-medium tracking-wide">Welcome Back to Dana DIMS</h3>
            <p>Sign in your account</p>
          </div>

          <div></div>
          
          <div>
            <div>
              <label>
                <input type="checkbox" name="grocery-item" />
                Remember Me
              </label>
            </div>
            <div>Forgot Password</div>
          </div>

          <div></div>
        </div>


        {/* boxes */}

        <div className="absolute top-[8vh] left-[6vw] h-24 w-24 rounded-lg bg-gradient-to-br from-red-600 via-blue-800 to-blue-400 p-[4px]">
          <div className="h-full w-full rounded-sm bg-white"></div>
        </div>


        <div className="absolute top-[20vw] right-[2vw] ">

          <div className="">
            <div className="absolute z-10 right-[5vw] -bottom-[5vh] h-16 w-16 rounded-lg bg-gradient-to-br from-red-600 via-blue-800 to-blue-400 p-[4px]">
              <div className="h-full w-full rounded-sm bg-white"></div>
            </div>

            <div className="absolute top-0 right-0 h-24 w-24 rounded-lg bg-gradient-to-br from-red-600 via-blue-800 to-blue-400 p-[4px]">
              <div className="h-full w-full rounded-sm"></div>
            </div>
          </div>

        </div>


        <div className="absolute bottom-[4vh] left-[4vw] h-24 w-24 rounded-lg bg-gradient-to-br from-red-600 via-blue-800 to-blue-400 p-[4px]">
          <div className="h-full w-full rounded-sm bg-white"></div>
        </div>


      </div>
    </div>
  );
}