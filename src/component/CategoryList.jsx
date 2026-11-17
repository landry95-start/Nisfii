import React from 'react'
import { ArrowRight, LayoutGrid } from 'lucide-react'
import { useCategories } from './DashboardAdmin/ContextCategory'
import { API_ORIGIN } from "../services/api"

const CategoryList = () => {

  const { categories } = useCategories();

  return (
    <section className='px-4 sm:px-6 lg:px-8 py-8 bg-[#FFF1F2]'>

      
      <div className='flex justify-between items-center gap-3'>
        <div>
          <h3 className='font-bold text-lg sm:text-xl'>
            Nos catégories
          </h3>

          <p className='text-gray-400 text-xs sm:text-sm'>
            Trouvez facilement ce que vous cherchez
          </p>
        </div>

        <button className='shrink-0 text-xs sm:text-sm text-red-800 font-bold cursor-pointer flex items-center gap-1'>
          Voir tout
          <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5'/>
        </button>
      </div>

      
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 mt-8 sm:mt-10 gap-4 sm:gap-6 lg:gap-8'>

        {categories.map((item) => (

          <div
            key={item.id}
            className='group cursor-pointer bg-[#FAFAF8] border border-gray-200 rounded-xl p-3 flex flex-col items-center text-center transition duration-300 hover:-translate-y-1 hover:shadow-lg'
          >

            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-[#F8F1EF] overflow-hidden flex items-center justify-center mb-3">

              {item.image_url ? (
                <img
                    src={`${API_ORIGIN}${item.image_url}`}
                    alt={item.nom}
                    className="w-full h-full object-cover"
                />
              ) : (
                <LayoutGrid size={35} className="text-[#A77C5C]" />
              )}

            </div>

            <p className='mt-2 text-center font-medium text-xs sm:text-sm text-stone-900'>
              {item.nom}
            </p>

          </div>

        ))}

      </div>

    </section>
  )
}

export default CategoryList