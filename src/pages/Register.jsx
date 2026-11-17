
import React, { useState } from 'react';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const schema = z.object({
    nom: z.string().min(1, "nom obligatoire"),
    email: z.email("email invalide"),
    password: z.string().min(6, "6 caracteres minimum")
});

const Register = () => {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema)
    });

    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubRegsiter(data) {

        setEmailError("");
        setLoading(true);

        try {
            const response = await api.post(
                "/auth/register",
                data
            );

            console.log("Administrateur inscrit :", response.data.admin);

            navigate("/login", { replace: true });

        } catch (error) {

            if (error.response) {
                const { message, type } = error.response.data;

                if (type === "email") {
                    setEmailError(message);
                }
            } else {
                console.log(
                    "Problème de connexion au serveur :",
                    error.message
                );
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
                                Creez votre espace administrateur.
                            </p>
                        </div>
                    </div>

                    <form className='flex flex-col gap-2' onSubmit={handleSubmit(handleSubRegsiter)}>
                        <div className='border-2 rounded-md p-2 w-full'>
                            <input
                                type='text'
                                placeholder="Entrer votre nom"
                                {...register("nom")}
                                className='w-full outline-none'
                            />
                        </div>

                        {errors.nom && <p className='text-red-500'>{errors.nom.message}</p>}

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

                        <div>
                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full bg-[#46152f] text-white rounded-md p-2 hover:bg-[#6a5acd] transition-colors duration-300 disabled:opacity-50'
                            >
                                {loading ? "Inscription..." : "S'inscrire"}
                            </button>
                        </div>

                        <div>
                            <p className='text-gray-500 text-sm text-center'>
                                Vous avez déjà un compte ?{" "}
                                <Link to='/login' className='text-[#46152f] font-semibold'>
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </section>
    );
};

export default Register;
