const InputValor = document.getElementById("InputValor")
const SelectMoneda = document.getElementById("SelectMoneda")
const btnBuscar = document.getElementById("btnBuscar")
const Resultado = document.getElementById("Resultado")
const ChartMoneda = document.getElementById('ChartMoneda');
let myChart

const calculamoneda = (ValorMoneda) => {
    let ResultadoConversion

    if (Number(InputValor.value)) {
        ResultadoConversion = Number(InputValor.value) / ValorMoneda
        Resultado.innerHTML = ResultadoConversion.toFixed(2)
    } else {
        alert("No ha ingresado un valor valido")
    }
}

const DespliegaGrafico = (data2obtenida) => {
    let arreglofecha = []
    let arreglomoneda = []
    let i = 0

    // Recorre el arreglo de objetos para crear los arreglos para labels y data del gráfico
    data2obtenida.forEach(element => {
        if (i < 10) {
            let fecha = new Date(element.fecha)
            let fechalabel = fecha.getDate() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getFullYear()
            arreglofecha.push(fechalabel)
            arreglomoneda.push(element.valor)
        }
        i++
    })

    // Valida si exite una instancia del grafico y la destruye para poder utilizar nuevamente
    if (myChart) {
        myChart.destroy();
    }
    // Crea una instancia del gráfico para poder mostrar los labels y data en los arreglos creados anteriormente
    myChart = new Chart(ChartMoneda, {
        type: 'line',
        data: {
            labels: arreglofecha,
            datasets: [{
            label: 'Historial últimos 10 días',
            data: arreglomoneda,
            borderWidth: 2
        }]
        },
        options: {
            scales: {
            y: {
                beginAtZero: true
            }
        }
        }
    });
}

// Consume la API y obtiene el arreglo del cual será extraida la data y se contruirá el gráfico
const convierte_moneda = (tipomoneda) => {
    const route = `https://mindicador.cl/api/${tipomoneda}`

    fetch(route)
    .then(response => {
        return response.json()
    })
    .then(data => {
        return data.serie
    })
    .then(data2 => {
        calculamoneda(Number(data2[0].valor))
        DespliegaGrafico(data2)
    })
    .catch(error => {
        Resultado.innerHTML = "Ha ocurrido error: " + error
    })
}


btnBuscar.addEventListener("click", () => {convierte_moneda(SelectMoneda.value)})