
import React, { useState } from 'react';
import { LayoutGrid, Plus, Pencil, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import api, { API_ORIGIN } from "../../services/api";
import { useCategories } from './ContextCategory';

const Categories = () => {

    const { categories, addCategory, deleteCategory, updateCategory } = useCategories();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const MAX_SIZE = 2 * 1024 * 1024;

    const schema = z.object({

        nom: z.string().min(1, "Nom obligatoire"),
        slug: z.string(),
        description: z.string(),
        image: z.any()
            .optional()
            .refine(
                (files) => !files?.length || files[0].size <= MAX_SIZE,
                "L'image ne doit pas dépasser 2 Mo"
            )
            .refine(
                (files) => !files?.length || files[0].type.startsWith("image/"),
                "Le fichier doit être une image"
            ),

        ordre: z.coerce.number().min(1, "Ordre invalide")
    });

    const {
        register,
        handleSubmit,
        reset
    } = useForm({
        resolver: zodResolver(schema)
    });

    
async function handleSave(data) {
    if (!isEditing && (!data.image || data.image.length === 0)) {
        alert("L'image est obligatoire");
        return;
    }

    try {
        const formData = new FormData();

        formData.append("nom", data.nom);
        formData.append("slug", data.slug);
        formData.append("description", data.description);
        formData.append("ordre", data.ordre);

        if (data.image?.length > 0) {
            formData.append("image", data.image[0]);
        }

        let response;

        if (isEditing) {
            response = await api.put(
                `/category/${selectedCategory.id}`,
                formData
            );

            updateCategory(response.data.categorie);
        } else {
            response = await api.post(
                "/category",
                formData
            );

            addCategory(response.data.categorie);
        }

        setIsEditing(false);
        setSelectedCategory(null);

        reset({
            nom: "",
            slug: "",
            description: "",
            ordre: "",
            image: undefined
        });

    } catch (error) {
        console.error(
            "Erreur :",
            error.response?.data?.message || error.message
        );
    }
}


    function handleEdit(categorie) {

        setIsEditing(true);

        setSelectedCategory(categorie);

        reset({
            nom: categorie.nom,
            slug: categorie.slug,
            description: categorie.description || "",
            ordre: categorie.ordre_affichage,
            image: undefined
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    return (
        <>
            <section>

                <div>
                    <div className="flex items-center gap-2">
                        <LayoutGrid className="text-[#46152F]" size={32} />

                        <h1 className="text-2xl sm:text-3xl font-bold text-[#46152F] font-['Playfair_Display']">
                            Categories
                        </h1>
                    </div>

                    <p className="text-sm text-[#6B6267]">
                        Gerez les categories de votre boutique
                    </p>
                </div>

                {/* FORMULAIRE */}
                <div className="mt-6 sm:mt-10 bg-white p-3 sm:p-5 rounded-xl">

                    <div className="flex gap-2 items-center">
                        <div className="bg-[#46152F] w-5 h-5 flex items-center justify-center rounded-full shrink-0">
                            <Plus size={18} color="white" />
                        </div>

                        <p className="font-bold text-lg sm:text-xl text-[#46152F]">
                            Ajoutez une categorie
                        </p>
                    </div>

                    <form className="mt-6 sm:mt-8" onSubmit={handleSubmit(handleSave)}>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10">

                            {/* PREMIÈRE PARTIE */}
                            <div className="flex flex-col gap-4">

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#29211D]">
                                        Nom de la categories
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Ex: Sacs"
                                        {...register("nom")}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-[#29211D] outline-none transition placeholder:text-gray-400 focus:border-[#A77C5C] focus:ring-2 focus:ring-[#A77C5C]/10"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#29211D]">
                                        Description (optionnelle)
                                    </label>

                                    <textarea
                                        placeholder="Une courte description de cette catégorie..."
                                        rows={4}
                                        {...register("description")}
                                        className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-[#29211D] outline-none transition placeholder:text-gray-400 focus:border-[#A77C5C] focus:ring-2 focus:ring-[#A77C5C]/10"
                                    />
                                </div>

                            </div>

                            {/* DEUXIÈME PARTIE */}
                            <div className="flex flex-col gap-4">

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#29211D]">
                                        Slug
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="ex : sacs"
                                        {...register("slug")}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-[#29211D] outline-none transition placeholder:text-gray-400 focus:border-[#A77C5C] focus:ring-2 focus:ring-[#A77C5C]/10"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">

                                    <div className="min-w-0">
                                        <label className="mb-2 block text-sm font-semibold text-[#29211D]">
                                            Image de la categorie
                                        </label>

                                        <input
                                            type="file"
                                            accept="image/jpg, image/jpeg, image/webp"
                                            {...register("image")}
                                            className="w-full min-w-0 cursor-pointer rounded-lg border border-dashed border-[#A77C5C] bg-[#FDF9F7] p-3 sm:p-6 text-xs sm:text-sm text-gray-600 file:mr-2 sm:file:mr-3 file:rounded-md file:border-0 file:bg-[#46152F] file:px-3 sm:file:px-4 file:py-2 file:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-[#29211D]">
                                            Ordre d'affichage
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            {...register("ordre")}
                                            placeholder="1"
                                            className="w-full sm:w-28 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-[#29211D] outline-none transition placeholder:text-gray-400 focus:border-[#A77C5C] focus:ring-2 focus:ring-[#A77C5C]/10"
                                        />
                                    </div>

                                </div>

                            </div>

                        </div>

                        
                        <div className="mt-5 flex flex-col sm:flex-row gap-3">

                            <button
                                type="submit"
                                disabled={isEditing}
                                className="flex items-center justify-center gap-2 bg-[#46152F] px-4 py-3 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Plus size={18} />
                                Ajouter la catégorie
                            </button>

                            <button
                                type="submit"
                                disabled={!isEditing}
                                className="flex items-center justify-center gap-2 bg-[#A77C5C] px-4 py-3 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Pencil size={18} />
                                Enregistrer les modifications
                            </button>

                        </div>

                    </form>

                </div>

            </section>

            <section className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">

                <div className="flex items-center justify-between mb-5">

                    <div className="flex items-center gap-2 min-w-0">
                        <LayoutGrid size={22} className="text-[#46152F] shrink-0" />

                        <h2 className="text-base sm:text-xl font-semibold text-[#46152F]">
                            Toutes les catégories ({categories.length})
                        </h2>
                    </div>

                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 lg:gap-6">

                    {categories.length > 0 ? (

                        categories.map((categorie) => (

                            <div
                                key={categorie.id}
                                className="border border-gray-200 rounded-xl p-2 sm:p-3 w-full min-w-0 flex flex-col items-center text-center hover:shadow-md transition"
                            >

                                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-[#F8F1EF] overflow-hidden flex items-center justify-center mb-3">

                                    {categorie.image_url ? (
                                        <img
                                            src={`${API_ORIGIN}${categorie.image_url}`}
                                            alt={categorie.nom}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <LayoutGrid size={35} className="text-[#A77C5C]" />
                                    )}

                                </div>

                                <h3 className="font-semibold text-[#46152F] text-xs sm:text-sm mb-2 break-words">
                                    {categorie.nom}
                                </h3>

                                <p className="text-xs text-gray-500 line-clamp-2 min-h-9">
                                    {categorie.description || "Aucune description"}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => handleEdit(categorie)}
                                    className="w-full mt-4 flex items-center justify-center gap-1 sm:gap-2 border border-[#E5B77F] text-[#46152F] rounded-lg py-2 text-[10px] sm:text-xs hover:bg-[#F5EADF] transition"
                                >
                                    <Pencil size={14} />
                                    Modifier
                                </button>

                                <button
                                    type="button"
                                    className="w-full mt-2 flex items-center justify-center gap-1 sm:gap-2 border border-red-300 text-red-500 rounded-lg py-2 text-[10px] sm:text-xs hover:bg-red-50 transition"
                                    onClick={() => deleteCategory(categorie.id)}
                                >
                                    <Trash2 size={14} />
                                    Supprimer
                                </button>

                            </div>

                        ))

                    ) : (

                        <p className="col-span-full text-center text-gray-500 py-8">
                            Aucune catégorie disponible pour le moment.
                        </p>

                    )}

                </div>

            </section>
        </>
    )
}

export default Categories;
