import React from 'react';
import { MARKET_DATA } from '../constants';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketTicker: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white py-1.5 overflow-hidden border-b border-white/5 relative z-50">
      <div className="animate-ticker flex gap-12 items-center">
        {MARKET_DATA.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 text-sm font-bold">
            <span className="text-slate-400">{item.symbol}</span>
            <span>{item.price}</span>
            <span className={item.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}>
              {item.change.startsWith('+') ? <TrendingUp size={14} className="inline ml-1" /> : <TrendingDown size={14} className="inline ml-1" />}
              {item.change}
            </span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {MARKET_DATA.map((item, idx) => (
          <div key={`dup-${idx}`} className="flex items-center gap-3 text-sm font-bold">
            <span className="text-slate-400">{item.symbol}</span>
            <span>{item.price}</span>
            <span className={item.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}>
              {item.change.startsWith('+') ? <TrendingUp size={14} className="inline ml-1" /> : <TrendingDown size={14} className="inline ml-1" />}
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketTicker;