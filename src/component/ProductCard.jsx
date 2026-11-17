
import React from 'react'
import { Star, ShoppingCart, ArrowRight, Heart } from 'lucide-react'
import { useProducts } from './DashboardAdmin/ContextProduct';
import { useCart } from './CartProvider';
import { useNavigate } from 'react-router-dom';
import { API_ORIGIN } from "../services/api";

const ProductCard = () => {

    const { products } = useProducts();
    const { addCart } = useCart();
    const navigate = useNavigate();

    return (
        <section className='px-4 sm:px-6 lg:px-8 py-8 bg-[#FFF1F2]'>

            <div className='flex justify-between items-center gap-3'>
                <div>
                    <h3 className='font-bold text-xl'>Produits populaire</h3>
                    <p className='text-gray-400 text-xs sm:text-sm'>
                        Les coups de coeurs de nos clients
                    </p>
                </div>

                <button className='shrink-0 text-xs sm:text-sm text-red-800 font-bold cursor-pointer flex items-center gap-1'>
                    voir tout
                    <ArrowRight className='w-5 h-5' />
                </button>
            </div>

            <div className='flex flex-col lg:flex-row gap-6 mt-10'>

                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-1 gap-3'>

                    {products.slice(0, 5).map((product) => (

                        <article
                            key={product.id}
                            className="bg-white border border-[#EAE3DE] overflow-hidden group max-w-[190px] mx-auto w-full"
                            onClick={() => navigate("/details", {
                                state: { article: product }
                            })}
                        >

                            <div className="relative aspect-[4/3] bg-[#F3E9DF] overflow-hidden">

                                {product.image ? (
                                    <img
                                        src={`${API_ORIGIN}${product.image}`}
                                        alt={product.nom}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Aucune image
                                    </div>
                                )}

                                {product.ancien_prix && (
                                    <span className="absolute top-3 left-3 bg-[#46152F] text-white text-[10px] px-2 py-1 uppercase">
                                        Promo
                                    </span>
                                )}

                                <button
                                    type="button"
                                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-[#46152F] hover:text-white transition"
                                >
                                    <Heart size={19} strokeWidth={1.8} />
                                </button>

                            </div>

                            <div className="p-2">

                                <p className="text-[8px] uppercase tracking-wider text-[#64748B] mb-1">
                                    {product.categorie_nom || "Sans catégorie"}
                                </p>

                                <h3 className="text-xs font-medium text-gray-900 line-clamp-1">
                                    {product.nom}
                                </h3>

                                <div className="flex items-center flex-wrap gap-2 mt-1">

                                    <span className="text-xs font-bold text-black">
                                        {Number(product.prix).toLocaleString("fr-FR")} FCFA
                                    </span>

                                    {product.ancien_prix && (
                                        <span className="text-xs text-gray-400 line-through">
                                            {Number(product.ancien_prix).toLocaleString("fr-FR")} FCFA
                                        </span>
                                    )}

                                </div>

                                <div className="flex items-center justify-between mt-3">

                                    <div className="flex items-center gap-1 text-xs text-[#64748B]">

                                        {product.note && (
                                            <>
                                                <Star
                                                    size={15}
                                                    fill="#F5A623"
                                                    stroke="#F5A623"
                                                />

                                                <span>{product.note}</span>

                                                {product.nombre_avis && (
                                                    <span>({product.nombre_avis})</span>
                                                )}
                                            </>
                                        )}

                                    </div>

                                    <button
                                        type="button"
                                        title="Ajouter au panier"
                                        className="w-7 h-7 rounded-full bg-[#171717] text-white flex items-center justify-center"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            addCart({ ...product, quantity: 1 })
                                        }}
                                    >
                                        <ShoppingCart size={17} />
                                    </button>

                                </div>

                            </div>

                        </article>
                    ))}

                </div>

                <div className='relative rounded-xl bg-red-800 w-full h-48 sm:h-56 lg:w-[20%] lg:h-auto overflow-hidden'>

                    <img
                        src="../../src/assets/backReduc.png"
                        alt='reduction'
                        className='absolute inset-0 h-full w-full object-cover object-center'
                    />

                </div>

            </div>

        </section>
    )
}

export default ProductCard;
