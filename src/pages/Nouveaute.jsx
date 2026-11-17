
import React, { useMemo, useState } from "react";

import {
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Heart,
  Star,
  ShoppingCart
} from "lucide-react";

import { useProducts } from "../component/DashboardAdmin/ContextProduct";
import { useCart } from "../component/CartProvider";
import { useNavigate } from "react-router-dom";
import { API_ORIGIN } from "../services/api";

const Nouveaute = () => {

  const { products } = useProducts();

  const { addCart } = useCart();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Toutes");
  const [brandFilter, setBrandFilter] = useState("Toutes");

  const produitsElectronique = products.filter(
    (produit) => produit.univers === "Homme"
  );

  // Récupérer les catégories présentes dans les produits
  const categories = [
    "Toutes",
    ...new Set(produitsElectronique.map((p) => p.categorie_nom).filter(Boolean)),
  ];

  // Récupérer les marques présentes dans les produits
  const brands = [
    "Toutes",
    ...new Set(produitsElectronique.map((p) => p.marque_nom).filter(Boolean)),
  ];

  // Filtrer les produits
  const filteredProducts = useMemo(() => {
    return produitsElectronique.filter((product) => {
      const matchSearch =
        product.nom.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        categoryFilter === "Toutes" ||
        product.categorie_nom === categoryFilter;

      const matchBrand =
        brandFilter === "Toutes" ||
        product.marque_nom === brandFilter;

      return matchSearch && matchCategory && matchBrand;
    });
  }, [produitsElectronique, search, categoryFilter, brandFilter]);

  return (
    <main className="min-h-screen bg-[#FCFAFB]">

      {/* En-tête */}
      <section className="bg-[#46152F] text-white px-6 py-16 text-center">
        <p className="text-sm tracking-[4px] uppercase mb-3 text-[#E8B8CC]">
          Découvrez notre univers
        </p>

        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Produits et accessoires pour homme
        </h1>

        <p className="text-white/70 max-w-xl mx-auto">
          Découvrez notre sélection de produits pour tous les styles
          et toutes les envies.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-12">

        {/* Recherche et filtres */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between mb-8">

          <div className="relative w-full lg:max-w-md">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#46152F]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#46152F]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "Toutes" ? "Toutes les catégories" : category}
                </option>
              ))}
            </select>

            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#46152F]"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand === "Toutes" ? "Toutes les marques" : brand}
                </option>
              ))}
            </select>

          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#46152F]">
              Nos produits
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {filteredProducts.length} produit(s) trouvé(s)
            </p>
          </div>

          <SlidersHorizontal className="text-[#46152F]" size={22} />
        </div>

        {filteredProducts.length === 0 ? (

          <div className="bg-white border border-gray-100 rounded-2xl py-20 text-center">
            <ShoppingBag
              size={45}
              className="mx-auto text-gray-300 mb-4"
            />

            <h3 className="text-lg font-semibold text-gray-700">
              Aucun produit trouvé
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              Essayez de modifier votre recherche ou vos filtres.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategoryFilter("Toutes");
                setBrandFilter("Toutes");
              }}
              className="mt-5 text-[#46152F] font-semibold underline"
            >
              Réinitialiser les filtres
            </button>
          </div>

        ) : (

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">

            {filteredProducts.map((product) => (

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
                    onClick={(e) => e.stopPropagation()}
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

                    {/* Bouton panier */}
                    <button
                      type="button"
                      title="Ajouter au panier"
                      className="w-7 h-7 rounded-full bg-[#171717] text-white flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        addCart({ ...product, quantity: 1 });
                      }}
                    >
                      <ShoppingCart size={17} />
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>
    </main>
  );
};

export default Nouveaute;
