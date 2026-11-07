
import './Home.css';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const produtosIniciais = [
    { id: 1, nome: 'Pão de Campanha Levain 800g', categoria: 'Pães Artesanais', quantidade: 18, minimo: 10, preco: 26 },
    { id: 2, nome: 'Croissant Francês', categoria: 'Confeitaria', quantidade: 5, minimo: 10, preco: 12 },
    { id: 3, nome: 'Pão de Queijo', categoria: 'Pães Artesanais', quantidade: 32, minimo: 10, preco: 6 },
    { id: 4, nome: 'Bolo de Chocolate', categoria: 'Confeitaria', quantidade: 0, minimo: 5, preco: 18 },
    { id: 5, nome: 'Café Expresso', categoria: 'Cafés', quantidade: 15, minimo: 8, preco: 5 },
    { id: 6, nome: 'Pão Italiano', categoria: 'Pães Artesanais', quantidade: 3, minimo: 8, preco: 15 }
];

function Home() {
    const [menuAberto, setMenuAberto] = useState(true);
    const [produtos, setProdutos] = useState(produtosIniciais);
    const [busca, setBusca] = useState('');
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');
    const [modalAberto, setModalAberto] = useState(false);
    const [produtoReposicao, setProdutoReposicao] = useState(null);
    const [quantidadeAdicionar, setQuantidadeAdicionar] = useState('');

    // Estado do modal de remoção
    const [produtoParaRemover, setProdutoParaRemover] = useState(null);

    const [formulario, setFormulario] = useState({
        nome: '',
        categoria: 'Pães Artesanais',
        quantidade: '',
        minimo: '',
        preco: ''
    });

    const totalProdutos = produtos.length;

    const estoqueBaixo = produtos.filter(
        produto => produto.quantidade > 0 && produto.quantidade <= produto.minimo
    ).length;

    const semEstoque = produtos.filter(
        produto => produto.quantidade === 0
    ).length;

    const produtosFiltrados = useMemo(() => {
        return produtos.filter(produto => {
            const correspondeBusca = produto.nome.toLowerCase().includes(busca.toLowerCase());

            const correspondeCategoria =
                categoriaSelecionada === 'Todos' ||
                produto.categoria === categoriaSelecionada;

            return correspondeBusca && correspondeCategoria;
        });
    }, [produtos, busca, categoriaSelecionada]);

    function abrirCadastro() {
        setFormulario({
            nome: '',
            categoria: 'Pães Artesanais',
            quantidade: '',
            minimo: '',
            preco: ''
        });

        setModalAberto(true);
    }

    function salvarProduto(event) {
        event.preventDefault();

        const novoProduto = {
            id: Date.now(),
            nome: formulario.nome.trim(),
            categoria: formulario.categoria,
            quantidade: Number(formulario.quantidade),
            minimo: Number(formulario.minimo),
            preco: Number(formulario.preco)
        };

        setProdutos(produtosAtuais => [...produtosAtuais, novoProduto]);
        setModalAberto(false);
    }

    function adicionarEstoque(event) {
        event.preventDefault();

        const quantidade = Number(quantidadeAdicionar);

        if (!produtoReposicao || quantidade <= 0 || !Number.isInteger(quantidade)) {
            return;
        }

        setProdutos(produtosAtuais =>
            produtosAtuais.map(produto =>
                produto.id === produtoReposicao.id
                    ? { ...produto, quantidade: produto.quantidade + quantidade }
                    : produto
            )
        );

        setProdutoReposicao(null);
        setQuantidadeAdicionar('');
    }

    // Remove o produto após a confirmação no modal personalizado
    function removerProduto() {
        if (!produtoParaRemover) return;

        setProdutos(produtosAtuais =>
            produtosAtuais.filter(
                produto => produto.id !== produtoParaRemover.id
            )
        );

        setProdutoParaRemover(null);
    }

    function obterStatus(produto) {
        if (produto.quantidade === 0) {
            return { texto: 'Sem estoque', classe: 'sem-estoque' };
        }

        if (produto.quantidade <= produto.minimo) {
            return { texto: 'Estoque baixo', classe: 'estoque-baixo' };
        }

        return { texto: 'Disponível', classe: 'disponivel' };
    }

    return (
        <div className={`home-container ${menuAberto ? 'menu-aberto' : 'menu-fechado'}`}>

            <header className="home-header">
                <button
                    className="botao-menu"
                    onClick={() => setMenuAberto(!menuAberto)}
                    aria-label="Abrir ou fechar menu"
                >
                    <i className="fa-solid fa-bars"></i>
                </button>

                <h1>Panificadora GAVA</h1>

                <div className="header-actions">
                    <span className="usuario-header">
                        <i className="fa-solid fa-user"></i>
                        Administrador
                    </span>

                    <Link to="/login" className="login-link">
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Sair</span>
                    </Link>
                </div>
            </header>

            <aside className="sidebar">
                <nav>
                    <a href="#inicio" className="active" title="Estoque">
                        <i className="fa-solid fa-boxes-stacked"></i>
                        <span>Estoque</span>
                    </a>

                    <a href="#produtos" title="Produtos">
                        <i className="fa-solid fa-bread-slice"></i>
                        <span>Produtos</span>
                    </a>

                    <a href="#categorias" title="Categorias">
                        <i className="fa-solid fa-list"></i>
                        <span>Categorias</span>
                    </a>

                    <a href="#resumo" title="Resumo">
                        <i className="fa-solid fa-chart-column"></i>
                        <span>Resumo</span>
                    </a>

                    <a href="/pedidos" title="Pedidos">
                        <i className="fa-solid fa-clipboard-list"></i>
                        <span>Pedidos</span>
                    </a>

                    <a href="/conta" title="Minha conta">
                        <i className="fa-solid fa-user"></i>
                        <span>Minha conta</span>
                    </a>
                </nav>
            </aside>

            <main className="home-content" id="inicio">

                <section className="titulo-pagina">
                    <div>
                        <span className="subtitulo">GERENCIAMENTO</span>
                        <h2>Controle de Estoque</h2>
                        <p>Acompanhe e gerencie os produtos da sua padaria.</p>
                    </div>

                    <button className="botao-adicionar" onClick={abrirCadastro}>
                        <i className="fa-solid fa-plus"></i>
                        Adicionar produto
                    </button>
                </section>

                <section className="resumo-estoque" id="resumo">

                    <article className="card-resumo">
                        <div className="icone-resumo azul">
                            <i className="fa-solid fa-boxes-stacked"></i>
                        </div>
                        <div>
                            <p>Total de produtos</p>
                            <h3>{totalProdutos}</h3>
                        </div>
                    </article>

                    <article className="card-resumo">
                        <div className="icone-resumo amarelo">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <div>
                            <p>Estoque baixo</p>
                            <h3>{estoqueBaixo}</h3>
                        </div>
                    </article>

                    <article className="card-resumo">
                        <div className="icone-resumo vermelho">
                            <i className="fa-solid fa-circle-xmark"></i>
                        </div>
                        <div>
                            <p>Sem estoque</p>
                            <h3>{semEstoque}</h3>
                        </div>
                    </article>

                </section>

                <section className="produtos-section" id="produtos">

                    <div className="cabecalho-produtos">
                        <div>
                            <h2>Produtos cadastrados</h2>
                            <p>Consulte e atualize os produtos do estoque.</p>
                        </div>

                        <div className="campo-busca">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                                type="text"
                                placeholder="Buscar produto..."
                                value={busca}
                                onChange={event => setBusca(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filtros-categorias" id="categorias">
                        {['Todos', 'Pães Artesanais', 'Confeitaria', 'Cafés'].map(categoria => (
                            <button
                                key={categoria}
                                className={categoriaSelecionada === categoria ? 'selected' : ''}
                                onClick={() => setCategoriaSelecionada(categoria)}
                            >
                                {categoria}
                            </button>
                        ))}
                    </div>

                    <div className="tabela-container">
                        <table className="tabela-estoque">
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Categoria</th>
                                    <th>Quantidade</th>
                                    <th>Preço</th>
                                    <th>Situação</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {produtosFiltrados.map(produto => {
                                    const status = obterStatus(produto);

                                    return (
                                        <tr key={produto.id}>
                                            <td className="nome-produto">{produto.nome}</td>
                                            <td>{produto.categoria}</td>
                                            <td>{produto.quantidade} un.</td>
                                            <td>
                                                R$ {produto.preco.toFixed(2).replace('.', ',')}
                                            </td>
                                            <td>
                                                <span className={`status-produto ${status.classe}`}>
                                                    {status.texto}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="acoes-estoque">
                                                    <button
                                                        className="botao-adicionar-estoque"
                                                        onClick={() => {
                                                            setProdutoReposicao(produto);
                                                            setQuantidadeAdicionar('');
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-plus"></i>
                                                        Adicionar
                                                    </button>

                                                    <button
                                                        className="botao-remover-estoque"
                                                        onClick={() => setProdutoParaRemover(produto)}
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                        Remover
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {produtosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="nenhum-produto">
                                            Nenhum produto encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <p className="contador-produtos">
                        Exibindo {produtosFiltrados.length} de {totalProdutos} produtos
                    </p>

                </section>

            </main>

            {/* Modal de cadastro */}
            {modalAberto && (
                <div className="modal-fundo">
                    <div className="modal-produto">
                        <div className="modal-cabecalho">
                            <h2>Novo produto</h2>

                            <button
                                type="button"
                                onClick={() => setModalAberto(false)}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <form onSubmit={salvarProduto}>
                            <label>Nome do produto</label>
                            <input
                                type="text"
                                required
                                value={formulario.nome}
                                onChange={event => setFormulario({ ...formulario, nome: event.target.value })}
                                placeholder="Digite o nome do produto"
                            />

                            <label>Categoria</label>
                            <select
                                value={formulario.categoria}
                                onChange={event => setFormulario({ ...formulario, categoria: event.target.value })}
                            >
                                <option>Pães Artesanais</option>
                                <option>Confeitaria</option>
                                <option>Cafés</option>
                            </select>

                            <div className="campos-duplos">
                                <div>
                                    <label>Quantidade</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={formulario.quantidade}
                                        onChange={event => setFormulario({ ...formulario, quantidade: event.target.value })}
                                    />
                                </div>

                                <div>
                                    <label>Estoque mínimo</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={formulario.minimo}
                                        onChange={event => setFormulario({ ...formulario, minimo: event.target.value })}
                                    />
                                </div>
                            </div>

                            <label>Preço (R$)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                value={formulario.preco}
                                onChange={event => setFormulario({ ...formulario, preco: event.target.value })}
                            />

                            <div className="modal-acoes">
                                <button
                                    type="button"
                                    className="botao-cancelar"
                                    onClick={() => setModalAberto(false)}
                                >
                                    Cancelar
                                </button>

                                <button type="submit" className="botao-salvar">
                                    Salvar produto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de reposição de estoque */}
            {produtoReposicao && (
                <div className="modal-fundo">
                    <div className="modal-produto">
                        <div className="modal-cabecalho">
                            <h2>Adicionar ao estoque</h2>

                            <button
                                type="button"
                                onClick={() => setProdutoReposicao(null)}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <form onSubmit={adicionarEstoque}>
                            <p className="produto-reposicao-nome">
                                Produto: <strong>{produtoReposicao.nome}</strong>
                            </p>

                            <p className="estoque-atual">
                                Quantidade atual: {produtoReposicao.quantidade} unidades
                            </p>

                            <label>Quantidade a adicionar</label>

                            <input
                                type="number"
                                min="1"
                                step="1"
                                required
                                autoFocus
                                value={quantidadeAdicionar}
                                onChange={event => setQuantidadeAdicionar(event.target.value)}
                                placeholder="Digite a quantidade"
                            />

                            <div className="modal-acoes">
                                <button
                                    type="button"
                                    className="botao-cancelar"
                                    onClick={() => setProdutoReposicao(null)}
                                >
                                    Cancelar
                                </button>

                                <button type="submit" className="botao-salvar">
                                    Confirmar entrada
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal personalizado de remoção */}
            {produtoParaRemover && (
                <div className="modal-fundo">
                    <div className="modal-produto">
                        <div className="modal-cabecalho">
                            <h2>Remover produto</h2>

                            <button
                                type="button"
                                onClick={() => setProdutoParaRemover(null)}
                                aria-label="Fechar"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <p className="mensagem-remocao">
                            Tem certeza que deseja remover{' '}
                            <strong>{produtoParaRemover.nome}</strong>?
                        </p>

                        <div className="modal-acoes">
                            <button
                                type="button"
                                className="botao-cancelar"
                                onClick={() => setProdutoParaRemover(null)}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="botao-remover-confirmar"
                                onClick={removerProduto}
                            >
                                Remover produto
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Home;
