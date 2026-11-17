
import React, { useState } from 'react';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import api from "../services/api";

const schema = z.object({
    email: z.email("email invalide"),
    password: z.string().min(6, "6 caracteres minimum")
});

const Login = () => {

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema)
    });

    const [show, setShow] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubData(data) {
        try {
            setEmailError("");
            setPasswordError("");
            setLoading(true);

            const response = await api.post(
                "/auth/login",
                data,
                {
                    withCredentials: true
                }
            );

            const admin = response.data.admin;

            localStorage.setItem("admin", JSON.stringify(admin));

            console.log("Administrateur connecté :", admin);

            navigate("/admin", { replace: true });

        } catch (error) {

            if (error.response) {
                const { message, type } = error.response.data;

                if (type === "email") {
                    setEmailError(message);
                } else if (type === "password") {
                    setPasswordError(message);
                }
            } else {
                console.error("Erreur réseau :", error.message);
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <section className='flex justify-center items-center min-h-screen bg-[#f8f6f5] px-4 py-10'>
            <main>
                <div></div>

                <div className='bg-white rounded-2xl shadow-xl shadow-gray-200/60 p-7 sm:p-10 border border-gray-100'>
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-serif font-bold tracking-wide text-[#46152f]">
                            Nisffi
                        </h1>

                        <p className="text-xs tracking-[0.3em] text-gray-500 mt-2">
                            MODE • ACCESSOIRE • LIFESTYLE
                        </p>
                    </div>

                    <div className='border-b border-gray-400' />

                    <div className='mt-8'>
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Bienvenue !
                            </h2>

                            <p className="text-gray-500 text-sm mt-2">
                                Connectez-vous à votre espace administrateur.
                            </p>
                        </div>
                    </div>

                    <form className='flex flex-col gap-2' onSubmit={handleSubmit(handleSubData)}>
                        <div className='border-2 rounded-md p-2 w-full'>
                            <input
                                type='email'
                                placeholder="exemple@email.com"
                                {...register("email")}
                                className='w-full outline-none'
                            />
                        </div>

                        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                        {emailError && <p className='text-red-500'>{emailError}</p>}

                        <div className='relative border-2 rounded-md p-2 w-full pr-10'>
                            <input
                                type={show ? "text" : "password"}
                                placeholder="mot de passe"
                                {...register("password")}
                                className='w-full outline-none'
                            />

                            <button
                                type="button"
                                onClick={() => setShow(!show)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                {show ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                        {passwordError && <p className='text-red-500'>{passwordError}</p>}

                        <div>
                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full bg-[#46152f] text-white rounded-md p-2 hover:bg-[#6a5acd] transition-colors duration-300 disabled:opacity-50'
                            >
                                {loading ? "Connexion..." : "Se connecter"}
                            </button>
                        </div>

                        <div>
                            <p className='text-gray-500 text-sm text-center'>
                                Vous n'avez pas de compte ?{" "}
                                <Link to='/register' className='text-[#46152f] font-semibold'>
                                    S'inscrire
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </section>
    );
};

export default Login;
