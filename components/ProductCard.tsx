
import React from 'react';
import { Product } from '../types';
import { Plus, Star, CheckCircle, Clock, Eye, Factory, Heart, Info, Edit3, Award } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onShowDetails: (product: Product) => void;
  formatPrice: (price: number) => string;
  isWishlisted?: boolean;
  onToggleWishlist: (product: Product) => void;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, onAddToCart, onShowDetails, formatPrice, isWishlisted, onToggleWishlist, isAdmin, onEdit
}) => {
  const isPartner = !product.factoryName.toLowerCase().includes('modegah');

  return (
    <div className={`group bg-white rounded-[2rem] border transition-all duration-500 flex flex-col h-full relative overflow-hidden ${
      product.isFeatured ? 'border-amber-500/30 shadow-xl shadow-amber-500/5' : 'border-slate-100 shadow-sm'
    } hover:shadow-2xl hover:-translate-y-2`}>
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Wishlist Button (Clients) or Edit Button (Admins) */}
        {!isAdmin ? (
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
            className={`absolute top-4 left-4 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 z-10 active:scale-75 ${
              isWishlisted 
                ? 'bg-pink-500 border-pink-400 text-white shadow-lg' 
                : 'bg-white/80 border-white/20 text-slate-400 hover:text-pink-500 hover:bg-white shadow-sm'
            }`}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        ) : (
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit?.(product); }}
            className="absolute top-4 left-4 p-2.5 rounded-full bg-blue-600 border border-blue-500 text-white shadow-xl z-10 hover:bg-blue-700 transition-all active:scale-75"
            title="Edit SKU"
          >
            <Edit3 size={18} />
          </button>
        )}

        {/* Action Overlays */}
        <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-3">
           <button 
            onClick={() => onShowDetails(product)}
            className="bg-white text-slate-900 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-2xl hover:bg-amber-500 hover:text-slate-900"
          >
            <Eye size={18} /> Quick View
          </button>
        </div>

        {/* Category & Status Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {product.isFeatured && (
            <span className="bg-amber-500 text-slate-900 text-[8px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest flex items-center gap-1 shadow-lg border border-amber-400">
              <Award size={10} fill="currentColor" /> RECOMMENDED
            </span>
          )}
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-white/10 shadow-xl">
            {product.category}
          </span>
          {isPartner && (
            <div className="relative group/partner">
              <span className="bg-amber-500/90 backdrop-blur-md text-slate-900 text-[8px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-lg border border-amber-400/20 cursor-help">
                <CheckCircle size={10} /> PARTNER UNIT
              </span>
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 text-white p-3 rounded-xl text-[10px] font-medium leading-relaxed opacity-0 invisible group-hover/partner:opacity-100 group-hover/partner:visible transition-all z-20 shadow-2xl border border-white/10">
                <div className="flex items-center gap-2 mb-1 text-amber-500 font-black">
                   <Factory size={12} /> {product.factoryName}
                </div>
                Certified partner fulfilling network-standard vibration molding.
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-7 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={() => onShowDetails(product)}
            className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Factory size={12} className="text-amber-500" />
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-tight truncate max-w-[120px]">
              {product.factoryName}
            </span>
          </button>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black text-slate-900">{product.averageRating}</span>
          </div>
        </div>

        <h3 className="font-extrabold text-slate-900 text-xl leading-none mb-3 group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-slate-500 text-xs line-clamp-2 mb-6 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
          <div>
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] block mb-1">UNIT RATE</span>
            <div className={`text-2xl font-bebas tracking-wide leading-none ${product.isFeatured ? 'text-amber-600' : 'text-slate-900'}`}>
              {formatPrice(product.price)}
            </div>
          </div>
          
          <button 
            onClick={() => onAddToCart(product)}
            className={`px-5 py-3 rounded-2xl transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 ${
              product.isFeatured 
                ? 'bg-slate-900 text-amber-500 hover:bg-slate-800 shadow-slate-900/10' 
                : 'bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-amber-500/20'
            }`}
          >
            <Plus size={18} strokeWidth={3} /> Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
