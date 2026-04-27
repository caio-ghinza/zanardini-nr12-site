import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Hooks
import { useMachinery } from '../../hooks/useMachinery';
import { useMachineExtraData } from '../../hooks/useMachineExtraData';
import { useMachineUpload } from '../../hooks/useMachineUpload';

// Components
import MachineryToolbar from '../machinery/MachineryToolbar';
import MachineryGrid from '../machinery/MachineryGrid';
import MachineryModal from '../machinery/MachineryModal';
import AddMachineWizard from '../machinery/AddMachineWizard';

export default function MachineryTab() {
  const {
    loading,
    search,
    setSearch,
    filterType,
    setFilterType,
    filteredMachines,
    fetchMachines,
    deleteMachine,
    updateMachine,
    createMachine
  } = useMachinery();


  const [selectedMachine, setSelectedMachine] = useState(null);
  const [showAddWizard, setShowAddWizard] = useState(false);

  const {
    extraData,
    fetchExtraData,
    addMachineAction,
    togglePartStatus,
    deletePart,
    setAsCover,
    runAIAnalysis,
    runAutoScan,
    analyzingDocId,
    batchProgress
  } = useMachineExtraData(selectedMachine, fetchMachines);


  const { uploading, handleFileUpload } = useMachineUpload(selectedMachine, fetchExtraData);

  useEffect(() => {
    if (selectedMachine) {
      fetchExtraData(selectedMachine.id);
    }
  }, [selectedMachine, fetchExtraData]);

  const handleDelete = async (id) => {
    const success = await deleteMachine(id);
    if (success) setSelectedMachine(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col gap-2 text-left">
        <h2 className="text-3xl font-bold text-textPrimary font-['Sora'] tracking-tight">Máquinas</h2>
        <p className="text-sm text-textSecondary max-w-2xl leading-relaxed">
          Gestão centralizada de conformidade NR-12. Monitore o status de adequação, documentos técnicos e auditorias digitais por IA.
        </p>
      </header>


      <MachineryToolbar 
        search={search}
        setSearch={setSearch}
        filterType={filterType}
        setFilterType={setFilterType}
        onAddMachine={() => setShowAddWizard(true)}
        onAutoScan={runAutoScan}
        batchProgress={batchProgress}
      />


      <MachineryGrid 
        machines={filteredMachines}
        loading={loading}
        onMachineClick={setSelectedMachine}
        onAddClick={() => setShowAddWizard(true)}
      />

      <AnimatePresence>
        {selectedMachine && (
          <MachineryModal 
            machine={selectedMachine}
            onClose={() => setSelectedMachine(null)}
            extraData={extraData}
            uploading={uploading}
            handleFileUpload={handleFileUpload}
            addMachineAction={addMachineAction}
            togglePartStatus={togglePartStatus}
            deletePart={deletePart}
            setAsCover={setAsCover}
            runAIAnalysis={runAIAnalysis}
            analyzingDocId={analyzingDocId}
            onDeleteMachine={handleDelete}
            onUpdateMachine={updateMachine}
          />

        )}
      </AnimatePresence>

      <AddMachineWizard 
        isOpen={showAddWizard}
        onClose={() => setShowAddWizard(false)}
        onCreateMachine={createMachine}
      />
    </div>
  );
}
