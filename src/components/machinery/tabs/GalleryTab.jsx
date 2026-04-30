import React from 'react';
import { PlusCircle, Star } from 'lucide-react';
import { useAuthContext } from '../../../hooks/useAuthContext';

export default function GalleryTab({ 
  extraData, 
  uploading, 
  handleFileUpload, 
  setAsCover, 
  selectedMachine 
}) {
  const { profile } = useAuthContext();
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {isAdmin && (
        <label className={`aspect-square border-2 border-dashed border-borderBrand rounded-3xl flex flex-col items-center justify-center text-textMuted hover:border-accentAmber hover:text-accentAmber transition-all cursor-pointer bg-surfaceSubtle/20 group relative overflow-hidden ${uploading ? 'opacity-50' : ''}`}>
         {uploading ? (
           <div className="w-8 h-8 border-4 border-accentAmber border-t-transparent animate-spin rounded-full" />
         ) : (
           <>
             <PlusCircle size={32} className="group-hover:scale-110 transition-transform" />
             <span className="text-[9px] font-bold uppercase mt-3 tracking-[0.2em]">Upload Foto</span>
           </>
         )}
         <input 
           type="file" 
           className="hidden" 
           accept="image/*"
           disabled={uploading}
           onChange={(e) => handleFileUpload(e.target.files[0], 'image')}
         />
      </label>
      )}
      {extraData.images.map((img, i) => (
        <div key={i} className="aspect-square rounded-3xl overflow-hidden border border-borderBrand relative group shadow-lg">
           <img src={img.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Tech" />
           {isAdmin && (
             <div className="absolute inset-0 bg-accentAmber/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer backdrop-blur-sm">
                <button 
                  onClick={() => setAsCover(img.url)}
                  className="p-3 bg-white rounded-full text-accentAmber shadow-xl hover:scale-110 transition-transform flex items-center gap-2"
                >
                   <Star size={20} fill={selectedMachine?.cover_image_url === img.url ? 'currentColor' : 'none'} />
                </button>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-black/50 px-2 py-1 rounded">Definir Capa</span>
             </div>
           )}
           {selectedMachine?.cover_image_url === img.url && (
             <div className="absolute top-2 right-2 p-1.5 bg-accentAmber text-white rounded-lg shadow-lg">
               <Star size={14} fill="currentColor" />
             </div>
           )}
        </div>
      ))}
    </div>
  );
}
