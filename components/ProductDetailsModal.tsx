
import React, { useState } from 'react';
import { Product, Review } from '../types';
import { X, Star, ShoppingCart, ShieldCheck, Ruler, Weight, Hammer, Send, User, Clock, MapPin, Factory, Info } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  formatPrice: (price: number) => string;
  onAddToCart: (product: Product) => void;
  reviews: Review[];
  onAddReview: (productId: string, rating: number, comment: string, userName: string) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  product, 
  onClose, 
  formatPrice, 
  onAddToCart, 
  reviews,
  onAddReview
}) => {
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;
    onAddReview(product.id, newRating, newComment, userName);
    setNewComment('');
    setUserName('');
    setNewRating(5);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300">
        
        {/* Product Image Section */}
        <div className="w-full md:w-1/2 bg-slate-100 relative h-72 md:h-auto border-r border-slate-100">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <span className="bg-slate-900/90 backdrop-blur-md text-white text-xs font-black px-4 py-2 rounded-xl shadow-2xl border border-white/10 uppercase tracking-widest">
              {product.category}
            </span>
            <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-black px-4 py-2 rounded-xl shadow-xl border border-slate-200 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} className="text-amber-500" /> Certified Quality
            </span>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all md:hidden"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 flex flex-col h-full overflow-y-auto">
          {/* Header */}
          <div className="p-10 pb-0 flex justify-between items-start">
            <div className="w-full">
              <div className="flex items-center gap-2 mb-3">
                <Factory size={16} className="text-amber-500" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Produced by: {product.factoryName}</span>
              </div>
              <h2 className="text-4xl font-bebas tracking-wide text-slate-900 leading-none mb-4">{product.name}</h2>
              <div className="flex items-center gap-3">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < Math.floor(product.averageRating) ? "currentColor" : "none"} className={i < Math.floor(product.averageRating) ? "" : "text-slate-200"} />
                  ))}
                </div>
                <span className="text-sm font-black text-slate-900">{product.averageRating} <span className="text-slate-400 font-bold ml-1">({product.reviewCount} Reviews)</span></span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-all hidden md:block"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-10 space-y-8">
            {/* Price & Delivery Card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Price</p>
                <div className="text-4xl font-bebas text-slate-900 tracking-tight">
                  {formatPrice(product.price)} <span className="text-sm font-normal text-slate-400 font-sans ml-1">/ unit</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-amber-600 font-black text-xs uppercase tracking-widest justify-end">
                  <Clock size={14} /> 24-48H Delivery
                </div>
                <div className="text-[10px] text-slate-500 font-bold mt-1">Greater Accra Area Only</div>
              </div>
            </div>

            {/* Description Section */}
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Info size={14} className="text-amber-500" /> Usage Recommendation
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">{product.description}</p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center shadow-sm">
                <Ruler size={24} className="text-amber-500 mb-2" />
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Dimensions</span>
                <span className="text-xs font-black text-slate-900 mt-1">{product.specifications.dimensions}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center shadow-sm">
                <Weight size={24} className="text-amber-500 mb-2" />
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Unit Weight</span>
                <span className="text-xs font-black text-slate-900 mt-1">{product.specifications.weight}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center shadow-sm">
                <Hammer size={24} className="text-amber-500 mb-2" />
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Compressive</span>
                <span className="text-xs font-black text-slate-900 mt-1">{product.specifications.strength}</span>
              </div>
            </div>

            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 active:scale-95 text-sm uppercase tracking-widest"
            >
              <ShoppingCart size={20} /> Add to Construction Plan
            </button>

            {/* Reviews Section */}
            <div className="pt-10 border-t border-slate-100">
              <h3 className="text-2xl font-bebas tracking-wide mb-6">Network <span className="text-amber-500">Feedback</span></h3>
              
              <div className="space-y-6 mb-10">
                {reviews.length > 0 ? reviews.map(review => (
                  <div key={review.id} className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-slate-200 text-amber-500 rounded-xl flex items-center justify-center shadow-sm">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{review.userName}</p>
                          <div className="flex text-amber-500 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{review.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{review.comment}"</p>
                  </div>
                )) : (
                  <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No site feedback yet</p>
                  </div>
                )}
              </div>

              {/* Add Review Form */}
              <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl">
                <h4 className="text-xl font-bebas tracking-wide mb-6">Leave <span className="text-amber-500">Your Mark</span></h4>
                <form onSubmit={handleSubmitReview} className="space-y-5">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Site Rating:</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className={`transition-all hover:scale-125 ${newRating >= star ? 'text-amber-500' : 'text-slate-700'}`}
                        >
                          <Star size={24} fill={newRating >= star ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Site Manager / Owner Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-5 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-bold placeholder:text-slate-500"
                    required
                  />
                  <textarea 
                    placeholder="Notes on block quality, delivery, or texture..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-bold placeholder:text-slate-500 resize-none"
                    required
                  />
                  <button 
                    type="submit"
                    className="w-full bg-amber-500 text-slate-900 font-black py-4 rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest shadow-xl shadow-amber-500/10"
                  >
                    Post Official Review <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
