import CategoryCard from "./CategoryCard";
import { categories } from "../data/categories";

const CategorySection = ({ onCategorySelect }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-8">
        Shop by Category
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8 fade-up">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.value}
            category={cat}
            onClick={onCategorySelect}
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

// import CategoryCard from "./CategoryCard";
// import { categories } from "../data/categories";

// const CategorySection = () => {

//   return (

//     <section className="max-w-7xl mx-auto px-4 py-10">

//       <h2 className="text-2xl font-bold mb-8">
//         Shop by Category
//       </h2>

//       <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8 fade-up">

//         {categories.map((cat) => (

//           <CategoryCard
//             key={cat.name}
//             category={cat}
//           />

//         ))}

//       </div>

//     </section>

//   );

// };

// export default CategorySection;