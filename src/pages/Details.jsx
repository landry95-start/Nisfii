
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import {
    Heart,
    Truck,
    ShieldCheck,
    RotateCcw,
    Headset,
    ShoppingBag,
    Minus,
    Plus
} from "lucide-react";

import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "../component/CartProvider";
import { API_ORIGIN } from "../services/api";

const Details = () => {

    const { addCart } = useCart();

    const location = useLocation();
    const navigate = useNavigate();

    const produit = location.state?.article;

    // États
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const [productSize, setProductSize] = useState(
        produit?.taille || ""
    );

    // Réinitialiser la galerie si le produit change
    useEffect(() => {
        setActiveImageIndex(0);
        setQuantity(1);
        setProductSize(produit?.taille || "");
    }, [produit?.id]);

    // Vérifier que le produit existe
    if (!produit) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-red-500 text-xl sm:text-2xl mb-4">
                        Produit introuvable
                    </p>

                    <button
                        onClick={() => navigate("/boutique")}
                        className="rounded-lg bg-[#46152F] px-5 py-3 text-white"
                    >
                        Retour à la boutique
                    </button>
                </div>
            </div>
        );
    }

    const {
        id,
        nom,
        prix,
        ancien_prix,
        image,
        images = [],
        description,
        categorie_nom,
        taille,
        stock
    } = produit;

    // Construire l'URL d'une image
    const getImageUrl = (imagePath) => {

        if (!imagePath) return "";

        if (imagePath.startsWith("http")) {
            return imagePath;
        }

        return `${API_ORIGIN}${imagePath}`;
    };

    // Construire la galerie
    const galerieImages = [
        image,
        ...images.map((item) =>
            typeof item === "string" ? item : item.url
        )
    ].filter(Boolean);

    // Image actuellement affichée
    const activeImage = getImageUrl(
        galerieImages[activeImageIndex] || image
    );

    // Ajouter au panier
    const handleAddCart = () => {

        addCart({
            ...produit,
            quantity,
            taille: productSize
        });

    };

    // Augmenter la quantité
    const incrementQuantity = () => {

        setQuantity((current) =>
            Math.min(Number(stock), current + 1)
        );

    };

    // Commander sur WhatsApp
    const handleWhatsApp = () => {

        const numeroAdmin = "237689090581";

        const message = `
Bonjour Landry ! Je souhaite commander ce produit.

Produit : ${nom}
Quantité : ${quantity}
Prix unitaire : ${prix} FCFA
Taille : ${productSize || "Non renseignée"}
Référence : ${id}
Total : ${Number(prix) * quantity} FCFA
        `;

        const url = `https://wa.me/${numeroAdmin}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank");

    };

    return (
        <>

            {/* DÉTAILS DU PRODUIT */}

            <section className="px-4 sm:px-6 lg:px-10 py-8 sm:py-10">

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

                    {/* GALERIE DU PRODUIT */}

                    <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start gap-4 lg:gap-6">

                        {/* MINIATURES */}

                        {galerieImages.length > 1 && (

                            <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">

                                {galerieImages.map((item, index) => (

                                    <button
                                        type="button"
                                        key={`${item}-${index}`}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                                            activeImageIndex === index
                                                ? "border-[#46152F]"
                                                : "border-gray-200 hover:border-[#A77C5C]"
                                        }`}
                                    >

                                        <img
                                            src={getImageUrl(item)}
                                            alt={`${nom} - image ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />

                                    </button>

                                ))}

                            </div>

                        )}

                        {/* IMAGE PRINCIPALE */}

                        <div className="relative aspect-square w-full max-w-[440px] overflow-hidden rounded-2xl bg-gray-100">

                            {activeImage ? (

                                <img
                                    src={activeImage}
                                    alt={nom}
                                    className="h-full w-full object-cover"
                                />

                            ) : (

                                <div className="flex h-full items-center justify-center text-gray-400">
                                    Image indisponible
                                </div>

                            )}

                            <button
                                type="button"
                                aria-label="Ajouter aux favoris"
                                className="absolute right-3 top-3 rounded-full bg-white p-2 text-gray-700 shadow-sm hover:text-red-500"
                            >
                                <Heart size={19} />
                            </button>

                            {/* Indicateur d'image */}

                            {galerieImages.length > 1 && (

                                <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                                    {activeImageIndex + 1}/{galerieImages.length}
                                </span>

                            )}

                        </div>

                    </div>


                    {/* INFORMATIONS DU PRODUIT */}

                    <div className="min-w-0 pt-2">

                        <h4 className="text-xs font-medium uppercase tracking-[3px] text-[#A77C5C]">
                            {categorie_nom}
                        </h4>

                        <h1 className="mt-4 font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-[#29211D]">
                            {nom}
                        </h1>

                        {/* PRIX */}

                        <div className="mt-3 flex flex-wrap items-center gap-3">

                            <h4 className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold text-red-500">
                                {Number(prix).toLocaleString("fr-FR")} FCFA
                            </h4>

                            {ancien_prix && Number(ancien_prix) > Number(prix) && (

                                <span className="text-sm text-gray-400 line-through">
                                    {Number(ancien_prix).toLocaleString("fr-FR")} FCFA
                                </span>

                            )}

                        </div>

                        {/* DESCRIPTION */}

                        <p className="mt-5 text-sm sm:text-base font-['Playfair_Display'] font-bold text-gray-500 leading-relaxed">
                            {description || "Un accessoire raffiné qui associe élégance et praticité."}
                        </p>


                        {/* TAILLE */}

                        <div className="mt-6">

                            <h3 className="text-sm font-semibold text-[#29211D]">
                                Taille :

                                <span className="font-normal ml-1">
                                    {productSize || "Non renseignée"}
                                </span>
                            </h3>

                            {taille && (

                                <div className="mt-3 flex gap-3">

                                    <button
                                        type="button"
                                        onClick={() => setProductSize(taille)}
                                        className={`h-10 min-w-12 rounded-lg border px-3 text-xs transition ${
                                            productSize === taille
                                                ? "border-[#29211D] bg-[#29211D] text-white"
                                                : "border-gray-300 text-[#29211D]"
                                        }`}
                                    >
                                        {taille}
                                    </button>

                                </div>

                            )}

                            {/* STOCK */}

                            <div className="mt-5 flex items-center gap-2">

                                <span className="text-xs text-gray-600">
                                    En stock :
                                </span>

                                <span className={`text-xs font-semibold ${
                                    Number(stock) > 0
                                        ? "text-green-600"
                                        : "text-red-500"
                                }`}>
                                    {Number(stock) > 0
                                        ? `${stock} disponible(s)`
                                        : "Rupture de stock"}
                                </span>

                            </div>

                        </div>


                        {/* QUANTITÉ ET PANIER */}

                        <div className="mt-7 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">

                            {/* QUANTITÉ */}

                            <div className="flex h-11 w-fit items-center gap-4 rounded-full border border-gray-300 px-4">

                                <button
                                    type="button"
                                    aria-label="Diminuer la quantité"
                                    disabled={quantity <= 1}
                                    onClick={() =>
                                        setQuantity((q) => Math.max(1, q - 1))
                                    }
                                >
                                    <Minus size={14} />
                                </button>

                                <span className="text-sm">
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    aria-label="Augmenter la quantité"
                                    disabled={quantity >= Number(stock)}
                                    onClick={incrementQuantity}
                                >
                                    <Plus size={14} />
                                </button>

                            </div>


                            {/* AJOUTER AU PANIER */}

                            <button
                                type="button"
                                disabled={Number(stock) <= 0}
                                className="flex h-11 flex-1 items-center justify-center gap-3 rounded-full bg-[#191919] px-5 text-sm font-medium text-white transition hover:bg-[#A77C5C] disabled:cursor-not-allowed disabled:opacity-40"
                                onClick={handleAddCart}
                            >
                                <ShoppingBag size={17} />
                                Ajouter au panier
                            </button>

                            {/* FAVORIS */}

                            <button
                                type="button"
                                aria-label="Ajouter aux favoris"
                                className="hidden sm:flex h-11 w-12 items-center justify-center rounded-full border border-gray-300 transition hover:border-red-400 hover:text-red-500"
                            >
                                <Heart size={19} />
                            </button>

                        </div>


                        {/* WHATSAPP */}

                        <button
                            type="button"
                            disabled={Number(stock) <= 0}
                            onClick={handleWhatsApp}
                            className="mt-5 sm:mt-7 flex h-11 w-full items-center justify-center gap-3 rounded-full bg-green-500 px-5 text-sm font-medium text-white transition hover:bg-[#A77C5C] disabled:opacity-40"
                        >
                            <FaWhatsapp className="h-5 w-5" />
                            Commander sur Whatsapp
                        </button>

                    </div>

                </section>

            </section>


            {/* SERVICES */}

            <section className="mx-4 sm:mx-6 lg:mx-10 mt-8 sm:mt-10 border-t border-gray-200 py-6">

                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">

                    <div className="flex items-center justify-center gap-3 border-gray-200 md:border-r">

                        <Truck size={24} strokeWidth={1.5} />

                        <div>
                            <h4 className="text-xs font-medium text-gray-800">
                                Livraison rapide
                            </h4>

                            <p className="mt-1 text-[11px] text-gray-500">
                                Partout à Yaoundé
                            </p>
                        </div>

                    </div>


                    <div className="flex items-center justify-center gap-3 border-gray-200 md:border-r">

                        <ShieldCheck size={24} strokeWidth={1.5} />

                        <div>
                            <h4 className="text-xs font-medium text-gray-800">
                                Paiement sécurisé
                            </h4>

                            <p className="mt-1 text-[11px] text-gray-500">
                                100% fiable
                            </p>
                        </div>

                    </div>


                    <div className="flex items-center justify-center gap-3 border-gray-200 md:border-r">

                        <RotateCcw size={24} strokeWidth={1.5} />

                        <div>
                            <h4 className="text-xs font-medium text-gray-800">
                                Retour sous 7 jours
                            </h4>

                            <p className="mt-1 text-[11px] text-gray-500">
                                Selon nos conditions
                            </p>
                        </div>

                    </div>


                    <div className="flex items-center justify-center gap-3">

                        <Headset size={24} strokeWidth={1.5} />

                        <div>
                            <h4 className="text-xs font-medium text-gray-800">
                                Service client
                            </h4>

                            <p className="mt-1 text-[11px] text-gray-500">
                                Disponible 7j/7
                            </p>
                        </div>

                    </div>

                </div>

            </section>

        </>
    );
};

export default Details;

