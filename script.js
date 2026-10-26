// Aluno(a): Bruno Bernardelli Fraudio

const campoAno = document.getElementById('ano')
const tabela = document.getElementById('tabelaFeriados')
const mensagem = document.getElementById('mensagem')
const total = document.getElementById('total')
const proximo = document.getElementById('proximo')

const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

campoAno.value = new Date().getFullYear()

function consultarFeriados() {
    const ano = campoAno.value
    tabela.innerHTML = ''
    mensagem.innerHTML = ''
    mensagem.className = ''
    total.innerHTML = ''

    fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error('Ano inválido')
            }
            return resposta.json()
        })
        .then(feriados => {
            console.log(feriados)

            total.innerHTML = `${ano} tem <strong>${feriados.length}</strong> feriados nacionais`

            feriados.forEach(feriado => {
                const data = new Date(feriado.date + 'T12:00:00')

                const dataBrasil = data.toLocaleDateString('pt-BR')
                const numeroDia = data.getDay()
                const diaSemana = diasDaSemana[numeroDia]

                let classe = 'dia-semana'
                if (numeroDia == 0 || numeroDia == 6) {
                    classe = 'fim-de-semana'
                }

                tabela.innerHTML += `
                    <tr class="${classe}">
                        <td>${dataBrasil}</td>
                        <td><span class="tag">${diaSemana}</span></td>
                        <td>${feriado.name}</td>
                    </tr>`
            })
        })
        .catch(erro => {
            console.log(erro)
            mensagem.className = 'erro'
            mensagem.innerHTML = `Não foi possível encontrar os feriados de "${ano}". Digite um ano válido, por exemplo ${new Date().getFullYear()}.`
        })
}

function mostrarProximoFeriado() {
    const hoje = new Date()
    hoje.setHours(12, 0, 0, 0)
    const anoAtual = hoje.getFullYear()

    fetch(`https://brasilapi.com.br/api/feriados/v1/${anoAtual}`)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error('Erro ao buscar o próximo feriado')
            }
            return resposta.json()
        })
        .then(feriados => {
            let feriadoProximo = null

            feriados.forEach(feriado => {
                const data = new Date(feriado.date + 'T12:00:00')
                if (feriadoProximo == null && data >= hoje) {
                    feriadoProximo = feriado
                }
            })

            if (feriadoProximo == null) {
                proximo.innerHTML = `<p>Não há mais feriados nacionais em ${anoAtual}.</p>`
                return
            }

            const data = new Date(feriadoProximo.date + 'T12:00:00')
            const dias = Math.round((data - hoje) / (1000 * 60 * 60 * 24))

            let textoDias = `Faltam ${dias} dias`
            if (dias == 0) {
                textoDias = 'É hoje!'
            } else if (dias == 1) {
                textoDias = 'Falta 1 dia'
            }

            proximo.innerHTML = `
                <span class="rotulo">Próximo feriado</span>
                <h2>${feriadoProximo.name}</h2>
                <p>${data.toLocaleDateString('pt-BR')} · ${diasDaSemana[data.getDay()]}</p>
                <span class="contador">${textoDias}</span>`
        })
        .catch(erro => {
            console.log(erro)
            proximo.innerHTML = ''
        })
}

document.getElementById('btnConsultar').addEventListener('click', consultarFeriados)

campoAno.addEventListener('keydown', evento => {
    if (evento.key == 'Enter') {
        consultarFeriados()
    }
})

mostrarProximoFeriado()
consultarFeriados()
