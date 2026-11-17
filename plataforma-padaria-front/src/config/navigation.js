import { ClipboardList, House, Package, ShoppingBag, UserRound } from "lucide-react";


export const navigationByArea = {
  cliente: [
    {
      label: "Início",
      to: "/home",
      icon: House,
      end: true,
    },
    {
      label: "Meus pedidos",
      to: "/pedidos",
      icon: ClipboardList,
      disabled: true,
      disabledReason: "Página em desenvolvimento",
    },
    {
      label: "Meu perfil",
      to: "/perfil",
      icon: UserRound,
    },
  ],
  admin: [
    {
      label: "Pedidos",
      to: "/admin/pedidos",
      icon: ShoppingBag,
      disabled: true,
      disabledReason: "Página em desenvolvimento",
    },
    {
      label: "Produtos",
      to: "/admin/produtos",
      icon: Package,
      disabled: true,
      disabledReason: "Página em desenvolvimento",
    },
    {
      label: "Estoque",
      to: "/admin/estoque",
      icon: Package,
      disabled: true,
      disabledReason: "Página em desenvolvimento",
    },
  ],
};
