import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ShieldCheck, X } from 'lucide-react';
import { getRiskBadgeColor } from '../../utils/machineryConstants';
import ConfirmModal from '../ui/ConfirmModal';
import AdminOnly from '../admin/AdminOnly';

import DetailsTab from './tabs/DetailsTab';
import DossierTab from './tabs/DossierTab';
import ActionsTab from './tabs/ActionsTab';
import GalleryTab from './tabs/GalleryTab';
import VerificationsTab from './tabs/VerificationsTab';

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
  analyzingDocId,
  onDeleteMachine,
  onUpdateMachine,
  deleteDocument,
  updateVerifications,
  runAIAnalysis
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

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6 bg-background/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full h-full md:h-[85vh] md:max-w-5xl overflow-hidden md:rounded-2xl border-x md:border border-borderBrand shadow-2xl flex flex-col relative pt-safe-area pb-safe-area"
        >
          {/* HEADER */}
          <div className="p-4 md:p-6 border-b border-borderBrand flex justify-between items-center bg-surfaceSubtle">
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`p-2 rounded-lg ${getRiskBadgeColor(machine.risk_level)}`}>
                <ShieldCheck size={18} className="md:w-5 md:h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-lg md:text-xl font-bold text-textPrimary leading-none mb-1">{machine.name}</h3>
                <p className="text-[9px] md:text-[10px] text-textMuted uppercase font-bold tracking-widest leading-tight">{machine.model} • Central de Matrizes</p>
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
          <div className="bg-surfaceSubtle/50 px-4 md:px-8 border-b border-borderBrand flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide">
            {[
              { id: 'details', label: 'Resumo' },
              { id: 'verifications', label: 'Verificações' },
              { id: 'actions', label: 'Ações' },
              { id: 'docs', label: 'Dossiê' },
              { id: 'images', label: 'Galeria' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setModalTab(tab.id)}
                className={`py-4 px-1 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all relative whitespace-nowrap ${modalTab === tab.id ? 'text-accentAmber border-b-2 border-accentAmber' : 'text-textMuted hover:text-textPrimary'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
            {modalTab === 'details' && (
              <DetailsTab 
                selectedMachine={machine} 
                onUpdate={onUpdateMachine} 
                extraData={extraData}
              />
            )}

            
            {modalTab === 'docs' && (
              <DossierTab 
                extraData={extraData}
                uploading={uploading}
                handleFileUpload={handleFileUpload}
                setIsPdfOpen={setIsPdfOpen}
                analyzingDocId={analyzingDocId}
                runAIAnalysis={runAIAnalysis ? (doc) => runAIAnalysis(doc, machine.name) : undefined}
                deleteDocument={deleteDocument}
              />
            )}

            {modalTab === 'verifications' && (
              <VerificationsTab 
                verifications={extraData.verifications}
                onUpdate={updateVerifications}
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
    </>,
    document.body
  );
}

