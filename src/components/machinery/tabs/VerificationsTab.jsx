import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, MinusCircle, ChevronDown, ChevronUp, Lock, Shield, Zap, Wind } from 'lucide-react';
import { useAuthContext } from '../../../hooks/useAuthContext';

const VERIFICATION_ITEMS = [
  {
    category: "Sistemas Elétricos e de Controle",
    icon: Lock,
    items: [
      { id: 'v1', title: "O painel principal permite bloqueio com cadeado?", hint: "Verificar se a alavanca de liga/desliga geral possui furos para a colocação de cadeados de segurança." },
      { id: 'v2', title: "O botão de emergência trava ao ser acionado?", hint: "Pressionar o botão vermelho. Checar se ele fica afundado e só destrava ao ser puxado ou girado." },
      { id: 'v3', title: "O local de religar a máquina tem visão limpa do perigo?", hint: "Posicionar-se no botão de 'Reset' e checar se é possível ver a máquina inteira, garantindo que não há ninguém na área de risco." },
      { id: 'v4', title: "O painel possui relés de segurança dedicados?", hint: "Inspecionar o painel elétrico procurando por componentes exclusivos de segurança (geralmente caixas amarelas ou vermelhas)." },
      { id: 'v5', title: "Os fios de segurança estão protegidos?", hint: "Checar se os cabos de sensores e botões estão dentro de conduítes ou calhas de metal, sem fios soltos." }
    ]
  },
  {
    category: "Grades e Proteções",
    icon: Shield,
    items: [
      { id: 'v6', title: "As grades de proteção são altas e fixas?", hint: "Confirmar se as grades têm pelo menos 1,80m de altura e se é obrigatório usar ferramentas (como chaves) para removê-las." },
      { id: 'v7', title: "Os buracos da tela impedem a passagem da mão?", hint: "Testar visualmente se os vãos da grade são pequenos o suficiente para impedir que a mão alcance as peças que esmagam." },
      { id: 'v8', title: "As portas de acesso possuem sensores de segurança?", hint: "Verificar se as portas móveis (usadas na operação) possuem sensores magnéticos ou chaves de segurança instaladas." },
      { id: 'v9', title: "A máquina freia imediatamente ao abrir a porta?", hint: "Com a máquina rodando vazia, abrir a porta. Checar se o movimento perigoso é interrompido na mesma hora." }
    ]
  },
  {
    category: "Sopradoras e Prensas",
    icon: Zap,
    items: [
      { id: 'v10', title: "As partes quentes estão isoladas?", hint: "Verificar se há mantas ou chapas cobrindo as áreas acima de 60ºC para evitar queimaduras acidentais." },
      { id: 'v11', title: "A área das lâminas de corte é fechada?", hint: "Checar se a faca de corte possui uma caixa de proteção metálica ao redor, impedindo o acesso físico." },
      { id: 'v12', title: "Existe um calço mecânico de segurança?", hint: "Procurar por um bloco de aço ou haste reforçada que seja colocado na máquina para segurar o peso durante a troca de moldes." },
      { id: 'v13', title: "A cortina de luz freia a máquina a tempo?", hint: "Simular a interrupção do laser com a mão e testar se a prensa freia totalmente antes de a mão alcançar a zona de esmagamento." },
      { id: 'v14', title: "O comando exige o uso das duas mãos juntas?", hint: "Testar o painel bimanual. Confirmar se a máquina só liga apertando os dois botões ao mesmo tempo (e se possuem capas de proteção)." },
      { id: 'v15', title: "Engrenagens e correias estão cobertas?", hint: "Inspecionar as partes giratórias (polias, volantes, correias) e confirmar se possuem tampas de chapa de aço protegendo-as." },
      { id: 'v16', title: "A dobradeira possui feixe laser na ferramenta?", hint: "Verificar se existe um laser de segurança passando imediatamente abaixo da ferramenta de dobra para proteger os dedos." }
    ]
  },
  {
    category: "Sistemas Hidráulicos, Pneumáticos e Robótica",
    icon: Wind,
    items: [
      { id: 'v17', title: "A máquina tem válvulas de óleo em dobro?", hint: "Checar na unidade hidráulica se as válvulas de segurança estão instaladas em pares (redundância) para garantir a parada caso uma falhe." },
      { id: 'v18', title: "É possível esvaziar o ar da máquina e trancá-la?", hint: "Localizar o registro geral de ar comprimido, fechar e verificar se a pressão esvazia e se há furo para colocar cadeado." },
      { id: 'v19', title: "O botão de emergência do robô para a prensa?", hint: "Acionar a emergência no controle manual do robô e checar se a prensa acoplada a ele também é desligada." },
      { id: 'v20', title: "A área cercada possui scanner de chão?", hint: "Inspecionar o piso da célula do robô procurando por um scanner a laser, que impede a religação se alguém estiver escondido dentro da área." }
    ]
  }
];

export default function VerificationsTab({ verifications = {}, onUpdate }) {
  const [openHints, setOpenHints] = useState({});
  const { profile } = useAuthContext();
  const isAdmin = profile?.role === 'admin';

  const toggleHint = (id) => {
    setOpenHints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStatusChange = (itemId, status) => {
    onUpdate({ ...verifications, [itemId]: status });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-2">
      {VERIFICATION_ITEMS.map((cat, catIdx) => (
        <section key={catIdx} className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <cat.icon size={14} className="text-accentAmber" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-textSecondary/70">
              {cat.category}
            </h3>
          </div>

          <div className="bg-white border border-borderBrand rounded-2xl overflow-hidden shadow-sm">
            {cat.items.map((item, itemIdx) => {
              const currentStatus = verifications[item.id] || 'pending';
              const isOpen = openHints[item.id];
              
              return (
                <div 
                  key={item.id}
                  className={`
                    flex flex-col border-b border-borderBrand/50 last:border-0 
                    transition-colors hover:bg-surfaceSubtle/30
                    ${isOpen ? 'bg-surfaceSubtle/20' : ''}
                  `}
                >
                  <div className="flex items-center justify-between p-3 md:p-4 gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button 
                        onClick={() => toggleHint(item.id)}
                        className={`mt-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-textMuted hover:text-accentAmber`}
                      >
                        <ChevronDown size={18} />
                      </button>
                      <p className="text-[13px] font-medium text-textPrimary leading-snug truncate md:whitespace-normal">
                        {item.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 bg-surfaceSubtle p-1 rounded-xl border border-borderBrand">
                      <CompactStatusButton 
                        disabled={!isAdmin}
                        active={currentStatus === 'compliant'} 
                        onClick={() => isAdmin && handleStatusChange(item.id, 'compliant')}
                        color="text-accentGreen"
                        bg="bg-accentGreen"
                        icon={CheckCircle2}
                        label="S"
                        fullLabel="Conforme"
                      />
                      <CompactStatusButton 
                        disabled={!isAdmin}
                        active={currentStatus === 'non_compliant'} 
                        onClick={() => isAdmin && handleStatusChange(item.id, 'non_compliant')}
                        color="text-accentRed"
                        bg="bg-accentRed"
                        icon={XCircle}
                        label="N"
                        fullLabel="N. Conforme"
                      />
                      <CompactStatusButton 
                        disabled={!isAdmin}
                        active={currentStatus === 'na'} 
                        onClick={() => isAdmin && handleStatusChange(item.id, 'na')}
                        color="text-textMuted"
                        bg="bg-textMuted"
                        icon={MinusCircle}
                        label="-"
                        fullLabel="N/A"
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-10 pb-4 pr-4">
                          <div className="bg-white/50 p-3 rounded-xl border border-dashed border-borderBrand text-[11px] text-textSecondary leading-relaxed italic">
                            <strong className="not-italic uppercase text-[9px] mr-2 text-textMuted tracking-wider">O que buscar:</strong>
                            {item.hint}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function CompactStatusButton({ active, onClick, color, bg, icon: Icon, label, fullLabel, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={fullLabel}
      className={`
        relative flex items-center justify-center w-8 h-8 md:w-auto md:px-3 md:h-8 rounded-lg text-[10px] font-bold transition-all
        ${active 
          ? `${bg} text-white shadow-md transform scale-105 z-10` 
          : `bg-white ${color} border border-borderBrand opacity-60 ${disabled ? '' : 'hover:border-current hover:bg-surfaceSubtle hover:opacity-100'}`}
        ${disabled && !active ? 'cursor-not-allowed opacity-40' : ''}
        ${disabled && active ? 'cursor-default' : ''}
      `}
    >
      <Icon size={16} className={active ? '' : 'opacity-70'} />
      <span className="hidden md:inline ml-1.5 uppercase tracking-tighter">{label}</span>
    </button>
  );
}
