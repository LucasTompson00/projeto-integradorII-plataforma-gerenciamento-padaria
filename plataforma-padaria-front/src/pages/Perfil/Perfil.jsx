import { useEffect, useState } from "react";
import "./Perfil.css";

const STORAGE_KEY = "padaria.perfil.v1";

const RAIL = [
  { id: "dados", label: "Conta", icon: LayoutGrid },
  { id: "pedidos", label: "Pedidos", icon: ShoppingBag },
  { id: "fidelidade", label: "Fidelidade", icon: Award },
  { id: "preferencias", label: "Preferências", icon: SlidersHorizontal },
  { id: "seguranca", label: "Ajustes", icon: Settings },
];

const CHIPS = [
  { id: "dados", label: "Dados" },
  { id: "enderecos", label: "Endereços" },
  { id: "pedidos", label: "Pedidos" },
  { id: "fidelidade", label: "Fidelidade" },
  { id: "preferencias", label: "Preferências" },
  { id: "seguranca", label: "Segurança" },
];

const UNIDADES = ["Padaria Centro", "Padaria Pinheiros", "Padaria Jardins"];

const ALERGIAS = [
  { id: "gluten", label: "Glúten" },
  { id: "lactose", label: "Lactose" },
  { id: "oleaginosas", label: "Oleaginosas" },
  { id: "ovo", label: "Ovo" },
];

const PAGAMENTOS = [
  { id: "pix", label: "Pix" },
  { id: "cartao", label: "Cartão" },
  { id: "dinheiro", label: "Dinheiro" },
];

const RECEBIMENTO = [
  { id: "balcao", label: "Retirar no balcão" },
  { id: "entrega", label: "Entrega" },
];

const CATEGORIAS = [
  { id: "paes", label: "Pães artesanais" },
  { id: "confeitaria", label: "Confeitaria" },
  { id: "cafe", label: "Café" },
];

const STATUS = {
  preparo: "Em preparo",
  retirado: "Retirado",
  entregue: "Entregue",
};

const ORDERS = [
  {
    id: "1842",
    quando: "Hoje · 11:20",
    status: "preparo",
    total: 38.5,
    itens: [
      {
        nome: "Croissant Manteiga Francesa",
        qtd: 2,
        img: "/produtos/croissant.jpg",
      },
      { nome: "Café Coado Catuaí 200ml", qtd: 1, img: "/produtos/cafe.jpg" },
    ],
  },
  {
    id: "1830",
    quando: "Ontem · 18:05",
    status: "retirado",
    total: 26,
    itens: [
      { nome: "Pão de Campanha Levain 800g", qtd: 1, img: "/produtos/pao.jpg" },
    ],
  },
  {
    id: "1811",
    quando: "28 out · 09:40",
    status: "entregue",
    total: 35,
    itens: [
      { nome: "Torta Folhada de Maçã", qtd: 1, img: "/produtos/torta.jpg" },
      { nome: "Pain au Chocolat 70%", qtd: 1, img: "/produtos/pain.jpg" },
    ],
  },
  {
    id: "1794",
    quando: "21 out · 16:15",
    status: "entregue",
    total: 24,
    itens: [
      {
        nome: "Baguette Rústica Tradição",
        qtd: 2,
        img: "/produtos/baguette.jpg",
      },
    ],
  },
];

const DEFAULT_PROFILE = {
  nome: "Helena Duarte",
  email: "helena.duarte@email.com",
  telefone: "(11) 98821-4407",
  nascimento: "1994-06-18",
  cpf: "392.418.760-21",
  unidade: "Padaria Centro",
  desde: "2023-03-12",
  nivel: "Ouro",
  pontos: 860,
  selos: 6,
  notificacaoFornada: true,
  notificacaoPedido: true,
  marketing: false,
  alergias: ["oleaginosas"],
  pagamento: "pix",
  retirada: "balcao",
  categoria: "paes",
  obs: "Sem oleaginosas. O croissant pode ir com manteiga extra.",
  enderecos: [
    {
      id: "casa",
      rotulo: "Casa",
      linha: "Rua Harmonia, 418 · Vila Madalena",
      cidade: "São Paulo · SP",
      padrao: true,
    },
    {
      id: "trabalho",
      rotulo: "Trabalho",
      linha: "Av. Faria Lima, 2200 · 8º andar",
      cidade: "São Paulo · SP",
      padrao: false,
    },
  ],
  movimentos: [
    { id: "m1", titulo: "Croissant e café", quando: "Hoje", valor: 40 },
    { id: "m2", titulo: "Pão de campanha", quando: "Ontem", valor: 26 },
    { id: "m3", titulo: "Café cortesia", quando: "12 out", valor: -200 },
    {
      id: "m4",
      titulo: "Torta e pain au chocolat",
      quando: "28 out",
      valor: 35,
    },
  ],
};

function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function pts(value) {
  return value.toLocaleString("pt-BR");
}

function initials(nome) {
  const parts = String(nome || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "FG";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (parts[0][0] + last).toUpperCase();
}

function sinceLabel(iso) {
  const [year, month, day] = String(iso).split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date
    .toLocaleDateString("pt-BR", { month: "short", year: "numeric" })
    .replace(".", "");
}

function longDate(iso) {
  if (!iso) return "—";
  const [year, month, day] = String(iso).split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function todayISO() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function maskPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 3) return digits ? `(${digits}` : "";
  if (digits.length < 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length < 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function maskCpf(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      enderecos:
        Array.isArray(parsed.enderecos) && parsed.enderecos.length
          ? parsed.enderecos
          : DEFAULT_PROFILE.enderecos,
      alergias: Array.isArray(parsed.alergias)
        ? parsed.alergias
        : DEFAULT_PROFILE.alergias,
      movimentos: Array.isArray(parsed.movimentos)
        ? parsed.movimentos
        : DEFAULT_PROFILE.movimentos,
    };
  } catch {
    return null;
  }
}

function validate(draft) {
  const errors = {};
  const today = todayISO();
  if (!draft.nome || draft.nome.trim().length < 3)
    errors.nome = "Informe o nome completo.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email || ""))
    errors.email = "E-mail inválido.";
  if ((draft.telefone || "").replace(/\D/g, "").length < 10)
    errors.telefone = "Telefone incompleto.";
  if (
    !draft.nascimento ||
    draft.nascimento > today ||
    draft.nascimento < "1920-01-01"
  ) {
    errors.nascimento = "Confira a data de nascimento.";
  }
  if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(draft.cpf || ""))
    errors.cpf = "Use o formato 000.000.000-00.";
  if (!draft.unidade) errors.unidade = "Escolha a unidade.";
  return errors;
}

function itemLine(order) {
  return order.itens.map((item) => `${item.qtd}× ${item.nome}`).join(" · ");
}

function AddrIcon({ rotulo }) {
  const label = String(rotulo || "").toLowerCase();
  const Icon = label.includes("casa")
    ? House
    : label.includes("trabalho")
      ? Briefcase
      : MapPin;
  return <Icon size={18} aria-hidden="true" />;
}

function Field({ id, label, error, className, children }) {
  return (
    <label
      className={className ? `pf-field ${className}` : "pf-field"}
      htmlFor={id}
    >
      <span>{label}</span>
      {children}
      {error ? <small className="pf-error">{error}</small> : null}
    </label>
  );
}

export function PerfilPage() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [section, setSection] = useState("dados");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [fila, setFila] = useState("");
  const [adding, setAdding] = useState(false);
  const [novo, setNovo] = useState({ rotulo: "", linha: "", cidade: "" });
  const [addrErro, setAddrErro] = useState("");
  const [removerId, setRemoverId] = useState("");
  const [sessao, setSessao] = useState(true);
  const [confirmarSaida, setConfirmarSaida] = useState(false);
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [senhaErro, setSenhaErro] = useState("");
  const [senhaOk, setSenhaOk] = useState(false);

  useEffect(() => {
    const stored = loadProfile();
    if (stored) setProfile(stored);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!editing && !open) return;
    function onKey(event) {
      if (event.key !== "Escape") return;
      setOpen(false);
      setEditing(false);
      setErrors({});
      setDraft(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing, open]);

  const view = editing && draft ? { ...profile, ...draft } : profile;
  const nivel = view.pontos >= 1000 ? "Platina" : view.nivel;
  const ticket =
    ORDERS.reduce((sum, order) => sum + order.total, 0) / ORDERS.length;
  const progresso = Math.min(100, Math.round((profile.pontos / 1000) * 100));
  const pedidos =
    filtro === "todos"
      ? ORDERS
      : ORDERS.filter((order) => order.status === filtro);
  const primeiroNome = (profile.nome || "cliente").trim().split(/\s+/)[0];

  function choose(id) {
    setSessao(true);
    setSection(id);
    if (window.innerWidth < 761) setOpen(false);
  }

  function patch(partial, message) {
    setProfile((current) => {
      const next = { ...current, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    if (message) setToast(message);
  }

  function startEdit() {
    setDraft({
      nome: profile.nome,
      email: profile.email,
      telefone: profile.telefone,
      nascimento: profile.nascimento,
      cpf: profile.cpf,
      unidade: profile.unidade,
    });
    setErrors({});
    setEditing(true);
    setSection("dados");
  }

  function cancelEdit() {
    setEditing(false);
    setDraft(null);
    setErrors({});
  }

  function save() {
    if (!draft) return;
    const nextErrors = validate(draft);
    setErrors(nextErrors);
    const first = [
      "nome",
      "email",
      "telefone",
      "nascimento",
      "cpf",
      "unidade",
    ].find((key) => nextErrors[key]);
    if (first) {
      setSection("dados");
      const node = document.getElementById(`pf-${first}`);
      if (node) node.focus();
      return;
    }
    patch(
      {
        nome: draft.nome.trim(),
        email: draft.email.trim(),
        telefone: draft.telefone.trim(),
        nascimento: draft.nascimento,
        cpf: draft.cpf.trim(),
        unidade: draft.unidade,
      },
      "Dados do perfil atualizados",
    );
    setEditing(false);
    setDraft(null);
  }

  function setPadrao(id) {
    patch(
      {
        enderecos: profile.enderecos.map((item) => ({
          ...item,
          padrao: item.id === id,
        })),
      },
      "Endereço padrão atualizado",
    );
  }

  function removerEndereco(id) {
    if (profile.enderecos.length <= 1) {
      setToast("Mantenha ao menos um endereço");
      setRemoverId("");
      return;
    }
    let enderecos = profile.enderecos.filter((item) => item.id !== id);
    if (!enderecos.some((item) => item.padrao)) {
      enderecos = enderecos.map((item, index) => ({
        ...item,
        padrao: index === 0,
      }));
    }
    patch({ enderecos }, "Endereço removido");
    setRemoverId("");
  }

  function adicionarEndereco() {
    const rotulo = novo.rotulo.trim();
    const linha = novo.linha.trim();
    const cidade = novo.cidade.trim();
    if (!rotulo || !linha || !cidade) {
      setAddrErro("Preencha rótulo, rua e cidade.");
      return;
    }
    patch(
      {
        enderecos: [
          ...profile.enderecos,
          {
            id: `end-${Date.now()}`,
            rotulo,
            linha,
            cidade,
            padrao: profile.enderecos.length === 0,
          },
        ],
      },
      "Endereço adicionado",
    );
    setNovo({ rotulo: "", linha: "", cidade: "" });
    setAdding(false);
    setAddrErro("");
  }

  function repetir(order) {
    let selos = profile.selos + 1;
    let ganho = 20;
    let message = `Pedido #${order.id} na fila · +1 selo e +20 pts`;
    if (selos >= 8) {
      selos = 0;
      ganho = 80;
      message = "Cartão completo. Café coado liberado · +80 pts";
    }
    patch(
      {
        selos,
        pontos: profile.pontos + ganho,
        movimentos: [
          {
            id: `m-${Date.now()}`,
            titulo: `Repetir pedido #${order.id}`,
            quando: "Agora",
            valor: ganho,
          },
          ...profile.movimentos,
        ],
      },
      message,
    );
    setFila(`Pedido #${order.id} entrou na fila da fornada das 15:30.`);
  }

  function salvarSenha() {
    if (senha.length < 6) {
      setSenhaErro("Use pelo menos 6 caracteres.");
      setSenhaOk(false);
      return;
    }
    if (senha !== senha2) {
      setSenhaErro("As senhas não conferem.");
      setSenhaOk(false);
      return;
    }
    setSenha("");
    setSenha2("");
    setSenhaErro("");
    setSenhaOk(true);
    setToast("Senha atualizada nesta visita");
  }

  function sair() {
    setSessao(false);
    setEditing(false);
    setDraft(null);
    setErrors({});
    setConfirmarSaida(false);
    setOpen(false);
    setSection("dados");
  }

  const faltam = 8 - profile.selos;

  return (
    <div className={open ? "pf is-wide" : "pf"}>
      <a className="pf-skip" href="#pf-panel">
        Ir para o conteúdo
      </a>
      <header className="pf-top">
        <button
          type="button"
          className="pf-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <Menu size={22} />
        </button>
        <p className="pf-title">Sistema Gestão Padaria</p>
        <span />
      </header>

      <div className="pf-body">
        <button
          type="button"
          className="pf-scrim"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
        />
        <nav className="pf-rail" aria-label="Seções da conta">
          <div className="pf-brand">
            <span className="pf-logo" aria-hidden="true">
              FG
            </span>
            <span className="pf-rail-label">Padaria</span>
          </div>
          {RAIL.map((item) => {
            const Icon = item.icon;
            const current = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={current ? "pf-rail-btn is-on" : "pf-rail-btn"}
                aria-current={current ? "page" : undefined}
                aria-label={item.label}
                onClick={() => choose(item.id)}
              >
                <Icon size={20} strokeWidth={1.75} />
                <span className="pf-rail-label">{item.label}</span>
              </button>
            );
          })}
          <span className="pf-rail-gap" />
          <button
            type="button"
            className="pf-orb"
            aria-label={`Conta de ${view.nome}`}
            onClick={() => choose("dados")}
          >
            {initials(view.nome)}
          </button>
        </nav>

        <main className="pf-main">
          {!sessao ? (
            <section className="pf-panel pf-bye" id="pf-panel">
              <div className="pf-avatar" aria-hidden="true">
                {initials(profile.nome)}
              </div>
              <h1>Até a próxima fornada</h1>
              <p>
                Sessão encerrada neste aparelho. Seus dados continuam salvos
                aqui, {primeiroNome}.
              </p>
              <button
                type="button"
                className="pf-btn pf-btn-primary"
                onClick={() => setSessao(true)}
              >
                Entrar novamente
              </button>
            </section>
          ) : (
            <>
              <section className="pf-card pf-identity">
                <div className="pf-avatar" aria-hidden="true">
                  {initials(view.nome)}
                </div>
                <div>
                  <p className="pf-kicker">Sua conta</p>
                  <h1>{view.nome || "Sem nome"}</h1>
                  <p className="pf-sub">
                    <span className="pf-nivel">Cliente {nivel}</span>
                    {view.unidade} · desde {sinceLabel(view.desde)}
                  </p>
                </div>
                <div className="pf-actions">
                  {editing ? (
                    <button
                      type="button"
                      className="pf-btn pf-btn-ghost"
                      onClick={cancelEdit}
                    >
                      Cancelar
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="pf-btn pf-btn-primary"
                      onClick={startEdit}
                    >
                      Editar dados
                    </button>
                  )}
                </div>
              </section>

              <section className="pf-stats" aria-label="Resumo da conta">
                <article className="pf-stat">
                  <b>{ORDERS.length}</b>
                  <span>Pedidos recentes</span>
                </article>
                <article className="pf-stat">
                  <b>{money(ticket)}</b>
                  <span>Ticket médio</span>
                </article>
                <article className="pf-stat">
                  <b>{pts(profile.pontos)}</b>
                  <span>Pontos Fornada</span>
                </article>
                <article className="pf-stat">
                  <b>{profile.selos}/8</b>
                  <span>Selos do cartão</span>
                </article>
              </section>

              <section className="pf-fornada" aria-label="Fornada do dia">
                <span className="pf-fornada-ico" aria-hidden="true">
                  <Clock size={20} />
                </span>
                <div className="pf-fornada-copy">
                  <strong>Fornada #04 saindo às 15:30</strong>
                  <p>
                    {fila ||
                      "Pão Rústico de Figo & Ciabatta Tradicional dourando no forno de lastro"}
                  </p>
                </div>
                <span className="pf-pill">16 unidades</span>
              </section>

              <div
                className="pf-chips"
                role="tablist"
                aria-label="Seções do perfil"
              >
                {CHIPS.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    role="tab"
                    className={
                      section === chip.id ? "pf-chip is-on" : "pf-chip"
                    }
                    aria-selected={section === chip.id}
                    onClick={() => choose(chip.id)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              <div id="pf-panel">
                {section === "dados" && (
                  <section className="pf-panel" role="tabpanel">
                    <div className="pf-panel-head">
                      <h2>Dados pessoais</h2>
                    </div>
                    <p className="pf-lead">
                      Nome, contato e a unidade onde você costuma retirar.
                    </p>
                    {editing && draft ? (
                      <form
                        className="pf-form"
                        onSubmit={(event) => {
                          event.preventDefault();
                          save();
                        }}
                      >
                        <Field
                          id="pf-nome"
                          label="Nome completo"
                          error={errors.nome}
                          className="pf-field-span"
                        >
                          <input
                            id="pf-nome"
                            value={draft.nome}
                            autoComplete="name"
                            onChange={(event) =>
                              setDraft({ ...draft, nome: event.target.value })
                            }
                          />
                        </Field>
                        <Field
                          id="pf-email"
                          label="E-mail"
                          error={errors.email}
                        >
                          <input
                            id="pf-email"
                            type="email"
                            value={draft.email}
                            autoComplete="email"
                            onChange={(event) =>
                              setDraft({ ...draft, email: event.target.value })
                            }
                          />
                        </Field>
                        <Field
                          id="pf-telefone"
                          label="Telefone"
                          error={errors.telefone}
                        >
                          <input
                            id="pf-telefone"
                            inputMode="tel"
                            autoComplete="tel"
                            value={draft.telefone}
                            onChange={(event) =>
                              setDraft({
                                ...draft,
                                telefone: maskPhone(event.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field
                          id="pf-nascimento"
                          label="Nascimento"
                          error={errors.nascimento}
                        >
                          <input
                            id="pf-nascimento"
                            type="date"
                            max={todayISO()}
                            value={draft.nascimento}
                            onChange={(event) =>
                              setDraft({
                                ...draft,
                                nascimento: event.target.value,
                              })
                            }
                          />
                        </Field>
                        <Field id="pf-cpf" label="CPF" error={errors.cpf}>
                          <input
                            id="pf-cpf"
                            inputMode="numeric"
                            value={draft.cpf}
                            onChange={(event) =>
                              setDraft({
                                ...draft,
                                cpf: maskCpf(event.target.value),
                              })
                            }
                          />
                        </Field>
                        <Field
                          id="pf-unidade"
                          label="Unidade preferida"
                          error={errors.unidade}
                          className="pf-field-span"
                        >
                          <select
                            id="pf-unidade"
                            value={draft.unidade}
                            onChange={(event) =>
                              setDraft({
                                ...draft,
                                unidade: event.target.value,
                              })
                            }
                          >
                            {UNIDADES.map((unidade) => (
                              <option key={unidade} value={unidade}>
                                {unidade}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </form>
                    ) : (
                      <dl className="pf-specs">
                        <div>
                          <dt>Nome completo</dt>
                          <dd>{profile.nome}</dd>
                        </div>
                        <div>
                          <dt>E-mail</dt>
                          <dd>{profile.email}</dd>
                        </div>
                        <div>
                          <dt>Telefone</dt>
                          <dd>{profile.telefone}</dd>
                        </div>
                        <div>
                          <dt>Nascimento</dt>
                          <dd>{longDate(profile.nascimento)}</dd>
                        </div>
                        <div>
                          <dt>CPF</dt>
                          <dd>{profile.cpf}</dd>
                        </div>
                        <div>
                          <dt>Unidade preferida</dt>
                          <dd>{profile.unidade}</dd>
                        </div>
                      </dl>
                    )}
                  </section>
                )}

                {section === "enderecos" && (
                  <section className="pf-panel" role="tabpanel">
                    <div className="pf-panel-head">
                      <h2>Endereços</h2>
                      {!adding && (
                        <button
                          type="button"
                          className="pf-btn pf-btn-primary"
                          onClick={() => setAdding(true)}
                        >
                          <Plus size={16} /> Novo
                        </button>
                      )}
                    </div>
                    <p className="pf-lead">
                      O endereço padrão entra sozinho quando o pedido vai para
                      entrega.
                    </p>
                    <div className="pf-addr-list">
                      {profile.enderecos.map((endereco) => (
                        <article
                          key={endereco.id}
                          className={
                            endereco.padrao ? "pf-addr is-default" : "pf-addr"
                          }
                        >
                          <div className="pf-addr-top">
                            <span className="pf-addr-ico">
                              <AddrIcon rotulo={endereco.rotulo} />
                            </span>
                            <h3>{endereco.rotulo}</h3>
                          </div>
                          <p>
                            {endereco.linha}
                            <br />
                            {endereco.cidade}
                          </p>
                          {removerId === endereco.id ? (
                            <div className="pf-addr-actions">
                              <button
                                type="button"
                                className="pf-btn pf-btn-danger"
                                onClick={() => removerEndereco(endereco.id)}
                              >
                                Remover
                              </button>
                              <button
                                type="button"
                                className="pf-btn pf-btn-ghost"
                                onClick={() => setRemoverId("")}
                              >
                                Manter
                              </button>
                            </div>
                          ) : (
                            <div className="pf-addr-actions">
                              <button
                                type="button"
                                className={
                                  endereco.padrao
                                    ? "pf-btn pf-btn-gold"
                                    : "pf-btn pf-btn-ghost"
                                }
                                aria-pressed={endereco.padrao}
                                onClick={() => {
                                  if (!endereco.padrao) setPadrao(endereco.id);
                                }}
                              >
                                {endereco.padrao ? "Padrão" : "Tornar padrão"}
                              </button>
                              <button
                                type="button"
                                className="pf-btn pf-btn-ghost"
                                aria-label={`Remover ${endereco.rotulo}`}
                                onClick={() => setRemoverId(endereco.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </article>
                      ))}
                      {adding && (
                        <form
                          className="pf-addr pf-addr-new"
                          onSubmit={(event) => {
                            event.preventDefault();
                            adicionarEndereco();
                          }}
                        >
                          <h3>Novo endereço</h3>
                          <Field id="pf-rotulo" label="Rótulo">
                            <input
                              id="pf-rotulo"
                              value={novo.rotulo}
                              placeholder="Casa, trabalho…"
                              onChange={(event) =>
                                setNovo({ ...novo, rotulo: event.target.value })
                              }
                            />
                          </Field>
                          <Field id="pf-linha" label="Rua e número">
                            <input
                              id="pf-linha"
                              value={novo.linha}
                              autoComplete="street-address"
                              onChange={(event) =>
                                setNovo({ ...novo, linha: event.target.value })
                              }
                            />
                          </Field>
                          <Field id="pf-cidade" label="Cidade">
                            <input
                              id="pf-cidade"
                              value={novo.cidade}
                              autoComplete="address-level2"
                              onChange={(event) =>
                                setNovo({ ...novo, cidade: event.target.value })
                              }
                            />
                          </Field>
                          {addrErro ? (
                            <small className="pf-error">{addrErro}</small>
                          ) : null}
                          <div className="pf-inline-actions">
                            <button
                              type="submit"
                              className="pf-btn pf-btn-primary"
                            >
                              Salvar endereço
                            </button>
                            <button
                              type="button"
                              className="pf-btn pf-btn-ghost"
                              onClick={() => {
                                setAdding(false);
                                setAddrErro("");
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </section>
                )}

                {section === "pedidos" && (
                  <section className="pf-panel" role="tabpanel">
                    <div className="pf-panel-head">
                      <h2>Pedidos</h2>
                      <span className="pf-kicker">
                        {pedidos.length} nesta lista
                      </span>
                    </div>
                    <p className="pf-lead">
                      O que saiu do balcão e o que ainda está no forno.
                    </p>
                    <div
                      className="pf-chips pf-chips-gap"
                      aria-label="Filtrar pedidos"
                    >
                      {[
                        ["todos", "Todos"],
                        ["preparo", "Em preparo"],
                        ["retirado", "Retirados"],
                        ["entregue", "Entregues"],
                      ].map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          className={
                            filtro === id ? "pf-chip is-on" : "pf-chip"
                          }
                          onClick={() => setFiltro(id)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="pf-orders">
                      {pedidos.length === 0 ? (
                        <p className="pf-empty">Nenhum pedido neste status.</p>
                      ) : (
                        pedidos.map((order) => (
                          <article key={order.id} className="pf-order">
                            <div className="pf-thumbs">
                              {order.itens.slice(0, 2).map((item) => (
                                <img key={item.nome} src={item.img} alt="" />
                              ))}
                            </div>
                            <div className="pf-order-copy">
                              <h3>Pedido #{order.id}</h3>
                              <p>
                                {order.quando}
                                <br />
                                {itemLine(order)}
                              </p>
                            </div>
                            <div className="pf-order-side">
                              <span
                                className={`pf-status pf-status-${order.status}`}
                              >
                                {STATUS[order.status]}
                              </span>
                              <span className="pf-price">
                                {money(order.total)}
                              </span>
                              <button
                                type="button"
                                className="pf-btn pf-btn-ghost"
                                onClick={() => repetir(order)}
                              >
                                Repetir
                              </button>
                            </div>
                          </article>
                        ))
                      )}
                    </div>
                  </section>
                )}

                {section === "fidelidade" && (
                  <>
                    <section
                      className="pf-loyalty"
                      aria-label="Cartão fidelidade"
                    >
                      <div>
                        <p className="pf-kicker pf-kicker-light">
                          Cartão da casa
                        </p>
                        <h2>{profile.selos} de 8 selos</h2>
                        <p className="pf-lead">
                          {profile.selos === 0
                            ? "Selos renovados. O café coado volta a sair de graça quando o cartão fechar de novo."
                            : faltam === 1
                              ? "Falta um selo para o café coado por conta da casa."
                              : `Faltam ${faltam} selos para o café coado por conta da casa.`}
                        </p>
                      </div>
                      <div className="pf-stamps" aria-hidden="true">
                        {Array.from({ length: 8 }, (_, index) => {
                          const on = index < profile.selos;
                          const next =
                            index === profile.selos && profile.selos < 8;
                          const cls = on
                            ? "pf-stamp is-on"
                            : next
                              ? "pf-stamp is-next"
                              : "pf-stamp";
                          return (
                            <span key={index} className={cls}>
                              {on ? (
                                <Croissant size={16} aria-hidden="true" />
                              ) : null}
                            </span>
                          );
                        })}
                      </div>
                      <p className="pf-sr">
                        {profile.selos} de 8 selos preenchidos.
                      </p>
                      <div
                        className="pf-bar"
                        role="meter"
                        aria-valuemin={0}
                        aria-valuemax={1000}
                        aria-valuenow={Math.min(profile.pontos, 1000)}
                        aria-label="Progresso até o nível Platina"
                        style={{ "--pf-fill": `${progresso}%` }}
                      >
                        <span />
                      </div>
                      <p className="pf-meta-line">
                        {pts(Math.min(profile.pontos, 1000))} de 1.000 pts para
                        Platina
                        {profile.pontos >= 1000 ? " · nível alcançado" : ""}
                      </p>
                    </section>
                    <section className="pf-panel">
                      <h2>Movimento de pontos</h2>
                      <p className="pf-lead">
                        Saldo atual: {pts(profile.pontos)} pts. Os lançamentos
                        antigos ficam abaixo.
                      </p>
                      <ul className="pf-ledger">
                        {profile.movimentos.map((item) => (
                          <li key={item.id}>
                            <span>
                              {item.titulo}
                              <small>{item.quando}</small>
                            </span>
                            <strong
                              className={
                                item.valor < 0 ? "pf-minus" : "pf-plus"
                              }
                            >
                              {item.valor > 0 ? "+" : ""}
                              {pts(item.valor)}
                            </strong>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </>
                )}

                {section === "preferencias" && (
                  <section className="pf-panel" role="tabpanel">
                    <h2>Preferências</h2>
                    <p className="pf-lead">
                      Avisos da fornada, o que a cozinha precisa saber e como
                      você paga.
                    </p>
                    <div className="pf-switch-list">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={profile.notificacaoFornada}
                        className={
                          profile.notificacaoFornada
                            ? "pf-switch is-on"
                            : "pf-switch"
                        }
                        onClick={() =>
                          patch(
                            { notificacaoFornada: !profile.notificacaoFornada },
                            "Aviso de fornada atualizado",
                          )
                        }
                      >
                        <span>
                          <b>Avisar quando a fornada sair</b>
                          <small>
                            Um toque perto das 15:30, quando o pão deixa o
                            forno.
                          </small>
                        </span>
                        <span className="pf-knob" aria-hidden="true">
                          <i />
                        </span>
                      </button>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={profile.notificacaoPedido}
                        className={
                          profile.notificacaoPedido
                            ? "pf-switch is-on"
                            : "pf-switch"
                        }
                        onClick={() =>
                          patch(
                            { notificacaoPedido: !profile.notificacaoPedido },
                            "Aviso de pedido atualizado",
                          )
                        }
                      >
                        <span>
                          <b>Status do pedido</b>
                          <small>
                            Quando entrar em preparo, ficar pronto ou sair para
                            entrega.
                          </small>
                        </span>
                        <span className="pf-knob" aria-hidden="true">
                          <i />
                        </span>
                      </button>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={profile.marketing}
                        className={
                          profile.marketing ? "pf-switch is-on" : "pf-switch"
                        }
                        onClick={() =>
                          patch(
                            { marketing: !profile.marketing },
                            "Novidades da casa atualizadas",
                          )
                        }
                      >
                        <span>
                          <b>Novidades da casa</b>
                          <small>
                            Fornadas especiais e o pão da semana. Sem pressa.
                          </small>
                        </span>
                        <span className="pf-knob" aria-hidden="true">
                          <i />
                        </span>
                      </button>
                    </div>

                    <p className="pf-block-label" id="pf-alergias">
                      Alergênicos
                    </p>
                    <div
                      className="pf-seg"
                      role="group"
                      aria-labelledby="pf-alergias"
                    >
                      {ALERGIAS.map((item) => {
                        const on = profile.alergias.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            className={on ? "is-on" : undefined}
                            aria-pressed={on}
                            onClick={() => {
                              const alergias = on
                                ? profile.alergias.filter(
                                    (id) => id !== item.id,
                                  )
                                : [...profile.alergias, item.id];
                              patch({ alergias }, "Alergênicos atualizados");
                            }}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>

                    <p className="pf-block-label" id="pf-categoria">
                      O que você mais pede
                    </p>
                    <div
                      className="pf-seg"
                      role="radiogroup"
                      aria-labelledby="pf-categoria"
                    >
                      {CATEGORIAS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          role="radio"
                          className={
                            profile.categoria === item.id ? "is-on" : undefined
                          }
                          aria-checked={profile.categoria === item.id}
                          onClick={() =>
                            patch(
                              { categoria: item.id },
                              "Categoria favorita atualizada",
                            )
                          }
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <p className="pf-block-label" id="pf-pagamento">
                      Pagamento preferido
                    </p>
                    <div
                      className="pf-seg"
                      role="radiogroup"
                      aria-labelledby="pf-pagamento"
                    >
                      {PAGAMENTOS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          role="radio"
                          className={
                            profile.pagamento === item.id ? "is-on" : undefined
                          }
                          aria-checked={profile.pagamento === item.id}
                          onClick={() =>
                            patch(
                              { pagamento: item.id },
                              "Pagamento atualizado",
                            )
                          }
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <p className="pf-block-label" id="pf-retirada">
                      Como recebe
                    </p>
                    <div
                      className="pf-seg"
                      role="radiogroup"
                      aria-labelledby="pf-retirada"
                    >
                      {RECEBIMENTO.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          role="radio"
                          className={
                            profile.retirada === item.id ? "is-on" : undefined
                          }
                          aria-checked={profile.retirada === item.id}
                          onClick={() =>
                            patch(
                              { retirada: item.id },
                              "Forma de recebimento atualizada",
                            )
                          }
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    {profile.retirada === "entrega" ? (
                      <p className="pf-note">
                        A entrega usa o endereço marcado como padrão.
                      </p>
                    ) : null}

                    <Field
                      id="pf-obs"
                      label="Recado para a cozinha"
                      className="pf-field-span"
                    >
                      <textarea
                        id="pf-obs"
                        value={profile.obs}
                        onChange={(event) =>
                          setProfile({ ...profile, obs: event.target.value })
                        }
                        onBlur={(event) => {
                          const obs = event.target.value;
                          setProfile((current) => {
                            const next = { ...current, obs };
                            localStorage.setItem(
                              STORAGE_KEY,
                              JSON.stringify(next),
                            );
                            return next;
                          });
                        }}
                      />
                    </Field>
                  </section>
                )}

                {section === "seguranca" && (
                  <section className="pf-panel" role="tabpanel">
                    <h2>Segurança</h2>
                    <p className="pf-lead">
                      Troca de senha desta visita e a sessão aberta neste
                      aparelho.
                    </p>
                    <form
                      className="pf-form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        salvarSenha();
                      }}
                    >
                      <Field id="pf-senha" label="Nova senha" error={senhaErro}>
                        <div className="pf-secret">
                          <input
                            id="pf-senha"
                            type={verSenha ? "text" : "password"}
                            autoComplete="new-password"
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                          />
                          <button
                            type="button"
                            aria-label={
                              verSenha ? "Ocultar senha" : "Mostrar senha"
                            }
                            onClick={() => setVerSenha((value) => !value)}
                          >
                            {verSenha ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </Field>
                      <Field id="pf-senha2" label="Confirmar senha">
                        <input
                          id="pf-senha2"
                          type={verSenha ? "text" : "password"}
                          autoComplete="new-password"
                          value={senha2}
                          onChange={(event) => setSenha2(event.target.value)}
                        />
                      </Field>
                      <div className="pf-inline-actions pf-field-span">
                        <button type="submit" className="pf-btn pf-btn-primary">
                          Atualizar senha
                        </button>
                      </div>
                    </form>
                    {senhaOk ? (
                      <p className="pf-ok">Senha atualizada nesta visita.</p>
                    ) : null}
                    <p className="pf-note">
                      A senha nova vale enquanto esta visita estiver aberta. Ela
                      não fica gravada.
                    </p>

                    {confirmarSaida ? (
                      <div className="pf-confirm">
                        <p>Encerrar a sessão neste aparelho?</p>
                        <button
                          type="button"
                          className="pf-btn pf-btn-ghost"
                          onClick={() => setConfirmarSaida(false)}
                        >
                          Continuar
                        </button>
                        <button
                          type="button"
                          className="pf-btn pf-btn-danger"
                          onClick={sair}
                        >
                          Encerrar
                        </button>
                      </div>
                    ) : (
                      <div className="pf-session">
                        <p>
                          Sessão ativa
                          <small>Este navegador · {primeiroNome}</small>
                        </p>
                        <button
                          type="button"
                          className="pf-btn pf-btn-danger"
                          onClick={() => setConfirmarSaida(true)}
                        >
                          <LogOut size={16} /> Encerrar sessão
                        </button>
                      </div>
                    )}
                  </section>
                )}
              </div>

              {editing && (
                <div className="pf-savebar">
                  <span>Editando seus dados</span>
                  <button
                    type="button"
                    className="pf-btn pf-btn-ghost"
                    onClick={cancelEdit}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="pf-btn pf-btn-gold"
                    onClick={save}
                  >
                    Salvar
                  </button>
                </div>
              )}

              <p className="pf-foot">Alterações ficam salvas neste aparelho.</p>
            </>
          )}
        </main>
      </div>
      <p className="pf-toast" role="status">
        {toast}
      </p>
    </div>
  );
}
