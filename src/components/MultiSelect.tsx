import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X, Image as ImageIcon } from 'lucide-react';

export interface Option {
  id: string;
  name: string;
  icon?: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedIds,
  onChange,
  placeholder = "Chọn tiện ích..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(itemId => itemId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeOption = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onChange(selectedIds.filter(itemId => itemId !== id));
  };

  const clearAll = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange([]);
  };

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter(opt => selectedIds.includes(opt.id));

  return (
    <div className="relative w-full text-sm" ref={wrapperRef}>
      <div 
        className={`min-h-[42px] w-full px-3 py-1.5 bg-white border ${isOpen ? 'border-indigo-600 ring-1 ring-indigo-600/20' : 'border-slate-200'} rounded-lg cursor-text flex flex-wrap gap-1.5 items-center transition-all`}
        onClick={() => setIsOpen(true)}
      >
        {selectedOptions.length === 0 && !searchTerm && (
          <span className="text-slate-400 select-none pl-1 text-xs">{placeholder}</span>
        )}
        
        {selectedOptions.map(opt => (
          <span 
            key={opt.id} 
            className="flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded text-xs select-none"
          >
            {opt.icon && <img src={opt.icon} alt="" className="w-3.5 h-3.5 object-contain" />}
            <span>{opt.name}</span>
            <X 
              className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 cursor-pointer ml-0.5" 
              onClick={(e) => removeOption(opt.id, e)}
            />
          </span>
        ))}

        <input
          type="text"
          className="flex-1 min-w-[60px] bg-transparent outline-none text-slate-700 text-xs py-1"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />

        <div className="flex items-center gap-1.5 ml-auto">
          {selectedIds.length > 0 && (
            <>
              <X 
                className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" 
                onClick={clearAll}
                title="Xóa tất cả"
              />
              <div className="w-px h-4 bg-slate-200"></div>
            </>
          )}
          <ChevronDown 
            className={`w-4 h-4 text-slate-400 transition-transform cursor-pointer ${isOpen ? 'rotate-180' : ''}`} 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-center text-slate-500 text-xs italic">Không tìm thấy tiện ích nào</div>
          ) : (
            <ul className="py-1">
              {filteredOptions.map((opt) => {
                const isSelected = selectedIds.includes(opt.id);
                return (
                  <li
                    key={opt.id}
                    className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-50/50 hover:bg-indigo-50' : 'hover:bg-slate-50'
                    }`}
                    onClick={(e) => toggleOption(opt.id, e)}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    {opt.icon ? (
                      <img src={opt.icon} alt="" className="w-4 h-4 object-contain" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-slate-300" />
                    )}
                    <span className={`text-xs ${isSelected ? 'font-medium text-indigo-900' : 'text-slate-700'}`}>
                      {opt.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
