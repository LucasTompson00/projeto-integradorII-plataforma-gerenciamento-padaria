import { useMemo, useState } from "react";
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  X,
  Package,
  Info,
  House,
  ClipboardList,
  UserRound,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import "./Home.css";

const categoriasPadrao = ["Todos", "Pães", "Confeitaria", "Salgados"];

function Home({ produtosApi = [], onSair }) {
  const [sidebarRecolhida, setSidebarRecolhida] = useState(false);
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const produtos = Array.isArray(produtosApi) ? produtosApi : [];

  const categorias = useMemo(() => {
    const categoriasApi = [
      ...new Set(produtos.map((produto) => produto.categoria).filter(Boolean)),
    ];

    return categoriasApi.length > 0
      ? ["Todos", ...categoriasApi]
      : categoriasPadrao;
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const correspondeBusca =
        produto.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        produto.descricao?.toLowerCase().includes(busca.toLowerCase());

      const correspondeCategoria =
        categoriaSelecionada === "Todos" ||
        produto.categoria === categoriaSelecionada;

      return correspondeBusca && correspondeCategoria;
    });
  }, [produtos, busca, categoriaSelecionada]);

  const quantidadeCarrinho = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0,
  );

  const totalCarrinho = carrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0,
  );

  function formatarPreco(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function adicionarAoCarrinho(produto) {
    if (!Number.isFinite(produto.estoque) || produto.estoque <= 0) return;

    setCarrinho((carrinhoAtual) => {
      const itemExistente = carrinhoAtual.find(
        (item) => item.id === produto.id,
      );

      if (itemExistente) {
        if (itemExistente.quantidade >= produto.estoque) {
          return carrinhoAtual;
        }

        return carrinhoAtual.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item,
        );
      }

      return [...carrinhoAtual, { ...produto, quantidade: 1 }];
    });
  }

  function alterarQuantidade(id, variacao) {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual
        .map((item) => {
          if (item.id !== id) return item;

          const novaQuantidade = item.quantidade + variacao;

          if (
            variacao > 0 &&
            (!Number.isFinite(item.estoque) ||
              novaQuantidade > item.estoque)
          ) {
            return item;
          }

          return { ...item, quantidade: novaQuantidade };
        })
        .filter((item) => item.quantidade > 0),
    );
  }

  function abrirDetalhes(produto) {
    setProdutoSelecionado(produto);
  }

  function fecharDetalhes() {
    setProdutoSelecionado(null);
  }

  return (
    <div
      className={`home-layout ${sidebarRecolhida ? "sidebar-recolhida" : ""}`}
    >
      <aside className="home-sidebar">
        <button
          type="button"
          className="home-sidebar-toggle"
          onClick={() => setSidebarRecolhida(!sidebarRecolhida)}
          aria-label={
            sidebarRecolhida ? "Expandir menu" : "Recolher menu"
          }
          title={sidebarRecolhida ? "Expandir menu" : "Recolher menu"}
        >
          {sidebarRecolhida ? (
            <PanelLeftOpen size={21} />
          ) : (
            <PanelLeftClose size={21} />
          )}
        </button>

        <nav className="home-sidebar-navegacao">
          <NavLink
            to="/home"
            end
            className={({ isActive }) =>
              `home-sidebar-link ${isActive ? "ativo" : ""}`
            }
            title={sidebarRecolhida ? "Início" : undefined}
          >
            <House size={20} />
            <span>Início</span>
          </NavLink>

          <NavLink
            to="/pedidos"
            className={({ isActive }) =>
              `home-sidebar-link ${isActive ? "ativo" : ""}`
            }
            title={sidebarRecolhida ? "Meus pedidos" : undefined}
          >
            <ClipboardList size={20} />
            <span>Meus pedidos</span>
          </NavLink>

          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              `home-sidebar-link ${isActive ? "ativo" : ""}`
            }
            title={sidebarRecolhida ? "Meu perfil" : undefined}
          >
            <UserRound size={20} />
            <span>Meu perfil</span>
          </NavLink>
        </nav>

        <div className="home-sidebar-final">
          {onSair ? (
            <button
              type="button"
              className="home-sidebar-link home-sidebar-sair"
              onClick={onSair}
              title={sidebarRecolhida ? "Sair" : undefined}
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="home-sidebar-link home-sidebar-sair"
              title={sidebarRecolhida ? "Sair" : undefined}
            >
              <LogOut size={20} />
              <span>Sair</span>
            </Link>
          )}
        </div>
      </aside>

      <main className="home-page">
        <section className="home-fornada">
          <div className="home-fornada-texto">
            <span>PANIFICADORA GAVA</span>
            <h1>Seja bem-vindo!</h1>
            <p>Confira nosso catálogo e conheça nossos produtos.</p>
          </div>

          <div className="home-fornada-status">
            <span className="home-status-ponto" />
            Catálogo
          </div>
        </section>

        <section className="home-catalogo" id="catalogo">
          <div className="home-catalogo-topo">
            <div>
              <span className="home-etiqueta">PANIFICADORA GAVA</span>
              <h2>Faça seu pedido</h2>
              <p>
                Escolha seus favoritos e confira os produtos disponíveis.
              </p>
            </div>

            <button
              type="button"
              className="home-botao-carrinho"
              onClick={() => setCarrinhoAberto(true)}
            >
              <ShoppingBag size={19} />
              <span>Meu pedido</span>
              <span className="home-carrinho-contador">
                {quantidadeCarrinho}
              </span>
            </button>
          </div>

          <div className="home-ferramentas">
            <div className="home-busca">
              <Search size={18} />
              <input
                type="text"
                placeholder="O que você está procurando?"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
              />
              {busca && (
                <button
                  type="button"
                  onClick={() => setBusca("")}
                  aria-label="Limpar busca"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <div className="home-categorias">
              {categorias.map((categoria) => (
                <button
                  type="button"
                  key={categoria}
                  className={
                    categoriaSelecionada === categoria ? "selecionada" : ""
                  }
                  onClick={() => setCategoriaSelecionada(categoria)}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>

          <div className="home-listagem-topo">
            <h3>Nossos produtos</h3>
            <span>{produtosFiltrados.length} produtos encontrados</span>
          </div>

          {produtosFiltrados.length > 0 ? (
            <div className="home-grade-produtos">
              {produtosFiltrados.map((produto) => (
                <article
                  className="home-card-produto"
                  key={produto.id}
                  onClick={() => abrirDetalhes(produto)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      abrirDetalhes(produto);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver detalhes de ${produto.nome}`}
                >
                  <div className="home-card-imagem">
                    {produto.imagem ? (
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        loading="lazy"
                      />
                    ) : (
                      <Package size={35} />
                    )}
                    {produto.categoria && <span>{produto.categoria}</span>}
                  </div>

                  <div className="home-card-conteudo">
                    <h3>{produto.nome}</h3>
                    <p>{produto.descricao}</p>

                    <div className="home-card-disponibilidade">
                      {Number.isFinite(produto.estoque) ? (
                        produto.estoque > 0 ? (
                          <>
                            <span className="home-disponivel-ponto" />
                            {produto.estoque} disponíveis
                          </>
                        ) : (
                          <span className="home-esgotado">
                            Indisponível no momento
                          </span>
                        )
                      ) : (
                        <span>Consulte a disponibilidade</span>
                      )}
                    </div>

                    <div className="home-card-rodape">
                      <strong>{formatarPreco(produto.preco)}</strong>
                      <button
                        type="button"
                        disabled={
                          !Number.isFinite(produto.estoque) ||
                          produto.estoque <= 0
                        }
                        onClick={(event) => {
                          event.stopPropagation();
                          adicionarAoCarrinho(produto);
                        }}
                        aria-label={`Adicionar ${produto.nome} ao pedido`}
                      >
                        <Plus size={18} />
                        Adicionar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="home-sem-produtos">
              <Package size={35} />
              <h3>
                {busca
                  ? "Nenhum produto encontrado"
                  : "Catálogo em integração"}
              </h3>
              <p>
                {busca
                  ? "Tente buscar por outro nome ou categoria."
                  : "Os produtos serão exibidos aqui quando o catálogo estiver conectado à API."}
              </p>
              {busca && (
                <button
                  type="button"
                  onClick={() => {
                    setBusca("");
                    setCategoriaSelecionada("Todos");
                  }}
                >
                  Limpar filtros
                </button>
              )}
            </div>
          )}
        </section>

        {produtoSelecionado && (
          <div
            className="home-modal-fundo"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) fecharDetalhes();
            }}
          >
            <section
              className="home-produto-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="home-produto-titulo"
            >
              <button
                type="button"
                className="home-modal-fechar"
                onClick={fecharDetalhes}
                aria-label="Fechar detalhes"
              >
                <X size={21} />
              </button>

              {produtoSelecionado.imagem && (
                <img
                  className="home-produto-modal-imagem"
                  src={produtoSelecionado.imagem}
                  alt={produtoSelecionado.nome}
                />
              )}

              <div className="home-produto-modal-conteudo">
                <span className="home-etiqueta">
                  {produtoSelecionado.categoria}
                </span>
                <h2 id="home-produto-titulo">
                  {produtoSelecionado.nome}
                </h2>
                <p>{produtoSelecionado.descricao}</p>

                <div className="home-produto-modal-preco">
                  {formatarPreco(produtoSelecionado.preco)}
                </div>

                <div className="home-produto-disponibilidade">
                  <Package size={18} />
                  {Number.isFinite(produtoSelecionado.estoque)
                    ? produtoSelecionado.estoque > 0
                      ? `${produtoSelecionado.estoque} unidades disponíveis`
                      : "Produto indisponível"
                    : "Disponibilidade não informada"}
                </div>

                <div className="home-produto-info">
                  <Info size={16} />
                  A disponibilidade e as informações dos produtos são
                  fornecidas pelo sistema.
                </div>

                <button
                  type="button"
                  className="home-produto-adicionar"
                  onClick={() => adicionarAoCarrinho(produtoSelecionado)}
                  disabled={
                    !Number.isFinite(produtoSelecionado.estoque) ||
                    produtoSelecionado.estoque <= 0
                  }
                >
                  <ShoppingBag size={18} />
                  Adicionar ao pedido
                </button>
              </div>
            </section>
          </div>
        )}

        {carrinhoAberto && (
          <div
            className="home-modal-fundo"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setCarrinhoAberto(false);
              }
            }}
          >
            <section
              className="home-carrinho-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="home-carrinho-titulo"
            >
              <div className="home-carrinho-cabecalho">
                <div>
                  <span className="home-etiqueta">GAVA</span>
                  <h2 id="home-carrinho-titulo">Meu pedido</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setCarrinhoAberto(false)}
                  aria-label="Fechar pedido"
                >
                  <X size={21} />
                </button>
              </div>

              {carrinho.length === 0 ? (
                <div className="home-carrinho-vazio">
                  <ShoppingBag size={35} />
                  <h3>Seu pedido está vazio</h3>
                  <p>Adicione produtos do nosso catálogo.</p>
                  <button
                    type="button"
                    onClick={() => setCarrinhoAberto(false)}
                  >
                    Ver produtos
                  </button>
                </div>
              ) : (
                <>
                  <div className="home-carrinho-itens">
                    {carrinho.map((item) => (
                      <article className="home-carrinho-item" key={item.id}>
                        {item.imagem && (
                          <img src={item.imagem} alt={item.nome} />
                        )}

                        <div className="home-carrinho-info">
                          <h3>{item.nome}</h3>
                          <span>{formatarPreco(item.preco)}</span>

                          <div className="home-controle-quantidade">
                            <button
                              type="button"
                              onClick={() => alterarQuantidade(item.id, -1)}
                              aria-label={`Diminuir quantidade de ${item.nome}`}
                            >
                              <Minus size={14} />
                            </button>

                            <span>{item.quantidade}</span>

                            <button
                              type="button"
                              onClick={() => alterarQuantidade(item.id, 1)}
                              disabled={
                                !Number.isFinite(item.estoque) ||
                                item.quantidade >= item.estoque
                              }
                              aria-label={`Aumentar quantidade de ${item.nome}`}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <strong>
                          {formatarPreco(item.preco * item.quantidade)}
                        </strong>
                      </article>
                    ))}
                  </div>

                  <div className="home-carrinho-total">
                    <span>Total do pedido</span>
                    <strong>{formatarPreco(totalCarrinho)}</strong>
                  </div>

                  <p className="home-carrinho-aviso">
                    A finalização será disponibilizada após a integração com
                    a API de pedidos.
                  </p>
                </>
              )}

              <button
                type="button"
                className="home-carrinho-continuar"
                onClick={() => setCarrinhoAberto(false)}
              >
                Continuar comprando
              </button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;