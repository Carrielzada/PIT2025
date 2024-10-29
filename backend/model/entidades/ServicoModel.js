const Database = require("../database");

const database = new Database()

class ServicoModel {

    constructor(id, nome_servico){
        this.id = id;
        this.nome_servico = nome_servico;
    }

    async obterTodos(){
        const listaServicos = await database.ExecutaComando('select * from servico order by nome_servico asc');
        return listaServicos;
    }

    async obterPorId(id){
        const result = await database.ExecutaComando('select * from servico where id = ?', [id]);
        return result[0];
    }

    async adicionar(dadosServico){
        await database.ExecutaComandoNonQuery('insert into servico set ?', dadosServico);
    }

    async atualizar(id, dadosServico){
        await database.ExecutaComandoNonQuery('update servico set ? where id = ?', [dadosServico, id]);
    }

    async excluir(id){
        await database.ExecutaComandoNonQuery('delete from servico where id = ?', [id]);
    }

    async filtrar(termoBusca){
        const servico = await database.ExecutaComando('select * from cadastrotiposdeservico where nome_servico like ?', [`%${termoBusca}%`])
        return servico;
    }
}

module.exports = ServicoModel;