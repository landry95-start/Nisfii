
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import api from "../../services/api";

const ProductContext = createContext();

export default function ContextProduct({ children }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(
        "/product"
      );

      setProducts(response.data.produits || []);

    } catch (error) {
      console.error(
        "Erreur lors de la récupération des produits :",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Impossible de récupérer les produits."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const addProduct = async (productData) => {
    try {
      const formData = new FormData();

      formData.append("nom", productData.nom);
      formData.append("description", productData.description || "");
      formData.append("prix", productData.prix);
      formData.append("ancien_prix", productData.ancienPrix ?? "");
      formData.append("categorie_id", productData.categorie);
      formData.append("marque_id", productData.marque ?? "");
      formData.append("stock", productData.stock);
      formData.append("couleur", productData.couleur || "");
      formData.append("taille", productData.taille || "");
      formData.append("univers", productData.univers);

      if (productData.image) {
        formData.append("image", productData.image);
      }

      const response = await api.post(
        "/product",
        formData
      );

      // On recharge les produits avec leurs catégories et marques
      await getProducts();

      return response.data.produit;

    } catch (error) {
      console.error(
        "Erreur lors de l'ajout du produit :",
        error.response?.data || error.message
      );

      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await api.delete(
        `/product/${id}`
      );

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => Number(product.id) !== Number(id)
        )
      );

      return response.data;

    } catch (error) {
      console.error(
        "Erreur lors de la suppression :",
        error.response?.data || error.message
      );

      throw error;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        getProducts,
        addProduct,
        deleteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProducts doit être utilisé dans ContextProduct"
    );
  }

  return context;
};
