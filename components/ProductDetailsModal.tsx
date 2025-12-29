
import React, { useState } from 'react';
import { Product, Review } from '../types';
import { X, Star, ShoppingCart, ShieldCheck, Ruler, Weight, Hammer, Send, User, Clock, Factory, Info, Heart, CheckCircle2, MapPin, Edit3 } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  formatPrice: (price: number) => string;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  reviews: Review[];
  onAddReview: (productId: string, rating: number, comment: string, userName: string) => void;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  product, onClose, formatPrice, onAddToCart, isWishlisted, onToggleWishlist, reviews, onAddReview, isAdmin, onEdit
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');

  const isPartner = !product.factoryName.toLowerCase().includes('modegah');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;
    onAddReview(product.id, newRating, newComment, userName);
    setNewComment('');
    setUserName('');
    setNewRating(5);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-500">
        
        {/* Left Side: Visuals */}
        <div className="w-full lg:w-1/2 bg-slate-100 relative h-72 lg:h-auto border-r border-slate-100 group">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
          
          <div className="absolute top-8 left-8 flex flex-col gap-3">
            <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-5 py-2.5 rounded-2xl shadow-2xl border border-white/20 uppercase tracking-[0.2em]">
              {product.category}
            </span>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all z-20"
          >
            <X size={24} />
          </button>

          <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
            <div className="p-6 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 shadow-2xl flex items-center gap-4">
               <div className="bg-amber-500 p-3 rounded-2xl">
                 <ShieldCheck size={28} className="text-slate-900" />
               </div>
               <div>
                 <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Quality Standard</p>
                 <p className="text-sm font-bold text-white">MOD-CERT-2024</p>
               </div>
            </div>
            
            {!isAdmin ? (
              <button 
                onClick={() => onToggleWishlist(product)}
                className={`p-5 rounded-[2rem] backdrop-blur-md transition-all duration-300 shadow-2xl active:scale-75 border ${
                  isWishlisted ? 'bg-pink-500 border-pink-400 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <Heart size={28} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            ) : (
              <button 
                onClick={() => onEdit?.(product)}
                className="p-5 rounded-[2rem] bg-blue-600 border border-blue-500 text-white shadow-2xl hover:bg-blue-700 transition-all active:scale-75 flex items-center gap-3"
              >
                <Edit3 size={28} />
                <span className="font-bebas text-xl tracking-wide uppercase">Edit Asset</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Details & Tabs */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white">
          <div className="p-8 sm:p-12 pb-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Factory size={14} className="text-amber-500" />
              </div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{product.factoryName}</span>
            </div>
            
            <h2 className="text-5xl font-bebas tracking-wide text-slate-900 leading-none mb-4">{product.name}</h2>
            
            <div className="flex items-center gap-6 mb-8">
               <div className="text-4xl font-bebas text-slate-900 tracking-tight flex items-baseline gap-2">
                {formatPrice(product.price)} <span className="text-xs font-black text-slate-400 uppercase tracking-widest font-sans">Per Unit</span>
              </div>
              <div className="h-8 w-px bg-slate-100" />
              <div className="flex items-center gap-1.5">
                <Star size={18} className="text-amber-500 fill-amber-500" />
                <span className="text-sm font-black text-slate-900">{product.averageRating}</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">({product.reviewCount} Reports)</span>
              </div>
            </div>

            {/* Modern Tab Header */}
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 mb-8">
               <button 
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'details' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'
                }`}
               >
                 Specifications
               </button>
               <button 
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'reviews' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'
                }`}
               >
                 Site Feedback
               </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 sm:px-12 pb-12">
            {activeTab === 'details' ? (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Info size={14} className="text-amber-500" /> Engineer's Note
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">{product.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 transition-colors hover:bg-white hover:shadow-xl group">
                    <Ruler size={24} className="text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Dimensions</span>
                    <span className="text-sm font-black text-slate-900">{product.specifications.dimensions}</span>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 transition-colors hover:bg-white hover:shadow-xl group">
                    <Weight size={24} className="text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Weight</span>
                    <span className="text-sm font-black text-slate-900">{product.specifications.weight}</span>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 transition-colors hover:bg-white hover:shadow-xl group">
                    <Hammer size={24} className="text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Strength</span>
                    <span className="text-sm font-black text-slate-900">{product.specifications.strength}</span>
                  </div>
                </div>

                {isPartner && (
                  <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="bg-amber-500 p-2 rounded-xl text-slate-900">
                          <Factory size={20} />
                       </div>
                       <h5 className="text-sm font-black uppercase text-amber-900 tracking-widest">Factory Profile: {product.factoryName}</h5>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="flex items-start gap-3 text-xs">
                          <MapPin size={16} className="text-amber-600 shrink-0" />
                          <p className="text-amber-800 font-medium">Located in Greater Accra Network Region. Fully certified vibration molding facility.</p>
                       </div>
                       <div className="flex items-start gap-3 text-xs">
                          <ShieldCheck size={16} className="text-amber-600 shrink-0" />
                          <p className="text-amber-800 font-medium">Monthly Lab-Verified Compressive Strength. Compliant with Ghana Standards Authority.</p>
                       </div>
                    </div>
                  </div>
                )}

                <div className="p-6 bg-slate-900 text-white rounded-[2rem] flex items-center justify-between shadow-2xl">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-900">
                        <Clock size={24} />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none">Accra Logistics</p>
                       <p className="text-sm font-bold mt-1">Delivery in 24-48 Hours</p>
                     </div>
                   </div>
                   <CheckCircle2 size={24} className="text-green-400" />
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-6">
                  {reviews.length > 0 ? reviews.map(review => (
                    <div key={review.id} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-900 text-amber-500 rounded-2xl flex items-center justify-center font-black text-lg">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{review.userName}</p>
                            <div className="flex text-amber-500 gap-0.5 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={3} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{review.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{review.comment}"</p>
                    </div>
                  )) : (
                    <div className="text-center py-12 px-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center gap-4">
                      <div className="p-4 bg-white rounded-2xl text-slate-300">
                         <Info size={32} />
                      </div>
                      <p className="text-slate-400 text-xs font-black uppercase tracking-widest">No site feedback recorded yet</p>
                    </div>
                  )}
                </div>

                {/* Modern Review Form */}
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <h4 className="text-xl font-bebas tracking-wide mb-6 text-slate-900">SUBMIT <span className="text-amber-500">PROJECT DATA</span></h4>
                  <form onSubmit={handleSubmitReview} className="space-y-5">
                    <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</span>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className={`transition-transform hover:scale-125 ${newRating >= star ? 'text-amber-500' : 'text-slate-200'}`}
                          >
                            <Star size={24} fill={newRating >= star ? 'currentColor' : 'none'} strokeWidth={3} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Your Full Name (Site Manager)"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 outline-none text-sm font-bold placeholder:text-slate-300 transition-all"
                      required
                    />
                    <textarea 
                      placeholder="Describe the texture, compression, and delivery experience..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 outline-none text-sm font-bold placeholder:text-slate-300 transition-all resize-none"
                      required
                    />
                    <button 
                      type="submit"
                      className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest shadow-2xl active:scale-95"
                    >
                      Post Official Feedback <Send size={18} />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 sm:p-12 border-t border-slate-50 bg-slate-50/30">
            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-amber-500 text-slate-900 font-black py-6 rounded-3xl flex items-center justify-center gap-4 hover:bg-amber-400 transition-all shadow-2xl shadow-amber-500/20 active:scale-95 text-sm uppercase tracking-widest"
            >
              <ShoppingCart size={24} /> Add {product.name} to Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
