import React, {useState, useContext, createContext, useEffect} from 'react'
import api from "../../services/api"

const CategoryContext = createContext();

const ContextCategory = ({children}) => {

    const [categories, setCategories] = useState([]);


    const getCategories = async () => {
        try {
            const response = await api.get("/category");
            setCategories(response.data.categories);
        }
        catch (error) {
            console.error("Erreur lors de la récupération des catégories :", error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        getCategories();
    }, []);

    const addCategory = (newCategory) => {
        setCategories((currentCategory) => {
            return [...currentCategory, newCategory];
        });
    };

    const deleteCategory = async (id) => {
        try {
            const response = await api.delete(`/category/${id}`);
            setCategories((currentCategory) => {
                return currentCategory.filter((category) => category.id !== id);
            })

            console.log("Categorie supprime avec succes :", response.data.message);
        }
        catch (error) {
            console.error("Erreur lors de la suppression de la catégorie :", error.response?.data?.message || error.message);
        }
    }

    const updateCategory = (updatedCategory) => {

    setCategories((currentCategories) =>
        currentCategories.map((categorie) =>
            categorie.id === updatedCategory.id
                ? updatedCategory
                : categorie
        )
    );

};


  return (
    <CategoryContext.Provider value={{categories, addCategory, deleteCategory, updateCategory}}>
        {children}
    </CategoryContext.Provider>
  )
}

export default ContextCategory

export const useCategories = () => {
    const context = useContext(CategoryContext);    
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}