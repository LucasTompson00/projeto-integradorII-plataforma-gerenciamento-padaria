import { useEffect, useState } from "react";
import {
  Award,
  Briefcase,
  Clock,
  Eye,
  EyeOff,
  House,
  LayoutGrid,
  LogOut,
  MapPin,
  Menu,
  Plus,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
  UserRound,
} from "lucide-react";
import "./Perfil.css";

const RAIL = [
  { id: "dados", label: "Conta", icon: LayoutGrid },
  { id: "pedidos", label: "Pedidos", icon: ShoppingBag },
  { id: "fidelidade", label: "Fidelidade", icon: Award },
  { id: "preferencias", label: "Preferências", icon: SlidersHorizontal },
  { id: "seguranca", label: "Ajustes", icon: Settings },
];

const SECTIONS = [
  { id: "dados", label: "Dados" },
  { id: "enderecos", label: "Endereços" },
  { id: "pedidos", label: "Pedidos" },
  { id: "fidelidade", label: "Fidelidade" },
  { id: "preferencias", label: "Preferências" },
  { id: "seguranca", label: "Segurança" },
];

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

const EMPTY_PROFILE = {
  nome: "",
  email: "",
  telefone: "",
  nascimento: "",
  cpf: "",
  unidade: "",
  desde: "",
  nivel: "",
  pontos: null,
  selos: null,
  notificacaoFornada: false,
  notificacaoPedido: false,
  marketing: false,
  alergias: [],
  pagamento: "",
  retirada: "",
  categoria: "",
  obs: "",
  enderecos: [],
  pedidos: [],
  movimentos: [],
};

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function numberFormat(value) {
  return Number(value || 0).toLocaleString("pt-BR");
}

function initials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "";

  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${parts[0][0]}${last}`.toUpperCase();
}

function formatDate(value) {
  if (!value) return "Não informado";

  const [year, month, day] = String(value).split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (Number.isNaN(date.getTime())) return "Não informado";

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
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);

  if (digits.length < 3) return digits ? `(${digits}` : "";
  if (digits.length < 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length < 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function maskCpf(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);

  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function validate(draft) {
  const errors = {};
  const today = todayISO();

  if (!draft.nome || draft.nome.trim().length < 3) {
    errors.nome = "Informe seu nome completo.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email || "")) {
    errors.email = "Informe um e-mail válido.";
  }

  if ((draft.telefone || "").replace(/\D/g, "").length < 10) {
    errors.telefone = "Informe um telefone válido.";
  }

  if (
    !draft.nascimento ||
    draft.nascimento > today ||
    draft.nascimento < "1920-01-01"
  ) {
    errors.nascimento = "Confira a data de nascimento.";
  }

  if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(draft.cpf || "")) {
    errors.cpf = "Use o formato 000.000.000-00.";
  }

  if (!draft.unidade || !draft.unidade.trim()) {
    errors.unidade = "Informe sua unidade preferida.";
  }

  return errors;
}

function Field({ id, label, error, className, children }) {
  return (
    <label className={className ? `pf-field ${className}` : "pf-field"} htmlFor={id}>
      <span>{label}</span>
      {children}
      {error ? <small className="pf-error">{error}</small> : null}
    </label>
  );
}

function AddressIcon({ label }) {
  const normalized = String(label || "").toLowerCase();
  const Icon = normalized.includes("casa")
    ? House
    : normalized.includes("trabalho")
      ? Briefcase
      : MapPin;

  return <Icon size={18} aria-hidden="true" />;
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="pf-empty-state">
      <span className="pf-empty-icon">
        <Icon size={25} aria-hidden="true" />
      </span>
      <h3 className="pf-empty-title">{title}</h3>
      <p className="pf-empty-description">{description}</p>
    </div>
  );
}

export default function Perfil() {
  const [profile, setProfile] = useState(() => ({
    ...EMPTY_PROFILE,
    alergias: [],
    enderecos: [],
    pedidos: [],
    movimentos: [],
  }));
  const [section, setSection] = useState("dados");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [adding, setAdding] = useState(false);
  const [novo, setNovo] = useState({ rotulo: "", linha: "", cidade: "" });
  const [addrErro, setAddrErro] = useState("");
  const [removerId, setRemoverId] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [verSenha, setVerSenha] = useState(false);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!editing && !open) return undefined;

    function onKey(event) {
      if (event.key !== "Escape") return;
      setOpen(false);
      setEditing(false);
      setErrors({});
      setDraft(null);
      setAdding(false);
      setRemoverId("");
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing, open]);

  const view = editing && draft ? { ...profile, ...draft } : profile;
  const displayName = view.nome?.trim() || "Minha conta";
  const firstName = profile.nome?.trim().split(/\s+/)[0] || "cliente";
  const orders = Array.isArray(profile.pedidos) ? profile.pedidos : [];
  const filteredOrders =
    filtro === "todos"
      ? orders
      : orders.filter((order) => order.status === filtro);
  const totalOrders = orders.length;
  const averageTicket = totalOrders
    ? orders.reduce((sum, order) => sum + Number(order.total || 0), 0) / totalOrders
    : null;

  function choose(id) {
    setSection(id);
    if (window.innerWidth < 761) setOpen(false);
  }

  function updateProfile(partial, message) {
    setProfile((current) => ({ ...current, ...partial }));
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

  function saveProfile() {
    if (!draft) return;

    const nextErrors = validate(draft);
    setErrors(nextErrors);

    const firstInvalid = [
      "nome",
      "email",
      "telefone",
      "nascimento",
      "cpf",
      "unidade",
    ].find((key) => nextErrors[key]);

    if (firstInvalid) {
      const node = document.getElementById(`pf-${firstInvalid}`);
      if (node) node.focus();
      return;
    }

    updateProfile(
      {
        nome: draft.nome.trim(),
        email: draft.email.trim(),
        telefone: draft.telefone.trim(),
        nascimento: draft.nascimento,
        cpf: draft.cpf.trim(),
        unidade: draft.unidade.trim(),
      },
      "Prévia atualizada. Nenhum dado foi enviado ao servidor.",
    );

    setEditing(false);
    setDraft(null);
  }

  function setDefaultAddress(id) {
    updateProfile(
      {
        enderecos: profile.enderecos.map((address) => ({
          ...address,
          padrao: address.id === id,
        })),
      },
      "Endereço padrão alterado nesta prévia.",
    );
  }

  function removeAddress(id) {
    if (profile.enderecos.length <= 1) {
      setToast("Adicione outro endereço antes de remover este.");
      setRemoverId("");
      return;
    }

    let addresses = profile.enderecos.filter((address) => address.id !== id);

    if (!addresses.some((address) => address.padrao)) {
      addresses = addresses.map((address, index) => ({
        ...address,
        padrao: index === 0,
      }));
    }

    updateProfile({ enderecos: addresses }, "Endereço removido desta prévia.");
    setRemoverId("");
  }

  function addAddress(event) {
    event.preventDefault();

    const rotulo = novo.rotulo.trim();
    const linha = novo.linha.trim();
    const cidade = novo.cidade.trim();

    if (!rotulo || !linha || !cidade) {
      setAddrErro("Preencha o rótulo, o endereço e a cidade.");
      return;
    }

    updateProfile(
      {
        enderecos: [
          ...profile.enderecos,
          {
            id: `address-${Date.now()}`,
            rotulo,
            linha,
            cidade,
            padrao: profile.enderecos.length === 0,
          },
        ],
      },
      "Endereço adicionado somente à prévia.",
    );

    setNovo({ rotulo: "", linha: "", cidade: "" });
    setAdding(false);
    setAddrErro("");
  }

  function updatePreference(key, value, message) {
    updateProfile({ [key]: value }, message);
  }

  function updateSelection(key, value, message) {
    updateProfile({ [key]: value }, message);
  }

  const ticketLabel = averageTicket === null ? "—" : money(averageTicket);
  const loyaltyPoints = profile.pontos === null ? "—" : numberFormat(profile.pontos);
  const stampLabel = profile.selos === null ? "—" : numberFormat(profile.selos);

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
            aria-label={profile.nome ? `Conta de ${profile.nome}` : "Minha conta"}
            onClick={() => choose("dados")}
          >
            {initials(profile.nome) || <UserRound size={17} />}
          </button>
        </nav>

        <main className="pf-main">
          <section className="pf-card pf-identity">
            <div className="pf-avatar" aria-hidden="true">
              {initials(view.nome) || <UserRound size={30} />}
            </div>
            <div>
              <p className="pf-kicker">Sua conta</p>
              <h1>{displayName}</h1>
              <p className="pf-sub">
                {view.unidade || "Unidade não informada"}
                {view.desde ? ` · cliente desde ${formatDate(view.desde)}` : ""}
              </p>
            </div>
            <div className="pf-actions">
              {editing ? (
                <button type="button" className="pf-btn pf-btn-ghost" onClick={cancelEdit}>
                  Cancelar
                </button>
              ) : (
                <button type="button" className="pf-btn pf-btn-primary" onClick={startEdit}>
                  Editar dados
                </button>
              )}
            </div>
          </section>

          <section className="pf-stats" aria-label="Resumo da conta">
            <article className="pf-stat">
              <b>{totalOrders || "—"}</b>
              <span>Pedidos recentes</span>
            </article>
            <article className="pf-stat">
              <b>{ticketLabel}</b>
              <span>Ticket médio</span>
            </article>
            <article className="pf-stat">
              <b>{loyaltyPoints}</b>
              <span>Pontos de fidelidade</span>
            </article>
            <article className="pf-stat">
              <b>{stampLabel}</b>
              <span>Selos do cartão</span>
            </article>
          </section>

          <section className="pf-fornada" aria-label="Informações da padaria">
            <span className="pf-fornada-ico" aria-hidden="true">
              <Clock size={20} />
            </span>
            <div className="pf-fornada-copy">
              <strong>Novidades da padaria</strong>
              <p>Informações sobre produtos e fornadas aparecerão aqui.</p>
            </div>
          </section>

          <div className="pf-chips" role="tablist" aria-label="Seções do perfil">
            {SECTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                className={section === item.id ? "pf-chip is-on" : "pf-chip"}
                aria-selected={section === item.id}
                onClick={() => choose(item.id)}
              >
                {item.label}
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
                  Consulte e atualize seus dados de contato e sua unidade preferida.
                </p>

                {editing && draft ? (
                  <form
                    className="pf-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      saveProfile();
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
                        placeholder="Digite seu nome completo"
                        onChange={(event) => setDraft({ ...draft, nome: event.target.value })}
                      />
                    </Field>

                    <Field id="pf-email" label="E-mail" error={errors.email}>
                      <input
                        id="pf-email"
                        type="email"
                        value={draft.email}
                        autoComplete="email"
                        placeholder="seuemail@exemplo.com"
                        onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                      />
                    </Field>

                    <Field id="pf-telefone" label="Telefone" error={errors.telefone}>
                      <input
                        id="pf-telefone"
                        inputMode="tel"
                        autoComplete="tel"
                        value={draft.telefone}
                        placeholder="(00) 00000-0000"
                        onChange={(event) =>
                          setDraft({ ...draft, telefone: maskPhone(event.target.value) })
                        }
                      />
                    </Field>

                    <Field id="pf-nascimento" label="Nascimento" error={errors.nascimento}>
                      <input
                        id="pf-nascimento"
                        type="date"
                        max={todayISO()}
                        value={draft.nascimento}
                        onChange={(event) =>
                          setDraft({ ...draft, nascimento: event.target.value })
                        }
                      />
                    </Field>

                    <Field id="pf-cpf" label="CPF" error={errors.cpf}>
                      <input
                        id="pf-cpf"
                        inputMode="numeric"
                        value={draft.cpf}
                        placeholder="000.000.000-00"
                        onChange={(event) =>
                          setDraft({ ...draft, cpf: maskCpf(event.target.value) })
                        }
                      />
                    </Field>

                    <Field
                      id="pf-unidade"
                      label="Unidade preferida"
                      error={errors.unidade}
                      className="pf-field-span"
                    >
                      <input
                        id="pf-unidade"
                        value={draft.unidade}
                        placeholder="Informe sua unidade preferida"
                        onChange={(event) => setDraft({ ...draft, unidade: event.target.value })}
                      />
                    </Field>
                  </form>
                ) : (
                  <dl className="pf-specs">
                    <div>
                      <dt>Nome completo</dt>
                      <dd>{profile.nome || "Não informado"}</dd>
                    </div>
                    <div>
                      <dt>E-mail</dt>
                      <dd>{profile.email || "Não informado"}</dd>
                    </div>
                    <div>
                      <dt>Telefone</dt>
                      <dd>{profile.telefone || "Não informado"}</dd>
                    </div>
                    <div>
                      <dt>Nascimento</dt>
                      <dd>{formatDate(profile.nascimento)}</dd>
                    </div>
                    <div>
                      <dt>CPF</dt>
                      <dd>{profile.cpf || "Não informado"}</dd>
                    </div>
                    <div>
                      <dt>Unidade preferida</dt>
                      <dd>{profile.unidade || "Não informada"}</dd>
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
                  Gerencie os endereços que poderão ser utilizados nos pedidos.
                </p>

                {profile.enderecos.length > 0 ? (
                  <div className="pf-addr-list">
                    {profile.enderecos.map((address) => (
                      <article
                        key={address.id}
                        className={address.padrao ? "pf-addr is-default" : "pf-addr"}
                      >
                        <div className="pf-addr-top">
                          <span className="pf-addr-ico">
                            <AddressIcon label={address.rotulo} />
                          </span>
                          <h3>{address.rotulo}</h3>
                        </div>
                        <p>
                          {address.linha}
                          <br />
                          {address.cidade}
                        </p>
                        {removerId === address.id ? (
                          <div className="pf-addr-actions">
                            <button
                              type="button"
                              className="pf-btn pf-btn-danger"
                              onClick={() => removeAddress(address.id)}
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
                                address.padrao ? "pf-btn pf-btn-gold" : "pf-btn pf-btn-ghost"
                              }
                              aria-pressed={address.padrao}
                              onClick={() => {
                                if (!address.padrao) setDefaultAddress(address.id);
                              }}
                            >
                              {address.padrao ? "Padrão" : "Tornar padrão"}
                            </button>
                            <button
                              type="button"
                              className="pf-btn pf-btn-ghost"
                              aria-label={`Remover ${address.rotulo}`}
                              onClick={() => setRemoverId(address.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={MapPin}
                    title="Nenhum endereço cadastrado"
                    description="Adicione um endereço para deixá-lo disponível quando a etapa de pedidos estiver integrada."
                  />
                )}

                {adding && (
                  <form className="pf-addr pf-addr-new" onSubmit={addAddress}>
                    <h3>Novo endereço</h3>
                    <Field id="pf-rotulo" label="Rótulo">
                      <input
                        id="pf-rotulo"
                        value={novo.rotulo}
                        placeholder="Casa, trabalho..."
                        onChange={(event) => setNovo({ ...novo, rotulo: event.target.value })}
                      />
                    </Field>
                    <Field id="pf-linha" label="Rua e número">
                      <input
                        id="pf-linha"
                        value={novo.linha}
                        autoComplete="street-address"
                        placeholder="Rua, número e complemento"
                        onChange={(event) => setNovo({ ...novo, linha: event.target.value })}
                      />
                    </Field>
                    <Field id="pf-cidade" label="Cidade">
                      <input
                        id="pf-cidade"
                        value={novo.cidade}
                        autoComplete="address-level2"
                        placeholder="Cidade e estado"
                        onChange={(event) => setNovo({ ...novo, cidade: event.target.value })}
                      />
                    </Field>
                    {addrErro ? <small className="pf-error">{addrErro}</small> : null}
                    <div className="pf-inline-actions">
                      <button type="submit" className="pf-btn pf-btn-primary">
                        Adicionar endereço
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
              </section>
            )}

            {section === "pedidos" && (
              <section className="pf-panel" role="tabpanel">
                <div className="pf-panel-head">
                  <h2>Pedidos</h2>
                  <span className="pf-kicker">{orders.length} registrados</span>
                </div>
                <p className="pf-lead">
                  Acompanhe seus pedidos e consulte o histórico de compras.
                </p>

                <div className="pf-chips pf-chips-gap" aria-label="Filtrar pedidos">
                  {[
                    ["todos", "Todos"],
                    ["preparo", "Em preparo"],
                    ["retirado", "Retirados"],
                    ["entregue", "Entregues"],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      className={filtro === id ? "pf-chip is-on" : "pf-chip"}
                      onClick={() => setFiltro(id)}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {filteredOrders.length > 0 ? (
                  <div className="pf-orders">
                    {filteredOrders.map((order) => (
                      <article key={order.id} className="pf-order">
                        <div className="pf-order-copy">
                          <h3>Pedido #{order.id}</h3>
                          <p>{order.data || "Data não informada"}</p>
                          <p>
                            {(order.itens || [])
                              .map((item) => `${item.quantidade || item.qtd || 1}× ${item.nome}`)
                              .join(" · ")}
                          </p>
                        </div>
                        <div className="pf-order-side">
                          <span className={`pf-status pf-status-${order.status || "preparo"}`}>
                            {order.statusLabel || order.status || "Status indisponível"}
                          </span>
                          <span className="pf-price">{money(order.total)}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={ShoppingBag}
                    title="Seus pedidos aparecerão aqui"
                    description="Quando o histórico de pedidos estiver conectado, você poderá acompanhar o andamento e consultar suas compras nesta seção."
                  />
                )}
              </section>
            )}

            {section === "fidelidade" && (
              <>
                <section className="pf-loyalty" aria-label="Programa de fidelidade">
                  <span className="pf-fornada-ico" aria-hidden="true">
                    <Award size={22} />
                  </span>
                  <div>
                    <p className="pf-kicker pf-kicker-light">Programa de fidelidade</p>
                    <h2>Suas vantagens</h2>
                    <p className="pf-lead">
                      Seus pontos, selos e benefícios serão apresentados aqui quando os dados estiverem disponíveis.
                    </p>
                  </div>
                </section>
                <section className="pf-panel">
                  <h2>Movimentação de pontos</h2>
                  <p className="pf-lead">
                    O histórico de pontos será exibido nesta área.
                  </p>
                  {profile.movimentos.length > 0 ? (
                    <ul className="pf-ledger">
                      {profile.movimentos.map((item) => (
                        <li key={item.id}>
                          <span>
                            {item.titulo}
                            <small>{item.quando}</small>
                          </span>
                          <strong className={item.valor < 0 ? "pf-minus" : "pf-plus"}>
                            {item.valor > 0 ? "+" : ""}
                            {numberFormat(item.valor)}
                          </strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState
                      icon={Award}
                      title="Nenhuma movimentação disponível"
                      description="Assim que o programa de fidelidade fornecer dados, seus lançamentos aparecerão aqui."
                    />
                  )}
                </section>
              </>
            )}

            {section === "preferencias" && (
              <section className="pf-panel" role="tabpanel">
                <h2>Preferências</h2>
                <p className="pf-lead">
                  Personalize os avisos e informe suas preferências de compra.
                </p>

                <div className="pf-switch-list">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={profile.notificacaoFornada}
                    className={profile.notificacaoFornada ? "pf-switch is-on" : "pf-switch"}
                    onClick={() =>
                      updatePreference(
                        "notificacaoFornada",
                        !profile.notificacaoFornada,
                        "Preferência alterada nesta prévia.",
                      )
                    }
                  >
                    <span>
                      <b>Avisos sobre fornadas</b>
                      <small>Receba novidades sobre produtos recém-preparados.</small>
                    </span>
                    <span className="pf-knob" aria-hidden="true">
                      <i />
                    </span>
                  </button>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={profile.notificacaoPedido}
                    className={profile.notificacaoPedido ? "pf-switch is-on" : "pf-switch"}
                    onClick={() =>
                      updatePreference(
                        "notificacaoPedido",
                        !profile.notificacaoPedido,
                        "Preferência alterada nesta prévia.",
                      )
                    }
                  >
                    <span>
                      <b>Atualizações de pedidos</b>
                      <small>Receba avisos quando houver mudanças no pedido.</small>
                    </span>
                    <span className="pf-knob" aria-hidden="true">
                      <i />
                    </span>
                  </button>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={profile.marketing}
                    className={profile.marketing ? "pf-switch is-on" : "pf-switch"}
                    onClick={() =>
                      updatePreference(
                        "marketing",
                        !profile.marketing,
                        "Preferência alterada nesta prévia.",
                      )
                    }
                  >
                    <span>
                      <b>Novidades e ofertas</b>
                      <small>Receba informações sobre novidades e campanhas.</small>
                    </span>
                    <span className="pf-knob" aria-hidden="true">
                      <i />
                    </span>
                  </button>
                </div>

                <p className="pf-block-label" id="pf-alergias">
                  Alergênicos
                </p>
                <div className="pf-seg" role="group" aria-labelledby="pf-alergias">
                  {ALERGIAS.map((item) => {
                    const active = profile.alergias.includes(item.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={active ? "is-on" : undefined}
                        aria-pressed={active}
                        onClick={() => {
                          const allergies = active
                            ? profile.alergias.filter((id) => id !== item.id)
                            : [...profile.alergias, item.id];
                          updateSelection(
                            "alergias",
                            allergies,
                            "Preferências alimentares alteradas nesta prévia.",
                          );
                        }}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                <p className="pf-block-label" id="pf-categoria">
                  Categoria favorita
                </p>
                <div className="pf-seg" role="radiogroup" aria-labelledby="pf-categoria">
                  {CATEGORIAS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      className={profile.categoria === item.id ? "is-on" : undefined}
                      aria-checked={profile.categoria === item.id}
                      onClick={() =>
                        updateSelection("categoria", item.id, "Preferência alterada nesta prévia.")
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <p className="pf-block-label" id="pf-pagamento">
                  Pagamento preferido
                </p>
                <div className="pf-seg" role="radiogroup" aria-labelledby="pf-pagamento">
                  {PAGAMENTOS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      className={profile.pagamento === item.id ? "is-on" : undefined}
                      aria-checked={profile.pagamento === item.id}
                      onClick={() =>
                        updateSelection("pagamento", item.id, "Preferência alterada nesta prévia.")
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <p className="pf-block-label" id="pf-retirada">
                  Forma de recebimento
                </p>
                <div className="pf-seg" role="radiogroup" aria-labelledby="pf-retirada">
                  {RECEBIMENTO.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      className={profile.retirada === item.id ? "is-on" : undefined}
                      aria-checked={profile.retirada === item.id}
                      onClick={() =>
                        updateSelection("retirada", item.id, "Preferência alterada nesta prévia.")
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {profile.retirada === "entrega" ? (
                  <p className="pf-note">A entrega utilizará o endereço marcado como padrão.</p>
                ) : null}

                <Field id="pf-obs" label="Observações para a equipe" className="pf-field-span">
                  <textarea
                    id="pf-obs"
                    value={profile.obs}
                    placeholder="Inclua alguma informação importante para o preparo dos seus pedidos."
                    onChange={(event) => setProfile({ ...profile, obs: event.target.value })}
                  />
                </Field>
              </section>
            )}

            {section === "seguranca" && (
              <section className="pf-panel" role="tabpanel">
                <h2>Segurança</h2>
                <p className="pf-lead">
                  As opções de senha e gerenciamento de sessão estarão disponíveis após a integração com o serviço de autenticação.
                </p>
                <div className="pf-security-placeholder">
                  <span className="pf-empty-icon">
                    <LogOut size={24} aria-hidden="true" />
                  </span>
                  <div>
                    <h3>Gerenciamento de conta</h3>
                    <p>
                      A alteração de senha e o encerramento de sessão ainda não estão conectados ao sistema de autenticação.
                    </p>
                  </div>
                </div>
                <form className="pf-form" onSubmit={(event) => event.preventDefault()}>
                  <Field id="pf-senha" label="Nova senha">
                    <div className="pf-secret">
                      <input
                        id="pf-senha"
                        type={verSenha ? "text" : "password"}
                        value={senha}
                        disabled
                        placeholder="Disponível após integração"
                        autoComplete="new-password"
                        onChange={(event) => setSenha(event.target.value)}
                      />
                      <button
                        type="button"
                        aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"}
                        disabled
                        onClick={() => setVerSenha((value) => !value)}
                      >
                        {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </Field>
                  <Field id="pf-senha2" label="Confirmar senha">
                    <input
                      id="pf-senha2"
                      type="password"
                      value={senha2}
                      disabled
                      placeholder="Disponível após integração"
                      autoComplete="new-password"
                      onChange={(event) => setSenha2(event.target.value)}
                    />
                  </Field>
                  <div className="pf-inline-actions pf-field-span">
                    <button type="button" className="pf-btn pf-btn-primary" disabled>
                      Atualizar senha
                    </button>
                  </div>
                </form>
              </section>
            )}
          </div>

          {editing && (
            <div className="pf-savebar">
              <span>Editando seus dados</span>
              <button type="button" className="pf-btn pf-btn-ghost" onClick={cancelEdit}>
                Cancelar
              </button>
              <button type="button" className="pf-btn pf-btn-gold" onClick={saveProfile}>
                Salvar prévia
              </button>
            </div>
          )}

          {import.meta.env.DEV ? (
            <p className="pf-foot">
              Ambiente de desenvolvimento: as alterações ficam apenas nesta tela e não são enviadas ao servidor.
            </p>
          ) : null}
        </main>
      </div>

      <p className="pf-toast" role="status" aria-live="polite">
        {toast}
      </p>
    </div>
  );
}
