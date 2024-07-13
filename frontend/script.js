document.addEventListener("DOMContentLoaded", function () {
    const API_SCP = "http://localhost:5000/api"; // Altere para o endereço desejado

    fetch(`${API_SCP}/Produto`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                document.getElementById("noProductsMessage").style.display = "block";
            } else {
                document.getElementById("noProductsMessage").style.display = "none";
                const productList = document.getElementById("productList");
                data.forEach(product => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${product.nome}</td>
                        <td>${product.descricao}</td>
                        <td>${product.preco.toFixed(2)}</td>
                        <td>${product.categoria}</td>
                        <td>${product.fornecedor}</td>
                        <td>${product.estoque}</td>
                        <td>
                            <button class="btn btn-warning btn-sm edit-button" 
                                data-id="${product.id}" 
                                data-toggle="modal" 
                                data-target="#editModal" 
                                data-nome="${product.nome}" 
                                data-descricao="${product.descricao}" 
                                data-preco="${product.preco}" 
                                data-categoria="${product.categoria}" 
                                data-fornecedor="${product.fornecedor}" 
                                data-estoque="${product.estoque}">Editar</button>
                            <button class="btn btn-danger btn-sm delete-button" data-id="${product.id}">Deletar</button>
                        </td>
                    `;
                    productList.appendChild(row);
                });
                addDeleteEventListeners();
                addEditEventListeners();
            }
        })
        .catch(error => {
            console.error("Erro ao carregar dados da API:", error);
        });

    const form = document.getElementById("productForm");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const nome = document.getElementById("nome").value;
        const descricao = document.getElementById("descricao").value;
        const preco = parseFloat(document.getElementById("preco").value);
        const categoria = document.getElementById('categoria').value;
        const fornecedor = document.getElementById('fornecedor').value;
        const estoque = document.getElementById('estoque').value;

        const produto = { nome, descricao, preco, categoria, fornecedor, estoque };

        fetch(`${API_SCP}/Produto`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produto)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao adicionar produto");
            }
            return response.json();
        })
        .then(product => {
            const productList = document.getElementById("productList");
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.nome}</td>
                <td>${product.descricao}</td>
                <td>${product.preco.toFixed(2)}</td>
                <td>${product.categoria}</td>
                <td>${product.fornecedor}</td>
                <td>${product.estoque}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-button" 
                        data-id="${product.id}" 
                        data-toggle="modal" 
                        data-target="#editModal" 
                        data-nome="${product.nome}" 
                        data-descricao="${product.descricao}" 
                        data-preco="${product.preco}" 
                        data-categoria="${product.categoria}" 
                        data-fornecedor="${product.fornecedor}" 
                        data-estoque="${product.estoque}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-button" data-id="${product.id}">Deletar</button>
                </td>
            `;
            productList.appendChild(row);
            document.getElementById("noProductsMessage").style.display = "none";
            form.reset();
            addDeleteEventListeners();
            addEditEventListeners();
        })
        .catch(error => {
            console.error("Erro ao adicionar produto:", error);
        });
    });

    function addDeleteEventListeners() {
        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                fetch(`${API_SCP}/Produto/${id}`, {
                    method: "DELETE"
                })
                .then(response => {
                    if (response.ok) {
                        this.closest("tr").remove();
                        if (document.getElementById("productList").children.length === 0) {
                            document.getElementById("noProductsMessage").style.display = "block";
                        }
                    } else {
                        throw new Error("Erro ao deletar produto");
                    }
                })
                .catch(error => {
                    console.error("Erro ao deletar produto:", error);
                });
            });
        });
    }

    function addEditEventListeners() {
        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                const nome = this.getAttribute("data-nome");
                const descricao = this.getAttribute("data-descricao");
                const preco = this.getAttribute("data-preco");
                const categoria = this.getAttribute("data-categoria");
                const fornecedor = this.getAttribute("data-fornecedor");
                const estoque = this.getAttribute("data-estoque");

                document.getElementById("editId").value = id;
                document.getElementById("editNome").value = nome;
                document.getElementById("editDescricao").value = descricao;
                document.getElementById("editPreco").value = parseFloat(preco).toFixed(2);
                document.getElementById("editCategoria").value = categoria;
                document.getElementById("editFornecedor").value = fornecedor;
                document.getElementById("editEstoque").value = estoque;
            });
        });

        document.getElementById("editForm").addEventListener("submit", function (event) {
            event.preventDefault();
            const id = document.getElementById("editId").value;
            const nome = document.getElementById("editNome").value;
            const descricao = document.getElementById("editDescricao").value;
            const preco = parseFloat(document.getElementById("editPreco").value);
            const categoria = document.getElementById("editCategoria").value;
            const fornecedor = document.getElementById("editFornecedor").value;
            const estoque = document.getElementById("editEstoque").value;

            const produto = { id, nome, descricao, preco, categoria, fornecedor, estoque };

            fetch(`${API_SCP}/Produto/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produto)
            })
            .then(response => {
                if (response.ok) {
                    $('#editModal').modal('hide');
                    location.reload();  // Reload the page to show the updated product
                } else {
                    throw new Error("Erro ao editar produto");
                }
            })
            .catch(error => {
                console.error("Erro ao editar produto:", error);
            });
        });
    }
});
