const Modal = {
    open(){
     //Abrir modal
    //Adicionar a class active ao modal
    //alert("Teste")
    document
    .querySelector('.modal-overlay')
    .classList
    .add('active')

    },
    
    close(){
     //Fechar modal
    //Remover a class active do modal

    document
    .querySelector('.modal-overlay')
    .classList
    .remove('active')
    }
}

const Storage ={
    get(){
         return JSON.parse(localStorage.getItem("smartFinance:transactions")) || []
    },
    set(transactions){
       localStorage.setItem("smartFinance:transactions", JSON.stringify(transactions))
    },
}

 const Transaction = {
       all: Storage.get(),

    add(transaction) {
            Transaction.all.push(transaction)

            App.reload()
    },
    
    remove(index){
    Transaction.all.splice(index, 1)

    App.reload()
    },

    incomes(){
            let income = 0;
            //somar as entradas
            //pegar todas as transações
            //para cada transação,
            Transaction.all.forEach(transaction=>{
            //se for maior que zero
            if (transaction.amount > 0){
            //somar a uma variavel e retorna a variavel
            income = income + transaction.amount;
            }
    
           })
            
            return income;
    },

    expenses(){
            let expense = 0;
            //somar as entradas
            //pegar todas as transações
            //para cada transação,
            Transaction.all.forEach(transaction=>{
            //se for menor que zero
            if (transaction.amount < 0){
            //somar a uma variavel e retorna a variavel
            expense = expense + transaction.amount;
            }
    
           })

            return expense
    },

    total(){
            //Entradas - Saídas
            return Transaction.incomes() + Transaction.expenses()
    } 
}

const DOM = {
   
   transactionsContainer: document.querySelector('#data-table tbody'),

   addTransaction(transaction, index){
       const tr = document.createElement('tr')
       tr.innerHTML = DOM.innerHTMLTransition(transaction, index)
       tr.dataset.index = index
       
       DOM.transactionsContainer.appendChild(tr)
       //console.log(tr.innerHTML)
   },

   innerHTMLTransition(transaction, index){
        const CSSclasss = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)
        
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclasss}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./img/ImgExcluir.svg" alt="Remover Transação">
            </td>  
             `
        return html
   },

   updateBalance(){
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency( Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency( Transaction.total())
   },

   clearTransactions(){
        DOM.transactionsContainer.innerHTML = ''
   }
}

const Utils = {
    //Pegar o Valor
    formatCurrency(value){
        //Verifica o Sinal
        const signal = Number(value) < 0 ? "-" : ""

        //Verificar e remover caracteres especiais
        value = String(value).replace(/\D/g,"")

        //Guardar o numero / por cem
        value = Number(value) / 100

        //Formata em dinhero
        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency:"BRL"
        })


        //console.log(signal + value)

        return signal + value
    },

    formatAmount(value){
        value = Number(value) * 100
        return value
    },

    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
}

const Form={
    description:document.querySelector('input#description'),
    amount:document.querySelector('input#amount'),
    date:document.querySelector('input#date'),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value, 
            date: Form.date.value,
        }
    },

    validateField(){
        const {description, amount, date} = Form.getValues();
        
        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error ("Por favor, preencha todos os campos")
        }
    },

    formatValues(){
        let {description, amount, date} = Form.getValues();
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        

        return{
            description,
            amount,
            date,
        }
    },

    saveTransaction(transaction){
      Transaction.add(transaction)
    },

    clearField(){
       Form.description.value = ""
       Form.amount.value = ""
       Form.date.value = ""
    },

    submit(event){
        event.preventDefault()

        try {
            
        //verificar se todas as informações foram preenchidas
        Form.validateField()

        //formatar os dados para salvar
        const transaction = Form.formatValues()

        //salvar
        Form.saveTransaction(transaction)

        //apagar os dados do formulario
        Form.clearField()
        
        //modal feche
        Modal.close()

        //Atualizar a Aplicação
        //App.reload()

        } catch (error) {
            alert(error.message)
        }
    }
}

const App ={
    init(){
    
       Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload(){
        DOM.clearTransactions()
        App.init()
    },
}

App.init()