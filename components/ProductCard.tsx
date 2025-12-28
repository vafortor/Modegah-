
import React from 'react';
import { Product } from '../types';
import { Plus, Info, Star, CheckCircle, Clock, Eye, Factory } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onShowDetails: (product: Product) => void;
  formatPrice: (price: number) => string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onShowDetails, formatPrice }) => {
  const isPartner = !product.factoryName.toLowerCase().includes('modegah');

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 group transition-all hover:shadow-2xl hover:-translate-y-1.5 flex flex-col h-full relative">
      {/* Product Image Overlay */}
      <div className="relative h-56 overflow-hidden bg-slate-200">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
           <button 
            onClick={(e) => { e.stopPropagation(); onShowDetails(product); }}
            className="pointer-events-auto bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-xl"
          >
            <Eye size={16} /> Quick View
          </button>
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {product.category}
          </span>
          {isPartner && (
            <span className="bg-amber-500 text-slate-900 text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg border border-amber-600/20">
              <CheckCircle size={10} /> PARTNER UNIT
            </span>
          )}
        </div>
        
        <div className="absolute bottom-3 left-3">
           <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-[9px] font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm border border-slate-200">
            <Clock size={11} className="text-amber-600" /> 24-48H DELIVERY
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        {/* Rating Header */}
        <div className="flex items-center gap-1.5 mb-2">
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
          <span className="text-[10px] font-black text-slate-400">({product.reviewCount})</span>
        </div>

        {/* Product Title */}
        <h3 className="font-extrabold text-slate-900 text-lg leading-tight mb-2 group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>

        {/* Factory Detail Badge */}
        <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg mb-4 w-fit">
          <Factory size={12} className="text-slate-400" />
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">
            {product.factoryName}
          </span>
        </div>

        <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-50">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-0.5">Price / Unit</span>
            <div className="text-2xl font-bebas tracking-wide text-slate-900">
              {formatPrice(product.price)}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => onAddToCart(product)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 font-bold text-sm shadow-lg shadow-amber-500/10 active:scale-95"
            >
              <Plus size={18} />
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
