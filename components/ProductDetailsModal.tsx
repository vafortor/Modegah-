
import React, { useState } from 'react';
import { Product, Review } from '../types';
import { X, Star, ShoppingCart, ShieldCheck, Ruler, Weight, Hammer, Send, User } from 'lucide-react';

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
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300">
        
        {/* Product Image */}
        <div className="w-full md:w-1/2 bg-slate-100 relative h-64 md:h-auto">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all md:hidden"
          >
            <X size={24} />
          </button>
        </div>

        {/* Product Info & Reviews */}
        <div className="w-full md:w-1/2 flex flex-col h-full overflow-y-auto">
          <div className="p-8 pb-0 flex justify-between items-start">
            <div>
              <span className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-2 block">{product.category} Units</span>
              <h2 className="text-3xl font-bebas tracking-wide text-slate-900 mb-1">{product.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(product.averageRating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-500">{product.averageRating} ({product.reviewCount} Reviews)</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-all hidden md:block"
            >
              <X size={24} />
            </button>
          </div>

          <div className="px-8 space-y-6">
            <div className="text-3xl font-extrabold text-slate-900">
              {formatPrice(product.price)} <span className="text-sm font-normal text-slate-400">per unit</span>
            </div>

            <p className="text-slate-500 leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center">
                <Ruler size={20} className="text-amber-500 mb-2" />
                <span className="text-[10px] text-slate-400 font-bold uppercase">Dimensions</span>
                <span className="text-xs font-bold text-slate-700">{product.specifications.dimensions.split(' ')[0]}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center">
                <Weight size={20} className="text-amber-500 mb-2" />
                <span className="text-[10px] text-slate-400 font-bold uppercase">Weight</span>
                <span className="text-xs font-bold text-slate-700">{product.specifications.weight}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center">
                <Hammer size={20} className="text-amber-500 mb-2" />
                <span className="text-[10px] text-slate-400 font-bold uppercase">Strength</span>
                <span className="text-xs font-bold text-slate-700">{product.specifications.strength}</span>
              </div>
            </div>

            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              <ShoppingCart size={20} /> Add to Order
            </button>

            {/* Reviews Section */}
            <div className="pt-8 border-t border-slate-100">
              <h3 className="text-xl font-bebas tracking-wide mb-6">Customer <span className="text-amber-500">Reviews</span></h3>
              
              <div className="space-y-6 mb-10">
                {reviews.length > 0 ? reviews.map(review => (
                  <div key={review.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{review.userName}</p>
                          <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{review.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">"{review.comment}"</p>
                  </div>
                )) : (
                  <p className="text-slate-400 text-sm text-center py-4">No reviews yet. Be the first to leave one!</p>
                )}
              </div>

              {/* Add Review Form */}
              <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 mb-8 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4">Leave a Review</h4>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Rating</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className={`p-1 transition-transform hover:scale-125 ${newRating >= star ? 'text-amber-500' : 'text-slate-300'}`}
                        >
                          <Star size={24} fill={newRating >= star ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium"
                    required
                  />
                  <textarea 
                    placeholder="Share your experience with this block..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium resize-none"
                    required
                  />
                  <button 
                    type="submit"
                    className="w-full bg-amber-500 text-slate-900 font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                  >
                    Post Review <Send size={18} />
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
