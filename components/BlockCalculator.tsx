
import React, { useState } from 'react';
import { Calculator, Ruler, Layers, ChevronRight } from 'lucide-react';

const BlockCalculator: React.FC = () => {
  const [length, setLength] = useState<string>('10');
  const [height, setHeight] = useState<string>('3');
  const [blockType, setBlockType] = useState<'4' | '5' | '6' | '8'>('6');
  
  const calculateResult = () => {
    const l = parseFloat(length) || 0;
    const h = parseFloat(height) || 0;
    const area = l * h;
    
    // Area of a standardized block face is approx 0.40m x 0.20m = 0.08 sqm
    // We add ~5% for wastage
    const blocksNeeded = Math.ceil((area / 0.08) * 1.05);
    
    return {
      area: area.toFixed(2),
      blocks: blocksNeeded,
      bagsOfCement: Math.ceil(blocksNeeded / 55), // Adjusted for smaller block size (55 blocks per bag)
      sandTons: (blocksNeeded * 0.009).toFixed(1) // Rough estimation per block
    };
  };

  const result = calculateResult();

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      <div className="bg-slate-900 p-6 text-white flex items-center gap-3">
        <Calculator className="text-amber-500" />
        <h2 className="text-xl font-bold">Block Estimator</h2>
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
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

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Layers size={16} className="text-amber-500" /> Block Size (Width)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['4', '5', '6', '8'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setBlockType(size as any)}
                    className={`py-3 rounded-xl border-2 font-bold transition-all ${
                      blockType === size 
                        ? 'border-amber-500 bg-amber-50 text-amber-700' 
                        : 'border-slate-200 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {size}-inch
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-center">
            <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">Estimated Requirements</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between group">
                <span className="text-slate-600">Total Area</span>
                <span className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{result.area} m²</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20">
                <span className="text-slate-900 font-bold">Total Blocks</span>
                <span className="text-3xl font-bebas text-slate-900 tracking-wider">{result.blocks}</span>
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
            </div>

            <p className="mt-6 text-[10px] text-slate-400 italic">
              * Calculations include 5% breakage allowance. Results are estimates based on standard 400mm x 200mm face area. Consult a site engineer for exact needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockCalculator;
