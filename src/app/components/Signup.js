// "use client";
// import { useState } from "react";
// import { useRouter } from "next/router";
// import { Input, Button, message } from "antd";

// export default function SignUpPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   const handleSignUp = (e) => {
//     e.preventDefault();

//     const users = JSON.parse(localStorage.getItem("users")) || [];
//     const existingUser = users.find((user) => user.email === email);

//     if (existingUser) {
//       setError("User already exists.");
//       return;
//     }

//     const newUser = { email, password };
//     users.push(newUser);
//     localStorage.setItem("users", JSON.stringify(users));

//     message.success("Sign-up successful!");
//     router.push("/login");
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
//         <h1 className="text-2xl font-semibold text-center mb-4">Sign Up</h1>
//         <form onSubmit={handleSignUp}>
//           <div className="mb-4">
//             <Input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <Input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full"
//               required
//             />
//           </div>
//           <Button
//             type="primary"
//             htmlType="submit"
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white"
//           >
//             Sign Up
//           </Button>
//         </form>
//         {error && <p className="text-red-500 text-center mt-2">{error}</p>}
//       </div>
//     </div>
//   );
// }
