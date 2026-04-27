import { AlertOctagon, AlertTriangle, Info, CheckCircle } from 'lucide-react';

export const severityConfig = {
  critico: {
    icon: AlertOctagon,
    iconColor: "#DC2626",
    badgeBg: "#FEE2E2",
    badgeText: "#991B1B",
    badgeBorder: "#FECACA",
    label: "CRÍTICO"
  },
  alto: {
    icon: AlertTriangle,
    iconColor: "#D97706",
    badgeBg: "#FEF3C7",
    badgeText: "#92400E",
    badgeBorder: "#FDE68A",
    label: "ALTO"
  },
  medio: {
    icon: Info,
    iconColor: "#0284C7",
    badgeBg: "#E0F2FE",
    badgeText: "#075985",
    badgeBorder: "#BAE6FD",
    label: "MÉDIO"
  },
  informativo: {
    icon: CheckCircle,
    iconColor: "#16A34A",
    badgeBg: "#DCFCE7",
    badgeText: "#166534",
    badgeBorder: "#BBF7D0",
    label: "INFO"
  },
};

export const priorityConfig = {
  altissima: { bg: "#FEE2E2", text: "#991B1B", label: "PRIORIDADE ALTÍSSIMA" },
  alta: { bg: "#FEF3C7", text: "#92400E", label: "PRIORIDADE ALTA" },
  media: { bg: "#E0F2FE", text: "#075985", label: "PRIORIDADE MÉDIA" },
  baixa: { bg: "#DCFCE7", text: "#166534", label: "PRIORIDADE BAIXA" },
};

export const getRiskBadgeColor = (level) => {
  switch (level) {
    case 'extremo': return 'bg-accentRedLight text-accentRed border-accentRed/20';
    case 'alto': return 'bg-accentAmberLight text-accentAmber border-accentAmber/20';
    case 'medio': return 'bg-accentBlueLight text-accentBlue border-accentBlue/20';
    default: return 'bg-accentGreenLight text-accentGreen border-accentGreen/20';
  }
};