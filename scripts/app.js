//CRIANDO A CLASS
class Despesas {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    //Metodo - Validar os dados coletados
    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] ==null){
                return false
            }
        }
        return true
    }
}
//**------------------------------------------------------- */

//CRIANDO A CLASSE BANCO DE DADOS
class Bd {
    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    //FUNÇÃO QUE VAI CRIAR O ID AUTOMATICO
    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    //FUNÇÃO QUE VAI GRAVAR OS DADOS
    gravar(d){
        //Coletando os dados do objeto "despesa" e convertendo em JSON
        let id =  this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    //FUNÇÃO QUE VAI RECUPERAR TODOS OS REGISTROS E LISTAR EM CONSULTA.HTML
    recuperarTodosRegistros(){

        //array de despesas
        let despesas = Array()

        let id = localStorage.getItem('id')

        //Recuperar todas as despesas cadastradas
        for(let i = 1; i <= id; i++){
            let despesa = JSON.parse(localStorage.getItem(i)) //Convertido de JSON, para literal

            //Testear se existem indises que foram remi=ovidos
            if(despesa === null){
                continue
            }
            despesa.id = i //Criando um novo elemento dentro do objeto
            despesas.push(despesa)
        }
        return despesas
    }

    //METODO DE PESQUISA
    pesquisar(despesa){
        let despesasFiltratas = Array()
        despesasFiltratas =  this.recuperarTodosRegistros()

        console.log(despesasFiltratas)

        //ano
        if(despesa.ano != ''){
            despesasFiltratas = despesasFiltratas.filter(d => d.ano == despesa.ano)
        }
        
        //mes
        if(despesa.mes != ''){
            despesasFiltratas = despesasFiltratas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if(despesa.dia != ''){
            despesasFiltratas = despesasFiltratas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if(despesa.tipo != ''){
            despesasFiltratas = despesasFiltratas.filter(d => d.tipo == despesa.tipo)
        }
        //descrição
        if(despesa.descricao != ''){
            despesasFiltratas = despesasFiltratas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if(despesa.valor != ''){
            despesasFiltratas = despesasFiltratas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltratas
    }

    //metodo que vai remover o elemento clicado
    removerItem(id){
        localStorage.removeItem(id)
        //alert(`O item ${id} esta sendo removido`)
    }
}
let dataBase = new Bd()

//**------------------------------------------------------- */


//FUNÇÃO CADASTRAR
function cadastrarDispesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    //Criando o objeto despesas que vai passar nos parametros os dados
    let despesa = new Despesas(
        ano.value, 
        mes.value, 
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value
    )
    
    //Se os dados coletados, forem validos
    if(despesa.validarDados()){
        dataBase.gravar(despesa)

        document.getElementById('modal_titulo').innerHTML = 'Registro cadastrado com sucesso'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Dispesa incluida com sucesso'
        document.getElementById('idBtn').innerHTML = "Voltar"
        document.getElementById('idBtn').className = 'btn btn-success'

        $('#modalRegistro').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    }else{
        //dialog de erro
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação. Verifique se todos os campos foram preenchidos'
        document.getElementById('idBtn').innerHTML = "Voltar e corrigir"
        document.getElementById('idBtn').className = 'btn btn-danger'

        $('#modalRegistro').modal('show')

    }
    
}

/**============================================================================ */
//CRIANDO A FUNÇÃO QUE VAI CARREGAR OS DADOS NA PAGINA DE CONSULTA

function carregaListaDespesas(despesas = Array(), filtro = false){
    if(despesas.length == 0 && filtro == false){
        despesas = dataBase.recuperarTodosRegistros()
    }
    

    //SELECIONANDO O ELEMENTO TBODY DA TABELA
    let listaDespesas = document.getElementById('listaDispesas')
    listaDespesas.innerHTML = ''

    //PERCORRER O ARRAY DESPESAS
    despesas.forEach(function(d){
        //console.log(d)
        
        //CRIAÇÃO DOS ELEMENTOS HTML
        let linha = listaDespesas.insertRow()
        //CRIANDO AS COLUNAS
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        //ajustar o tipo
        switch(d.tipo){
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = `${d.tipo}`
        linha.insertCell(2).innerHTML = `${d.descricao}`
        linha.insertCell(3).innerHTML = `${d.valor}`
        
        //Criando o botão de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){

            let resp = confirm('Tem certeza que vc quer excluir ?')
            if(resp === true){
                let iD = this.id.replace('id_despesa_', '')
                dataBase.removerItem(iD)
                window.location.reload()
            }

            
        }

        linha.insertCell(4).append(btn)

        console.log(d)
    })
}


//FUNÇÃO DE PESQUISA DA PAGINA CONSULTA
    function pesquisarDespesa(){
        let ano = document.getElementById('ano').value
        let mes = document.getElementById('mes').value
        let dia = document.getElementById('dia').value
        let tipo = document.getElementById('tipo').value
        let descricao = document.getElementById('descricao').value
        let valor = document.getElementById('valor').value
        
        let despesa = new Despesas(ano, mes, dia, tipo, descricao, valor)

        let despesas = dataBase.pesquisar(despesa)
        
        this.carregaListaDespesas(despesas, true)
        
    }