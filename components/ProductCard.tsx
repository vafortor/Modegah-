
import React from 'react';
import { Product } from '../types';
import { Plus, Info, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onShowDetails: (product: Product) => void;
  formatPrice: (price: number) => string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onShowDetails, formatPrice }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 group transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-slate-200">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-1">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                fill={i < Math.floor(product.averageRating) ? "currentColor" : "none"} 
                className={i < Math.floor(product.averageRating) ? "" : "text-slate-300"}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400">({product.reviewCount})</span>
        </div>

        <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div>
            <span className="text-xs text-slate-400 font-medium">Price per unit</span>
            <div className="text-xl font-extrabold text-slate-900">
              {formatPrice(product.price)}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => onShowDetails(product)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Details"
            >
              <Info size={20} />
            </button>
            <button 
              onClick={() => onAddToCart(product)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 p-2 rounded-lg transition-colors flex items-center gap-1 font-bold text-sm"
            >
              <Plus size={20} />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
