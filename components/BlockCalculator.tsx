import React, { useState, useMemo } from 'react';
import { Calculator, Ruler, Layers, ChevronRight, Info, CheckCircle2, ShoppingCart, Package, Home, Building } from 'lucide-react';
import { Product } from '../types';

interface BlockCalculatorProps {
  onAddToCart?: (product: Product, quantity: number) => void;
  cementProducts?: Product[];
}

type CalcMode = 'manual' | 'house';

const HOUSE_PRESETS = [
  { id: '3bed', label: '3 Bedroom', rooms: 3, blocks: 3200, area: 145, description: 'Typical 3-bedroom detached house with 145sqm footprint.' },
  { id: '4bed', label: '4 Bedroom', rooms: 4, blocks: 4500, area: 190, description: 'Standard 4-bedroom executive house with 190sqm footprint.' },
  { id: '5bed', label: '5 Bedroom', rooms: 5, blocks: 5800, area: 240, description: 'Large 5-bedroom family residence with 240sqm footprint.' },
];

const BlockCalculator: React.FC<BlockCalculatorProps> = ({ onAddToCart, cementProducts = [] }) => {
  const [mode, setMode] = useState<CalcMode>('manual');
  const [length, setLength] = useState<string>('10');
  const [height, setHeight] = useState<string>('3');
  const [blockType, setBlockType] = useState<'5' | '6' | '8'>('6');
  const [selectedCementId, setSelectedCementId] = useState<string>(cementProducts[0]?.id || '');
  const [selectedHouseId, setSelectedHouseId] = useState<string>('3bed');
  
  const manualResult = useMemo(() => {
    const l = parseFloat(length) || 0;
    const h = parseFloat(height) || 0;
    const area = l * h;
    const blocksNeeded = Math.ceil((area / 0.08) * 1.05);
    const cementYield = blockType === '8' ? 42 : blockType === '6' ? 55 : 65;
    
    return {
      area: area.toFixed(2),
      blocks: blocksNeeded,
      bagsOfCement: Math.ceil(blocksNeeded / cementYield),
      sandTons: (blocksNeeded * 0.009).toFixed(1),
      estimatedDays: Math.ceil(blocksNeeded / 400)
    };
  }, [length, height, blockType]);

  const houseResult = useMemo(() => {
    const preset = HOUSE_PRESETS.find(p => p.id === selectedHouseId) || HOUSE_PRESETS[0];
    const blocksNeeded = preset.blocks;
    const cementYield = blockType === '8' ? 42 : blockType === '6' ? 55 : 65;

    return {
      area: preset.area.toString(),
      blocks: blocksNeeded,
      bagsOfCement: Math.ceil(blocksNeeded / cementYield),
      sandTons: (blocksNeeded * 0.009).toFixed(1),
      estimatedDays: Math.ceil(blocksNeeded / 400)
    };
  }, [selectedHouseId, blockType]);

  const result = mode === 'manual' ? manualResult : houseResult;

  const handleAddCementToCart = () => {
    if (!onAddToCart) return;
    const cement = cementProducts.find(p => p.id === selectedCementId);
    if (cement && result.bagsOfCement > 0) {
      onAddToCart(cement, result.bagsOfCement);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calculator className="text-amber-500" />
            <h2 className="text-xl font-bold">Smart Material Estimator</h2>
          </div>
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button 
              onClick={() => setMode('manual')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'manual' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              Wall Estimator
            </button>
            <button 
              onClick={() => setMode('house')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'house' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              House Presets
            </button>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {mode === 'manual' ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Ruler size={16} className="text-amber-500" /> Wall Length (Meters)
                    </label>
                    <input 
                      type="number" 
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none font-bold"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Ruler size={16} className="text-amber-500 transform rotate-90" /> Wall Height (Meters)
                    </label>
                    <input 
                      type="number" 
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none font-bold"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Home size={16} className="text-amber-500" /> Select House Configuration
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {HOUSE_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedHouseId(p.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all relative group overflow-hidden ${
                          selectedHouseId === p.id 
                            ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/10' 
                            : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-bold ${selectedHouseId === p.id ? 'text-amber-900' : 'text-slate-800'}`}>{p.label}</span>
                          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-100 px-2 py-0.5 rounded">Typical Accra Footprint</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-tight">{p.description}</p>
                        {selectedHouseId === p.id && (
                          <div className="absolute right-0 bottom-0 p-1 bg-amber-500 text-white rounded-tl-lg">
                            <CheckCircle2 size={12} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Layers size={16} className="text-amber-500" /> Structural Block Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['5', '6', '8'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setBlockType(size as any)}
                      className={`py-3 rounded-xl border-2 font-bold transition-all ${
                        blockType === size 
                          ? 'border-amber-500 bg-amber-50 text-amber-700' 
                          : 'border-slate-200 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {size}-inch {size === '6' && <span className="text-[9px] block text-amber-600">(Standard Accra)</span>}
                    </button>
                  ))}
                </div>
              </div>

              {onAddToCart && cementProducts.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Package size={16} className="text-amber-500" /> Select Cement Brand
                  </label>
                  <select 
                    value={selectedCementId}
                    onChange={(e) => setSelectedCementId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-sm"
                  >
                    {cementProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - GH₵ {p.price}/bag</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs">Estimated Requirements</h3>
                {mode === 'house' && (
                  <div className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Whole House View</div>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between group">
                  <span className="text-slate-600">{mode === 'manual' ? 'Total Wall Area' : 'Footprint Area'}</span>
                  <span className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{result.area} m²</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20">
                  <span className="text-slate-900 font-bold">Total Blocks</span>
                  <div className="text-right">
                    <span className="text-3xl font-bebas text-slate-900 tracking-wider block leading-none">{result.blocks.toLocaleString()}</span>
                    <span className="text-[9px] font-bold text-slate-900/60 uppercase">Units required</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Cement Bags</span>
                    <span className="text-lg font-bold text-slate-800">{result.bagsOfCement} Bags</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Sharp Sand</span>
                    <span className="text-lg font-bold text-slate-800">~{result.sandTons} Tons</span>
                  </div>
                </div>

                {onAddToCart && result.bagsOfCement > 0 && (
                  <button 
                    onClick={handleAddCementToCart}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 group"
                  >
                    <ShoppingCart size={18} className="text-amber-500 group-hover:scale-110 transition-transform" />
                    Add {result.bagsOfCement} Bags to Cart
                  </button>
                )}

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3 text-blue-700">
                  <Info size={18} />
                  <p className="text-xs font-bold leading-tight">Estimated Build Time: {result.estimatedDays} {result.estimatedDays === 1 ? 'Day' : 'Days'} for a standard crew.</p>
                </div>
              </div>

              <p className="mt-6 text-[10px] text-slate-400 italic">
                * Calculations include 5% breakage allowance. {mode === 'house' ? 'House estimates are based on typical Accra residential designs.' : 'Consult a site engineer for exact needs.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
          <CheckCircle2 size={20} className="text-amber-600" /> {mode === 'house' ? 'House Preset Insights' : 'Material Guide'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-amber-800/80 leading-relaxed">
          <div>
            <p className="font-bold text-amber-900 mb-1">Block Count Accuracy</p>
            <p>
              {mode === 'house' 
                ? 'Our house presets use standard 6-inch blocks for outer and inner walls. For foundations, we recommend switching to solid 6" or 8" units, which can increase block count by ~15%.'
                : 'We automatically add 5% to account for site breakages. Our blocks are vibration-molded at Modegah or certified partner factories.'}
            </p>
          </div>
          <div>
            <p className="font-bold text-amber-900 mb-1">Cement Selection</p>
            <p>For load-bearing walls in {mode === 'house' ? 'Accra houses' : 'load-bearing walls'}, we recommend Grade 42.5R (Ghacem Super Strong or Dangote). Grade 32.5R (Dzata) is ideal for plastering.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockCalculator;