import { memo } from "react";

const CategoryCard = memo(({ category, onClick }) => {
  return (
    <div
      onClick={() => onClick(category)}
      className="flex flex-col items-center cursor-pointer group"
    >
      <div className="relative w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center shadow-sm transition-all duration-300 group-hover:shadow-lg">
        <img
          src={category.image}
          alt={category.name}
          className="absolute w-24 h-24 object-contain -top-2 transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      <p className="text-sm mt-3 font-medium text-gray-700 group-hover:text-black text-center">
        {category.name}
      </p>
    </div>
  );
});

export default CategoryCard;

// import { memo } from "react";

// const CategoryCard = memo(({ category }) => {

//   return (

//     <div className="flex flex-col items-center cursor-pointer group">

//       {/* circle background */}
//       <div className="relative w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center shadow-sm transition-all duration-300 group-hover:shadow-lg">

//         {/* image */}
//         <img
//           src={category.image}
//           alt={category.name}
//           className="absolute w-24 h-24 object-contain -top-2 transition-transform duration-300 group-hover:scale-110"
//           loading="lazy"
//         />

//       </div>

//       {/* text */}
//       <p className="text-sm mt-3 font-medium text-gray-700 group-hover:text-black text-center">
//         {category.name}
//       </p>

//     </div>

//   );

// });

// export default CategoryCard;