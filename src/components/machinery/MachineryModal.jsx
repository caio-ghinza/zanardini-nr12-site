import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ShieldCheck, X } from 'lucide-react';
import { getRiskBadgeColor } from '../../utils/machineryConstants';
import ConfirmModal from '../ui/ConfirmModal';
import AdminOnly from '../admin/AdminOnly';

import DetailsTab from './tabs/DetailsTab';
import DossierTab from './tabs/DossierTab';
import ActionsTab from './tabs/ActionsTab';
import GalleryTab from './tabs/GalleryTab';

import { generateMachineReport } from '../../services/reportService';

export default function MachineryModal({ 
  machine, 
  onClose, 
  extraData,
  uploading,
  handleFileUpload,
  addMachineAction,
  togglePartStatus,
  deletePart,
  setAsCover,
  runAIAnalysis,
  analyzingDocId,
  onDeleteMachine,
  onUpdateMachine
}) {
  const [modalTab, setModalTab] = useState('details');
  const [isPdfOpen, setIsPdfOpen] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!machine) return null;

  const handleExport = () => {
    generateMachineReport(machine, extraData);
  };

  const confirmDelete = () => {
    onDeleteMachine(machine.id);
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-5xl h-[85vh] overflow-hidden rounded-2xl border border-borderBrand shadow-2xl flex flex-col relative"
        >
          {/* HEADER */}
          <div className="p-6 border-b border-borderBrand flex justify-between items-center bg-surfaceSubtle">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${getRiskBadgeColor(machine.risk_level)}`}>
                <ShieldCheck size={20} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-textPrimary leading-none mb-1">{machine.name}</h3>
                <p className="text-[10px] text-textMuted uppercase font-bold tracking-widest">{machine.model} • Central de Matrizes</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white rounded-full transition-all text-textMuted hover:text-textPrimary"
            >
              <Plus size={24} className="rotate-45" />
            </button>
          </div>

          {/* INTERNAL NAV */}
          <div className="bg-surfaceSubtle/50 px-8 border-b border-borderBrand flex gap-8">
            {[
              { id: 'details', label: 'Resumo' },
              { id: 'docs', label: 'Dossiê' },
              { id: 'actions', label: 'Ações' },
              { id: 'images', label: 'Galeria' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setModalTab(tab.id)}
                className={`py-4 px-1 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${modalTab === tab.id ? 'text-accentAmber border-b-2 border-accentAmber' : 'text-textMuted hover:text-textPrimary'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 overflow-y-auto p-8 relative">
            {modalTab === 'details' && <DetailsTab selectedMachine={machine} onUpdate={onUpdateMachine} />}

            
            {modalTab === 'docs' && (
              <DossierTab 
                extraData={extraData}
                uploading={uploading}
                handleFileUpload={handleFileUpload}
                setIsPdfOpen={setIsPdfOpen}
                analyzingDocId={analyzingDocId}
                runAIAnalysis={(doc) => runAIAnalysis(doc, machine.name)}
              />
            )}

            {modalTab === 'actions' && (
              <ActionsTab 
                extraData={extraData}
                addMachineAction={addMachineAction}
                togglePartStatus={togglePartStatus}
                deletePart={deletePart}
              />
            )}

            {modalTab === 'images' && (
              <GalleryTab 
                extraData={extraData}
                uploading={uploading}
                handleFileUpload={handleFileUpload}
                setAsCover={setAsCover}
                selectedMachine={machine}
              />
            )}

            {/* PDF PREVIEW OVERLAY */}
            <AnimatePresence>
              {isPdfOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 30 }}
                  className="absolute inset-0 z-[80] bg-white flex flex-col rounded-2xl shadow-3xl"
                >
                  <div className="p-4 border-b border-borderBrand flex justify-between items-center bg-surfaceSubtle">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accentAmber animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-textPrimary">DocView Engine / Preview Técnico</span>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={isPdfOpen} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white border border-borderBrand rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-surfaceSubtle transition-all"
                      >
                        Download PDF
                      </a>
                      <button onClick={() => setIsPdfOpen(null)} className="p-2 hover:bg-white rounded-lg transition-colors border border-borderBrand">
                          <X size={20} />
                      </button>
                    </div>
                  </div>
                  <iframe src={isPdfOpen} className="flex-1 w-full border-none bg-surface/50" title="PDF Preview" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-borderBrand flex justify-between items-center bg-surfaceSubtle">
            <AdminOnly>
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-accentRed hover:bg-accentRedLight rounded-lg transition-all border border-transparent hover:border-accentRed/20"
              >
                Excluir Registro
              </button>
            </AdminOnly>
            <div className="flex gap-4">
              <button 
                onClick={handleExport}
                className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-textSecondary hover:text-textPrimary transition-all border border-borderBrand rounded-lg bg-white/50 active:scale-95"
              >
                Exportar PDF Master
              </button>
              <button 
                onClick={onClose}
                className="px-8 py-2.5 bg-accentAmber text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-accentAmberHover transition-all shadow-lg shadow-accentAmber/20"
              >
                Fechar Painel
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="AVISO CRÍTICO"
        message={`Deseja realmente excluir o registro da máquina "${machine.name}"? Esta ação removerá permanentemente todos os documentos, imagens e dados de auditoria vinculados.`}
        confirmLabel="Excluir Permanentemente"
        isDestructive={true}
      />
    </>
  );
}

