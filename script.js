//SCRIPT PARA A EXIBIÇÃO DO RANKING GERAL DOS ESTADOS
document.addEventListener('DOMContentLoaded', function() {
    // Função para criar gráfico de ranking geral de estados
    function createRankingGeralChart() {
        fetch('https://obmep.onrender.com/api/ranking-geral-estados')
            .then(response => response.json())
            .then(data => {
                const labels = data.ranking.map(item => item.estado);
                const values = data.ranking.map(item => item.total_premios);

                const ctx = document.getElementById('rankingEstados').getContext('2d');

                // Limpar o gráfico anterior, se existir
                if (window.rankingEstadosChart) {
                    window.rankingEstadosChart.destroy();
                }

                // Criar um novo gráfico de barras
                window.rankingEstadosChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Total de Prêmios',
                            data: values,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 4
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
            })
            .catch(error => console.error('Erro ao buscar os dados:', error));
    }

//SCRIPT PARA A EXIBIÇÃO DA COMPARAÇÃO ENTRE ESCOLAS PUBLICAS E PROVADAS DE UM DADO MUNICIPIO
    function createDesempenhoPublicoPrivadoChart(municipio, edicao, nivel) {
        fetch(`https://obmep.onrender.com/api/comparar-desempenho-publico-privado?municipio=${municipio}&edicao=${edicao}&nivel=${nivel}`)
            .then(response => response.json())
            .then(data => {
                const labels = ['Públicas', 'Privadas'];
                const values = [
                    data.escolas_publicas.reduce((total, escola) => total + escola.total_premiacoes, 0),
                    data.escolas_privadas.reduce((total, escola) => total + escola.total_premiacoes, 0)
                ];

                const ctx = document.getElementById('desempenhoPublicoPrivado').getContext('2d');

                if (window.desempenhoPublicoPrivadoChart) {
                    window.desempenhoPublicoPrivadoChart.destroy();
                }

                if (values[0] === 0 && values[1] === 0) {
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    ctx.font = "10px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText("", ctx.canvas.width / 2, ctx.canvas.height / 2);
                } else {
                    window.desempenhoPublicoPrivadoChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Total de Prêmios',
                                data: values,
                                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)'],
                                borderWidth: 4
                            }]
                        },
                        options: {
                            indexAxis: 'y',
                            scales: {
                                x: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                }
            })
            .catch(error => console.error('Erro ao buscar os dados:', error));
    }



    // Função para criar gráfico de comparação entre escolas federais e estaduais
    function createCompararDesempenhoChart(estado, edicao) {
        fetch(`https://obmep.onrender.com/api/comparar-desempenho?estado=${estado}&edicao=${edicao}`)
            .then(response => response.json())
            .then(data => {
                const labels = data.escolas_federais.map((_, index) => `Escola ${index + 1}`);
                const totalFederais = data.escolas_federais.map(escola => escola.total_premiacoes);
                const totalEstaduais = data.escolas_estaduais.map(escola => escola.total_premiacoes);

                const ctx = document.getElementById('compararDesempenho').getContext('2d');

                // Limpar o gráfico anterior, se existir
                if (window.compararDesempenhoChart) {
                    window.compararDesempenhoChart.destroy();
                }

                // Criar um novo gráfico de barras
                window.compararDesempenhoChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Escolas Federais',
                                data: totalFederais,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 4
                            },
                            {
                                label: 'Escolas Estaduais',
                                data: totalEstaduais,
                                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                                borderColor: 'rgba(255, 159, 64, 1)',
                                borderWidth: 4
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Erro ao buscar os dados:', error));
    }

    // Função para exibir mensagem inicial
    function showInitialMessage() {
        const ctx = document.getElementById('desempenhoPublicoPrivado').getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Limpar o canvas
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText("", ctx.canvas.width / 2, ctx.canvas.height / 2);
    }

// Event listener para formulário de consulta de desempenho público vs privado
    document.getElementById('consultaForm').addEventListener('submit', function(event) {
        event.preventDefault();

        let municipio = document.getElementById('municipio').value;
        const edicao = document.getElementById('edicao').value;
        const nivel = document.getElementById('nivel').value;

        // Função para formatar o nome do município
        municipio = municipio.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/gi, '');

        // Validação do nível entre 1 e 3
        if (isNaN(nivel) || nivel < 1 || nivel > 3) {
            alert('Por favor insira um nível entre 1 e 3.');
            return;
        }

        // Criar gráfico de desempenho público vs privado
        createDesempenhoPublicoPrivadoChart(municipio, edicao, nivel);
    });

// Exibir mensagem inicial
    showInitialMessage();

    // Event listener para formulário de consulta de comparação entre escolas federais e estaduais
    document.getElementById('consultaFE').addEventListener('submit', function(event) {
        event.preventDefault();
        let estado = document.getElementById('estado').value;
        const edicao = document.getElementById('edicaoFE').value;

        // Criar gráfico de comparação entre escolas federais e estaduais
        createCompararDesempenhoChart(estado, edicao);
    });

    // Carregar gráfico de ranking geral de estados ao carregar a página
    createRankingGeralChart();
});
//EXIBIR A TRAJETORIA DE UMA ESCOLA ESPECIFICA
document.addEventListener('DOMContentLoaded', function() {
    // Função para criar gráfico de trajetória da escola
    function createTrajetoriaEscolaChart(escola) {
        fetch(`https://obmep.onrender.com/api/trajetoria-escola?escola=${escola}`)
            .then(response => response.json())
            .then(data => {
                const labels = data.trajetoria.map(item => item.edicao);
                const values = data.trajetoria.map(item => item.total_premiacoes);

                const ctx = document.getElementById('trajetoriaEscola').getContext('2d');

                // Limpar o gráfico anterior, se existir
                if (window.trajetoriaEscolaChart) {
                    window.trajetoriaEscolaChart.destroy();
                }

                // Criar um novo gráfico de linha
                window.trajetoriaEscolaChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Total de Prêmios',
                            data: values,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 4,
                            fill: false
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
            })
            .catch(error => console.error('Erro ao buscar os dados:', error));
    }

    // Event listener para formulário de seleção de escola
    document.getElementById('formTrajetoriaEscola').addEventListener('submit', function(event) {
        event.preventDefault();

        let escola = document.getElementById('escola').value;

        // Validar se foi selecionada uma escola
        if (!escola) {
            alert('Por favor, selecione uma escola.');
            return;
        }

        // Criar gráfico de trajetória da escola selecionada
        createTrajetoriaEscolaChart(escola);
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const parametersForm = document.getElementById('parametersForm');
    const schoolIcon = document.getElementById('schoolIcon');
    const schoolName = document.getElementById('schoolName');

    parametersForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const estado = document.getElementById('estadoTJ').value;
        const nivel = document.getElementById('nivelTJ').value;
        const edicao = document.getElementById('edicaoTJ').value;

        fetch(`https://obmep.onrender.com/api/buscarinstituicaoestado?estado=${estado}&nivel=${nivel}&edicao=${edicao}`)
            .then(response => response.json())
            .then(data => {
                if (data.instituicao) {
                    schoolName.textContent = data.instituicao;
                    // Atualize o ícone conforme necessário
                    // schoolIcon.src = "caminho/para/o/seu/icone.jpg";
                } else {
                    schoolName.textContent = 'Nenhuma instituição encontrada';
                }
            })
            .catch(error => {
                console.error('Erro ao buscar os dados:', error);
                schoolName.textContent = 'Erro ao buscar os dados';
            });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formCompararDesempenho');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const estado = document.getElementById('estadoDME').value;
        const nivel = document.getElementById('nivelDME').value;
        const edicao = document.getElementById('edicaoDME').value;

        fetch(`https://obmep.onrender.com/api/comparar-desempenho-municipal-estadual?estado=${estado}&nivel=${nivel}&edicao=${edicao}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const escolasMunicipais = data.escolas_municipais.slice(0, 5);
                const escolasEstaduais = data.escolas_estaduais.slice(0, 5);

                const labels = [
                    ...new Set([
                        ...escolasMunicipais.map(escola => escola.instituicao),
                        ...escolasEstaduais.map(escola => escola.instituicao)
                    ])
                ];

                const valoresMunicipais = labels.map(label => {
                    const escola = escolasMunicipais.find(e => e.instituicao === label);
                    return escola ? escola.total_premiacoes : 0;
                });

                const valoresEstaduais = labels.map(label => {
                    const escola = escolasEstaduais.find(e => e.instituicao === label);
                    return escola ? escola.total_premiacoes : 0;
                });

                // Ajustar o gráfico
                const ctx = document.getElementById('chart').getContext('2d');

                if (window.compararChart) {
                    window.compararChart.destroy();
                }

                window.compararChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Escolas Municipais',
                            data: valoresMunicipais,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 4,
                            barThickness: 15,
                            categoryPercentage: 0.4,
                            barPercentage: 0.8
                        }, {
                            label: 'Escolas Estaduais',
                            data: valoresEstaduais,
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 4,
                            barThickness: 15,
                            categoryPercentage: 0.4,
                            barPercentage: 0.8
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: true
                            }
                        },
                        scales: {
                            x: {
                                stacked: false,
                                grid: {
                                    display: false
                                },
                                ticks: {
                                    autoSkip: false
                                }
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Erro ao buscar dados:', error));
    });
});


//ENDPOINT - Exibir trajetória de um estado ao longo das edições
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formTrajetoriaEstado');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const estado = document.getElementById('estadoS').value;

        fetch(`https://obmep.onrender.com/api/trajetoria-estado?estado=${estado}`)
            .then(response => response.json())
            .then(data => {
                const labels = data.trajetoria.map(item => item.edicao);
                const values = data.trajetoria.map(item => item.total_premiacoes);

                const ctx = document.getElementById('trajetoriaEstado').getContext('2d');

                // Limpar o gráfico anterior, se existir
                if (window.trajetoriaEstadoChart) {
                    window.trajetoriaEstadoChart.destroy();
                }

                // Criar um novo gráfico de linha
                window.trajetoriaEstadoChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: `Trajetória de Prêmios em ${estado}`,
                            data: values,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 4,
                            fill: false
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
            })
            .catch(error => console.error('Erro ao buscar dados:', error));
    });
});
//TRAJETORIA MUNICIPIO
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formTrajetoriaMunicipio');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const municipiot = document.getElementById('municipioTJ').value;
        const municipio = municipiot.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/gi, '');

        fetch(`https://obmep.onrender.com/api/trajetoria-municipio?municipio=${municipio}`)
            .then(response => response.json())
            .then(data => {
                const labels = data.trajetoria.map(item => item.edicao);
                const valoresPremiacoes = data.trajetoria.map(item => item.total_premiacoes);

                const ctx = document.getElementById('trajetoriaMunicipio').getContext('2d');

                // Limpar o gráfico anterior, se existir
                if (window.trajetoriaMunicipioChart) {
                    window.trajetoriaMunicipioChart.destroy();
                }

                // Criar um novo gráfico de linha
                window.trajetoriaMunicipioChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: `Trajetória de Prêmios em ${municipio}`,
                            data: valoresPremiacoes,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 4,
                            fill: false
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
            })
            .catch(error => console.error('Erro ao buscar dados:', error));
    });
});

//TRAJETORIA ESCOLA
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formTrajetoriaEscola');
    const selectEstado = document.getElementById('estadoTJE');
    const selectMunicipio = document.getElementById('municipioTJE');
    const selectEscola = document.getElementById('escolaTJE');

    // Função para carregar os municípios com base no estado selecionado
    function carregarMunicipios(estado) {
        fetch(`https://obmep.onrender.com/api/listar-municipios?estado=${estado}`)
            .then(response => response.json())
            .then(data => {
                // Limpa opções anteriores
                selectMunicipio.innerHTML = '';
                // Adiciona novas opções de municípios
                data.municipio.forEach(municipio => {
                    const option = document.createElement('option');
                    option.text = municipio._id;
                    option.value = municipio._id;
                    selectMunicipio.appendChild(option);
                });
            })
            .catch(error => console.error('Erro ao buscar municípios:', error));
    }

    // Função para carregar as escolas com base no estado e município selecionados
    function carregarEscolas(estado, municipio) {
        fetch(`https://obmep.onrender.com/api/listar-escolas?estado=${estado}&municipio=${municipio}`)
            .then(response => response.json())
            .then(data => {
                // Limpa opções anteriores
                selectEscola.innerHTML = '';
                // Adiciona novas opções de escolas
                data.instituicao.forEach(escola => {
                    const option = document.createElement('option');
                    option.text = escola._id;
                    option.value = escola._id;
                    selectEscola.appendChild(option);
                });
            })
            .catch(error => console.error('Erro ao buscar escolas:', error));
    }

    // Evento para carregar os municípios quando o estado for selecionado
    selectEstado.addEventListener('change', function() {
        const estado = selectEstado.value;
        carregarMunicipios(estado);
    });

    // Evento para carregar as escolas quando o município for selecionado
    selectMunicipio.addEventListener('change', function() {
        const estado = selectEstado.value;
        const municipio = selectMunicipio.value;
        carregarEscolas(estado, municipio);
    });

    // Evento de submissão do formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const escola = selectEscola.value;

        // Validar se foi selecionada uma escola
        if (!escola) {
            alert('Por favor, selecione uma escola.');
            return;
        }

        fetch(`https://obmep.onrender.com/api/trajetoria-escola?escola=${escola}`)
            .then(response => response.json())
            .then(data => {
                const labels = data.trajetoria.map(item => item.edicao);
                const values = data.trajetoria.map(item => item.total_premiacoes);

                const ctx = document.getElementById('trajetoriaEscola').getContext('2d');

                // Limpar o gráfico anterior, se existir
                if (window.trajetoriaEscolaChart) {
                    window.trajetoriaEscolaChart.destroy();
                }

                // Criar um novo gráfico de linha
                window.trajetoriaEscolaChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Total de Prêmios',
                            data: values,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 4,
                            fill: false
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
            })
            .catch(error => console.error('Erro ao buscar os dados:', error));
    });

    // Inicializar carregamento dos municípios para o estado inicial selecionado
    carregarMunicipios(selectEstado.value);
});
//TOTAL DE PREMIAÇÕES

document.addEventListener('DOMContentLoaded', function() {
    const totalGeralElement = document.getElementById('totalGeral');
    const totalOuroElement = document.getElementById('totalOuro');
    const totalPrataElement = document.getElementById('totalPrata');
    const totalBronzeElement = document.getElementById('totalBronze');

    // Função para carregar os totais de premiações
    function carregarTotalPremiacoes() {
        fetch('https://obmep.onrender.com/api/listar-total-premiacoes')
            .then(response => response.json())
            .then(data => {
                totalGeralElement.textContent = data.total_geral;
                totalOuroElement.textContent = data.medalhas.ouro;
                totalPrataElement.textContent = data.medalhas.prata;
                totalBronzeElement.textContent = data.medalhas.bronze;
            })
            .catch(error => console.error('Erro ao buscar total de premiações:', error));
    }

    // Carregar total de premiações ao carregar a página
    carregarTotalPremiacoes();
});


//ESCOLA DESTAQUE EM UM MUNICIPIO
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formInstituicaoDestacadaMM');
    const estadoSelect = document.getElementById('estadoMM');
    const municipioSelect = document.getElementById('municipioMM');
    const nivelSelect = document.getElementById('nivelMM');
    const edicaoSelect = document.getElementById('edicaoMM');
    const nomeInstituicaoElement = document.getElementById('nomeInstituicaoMM');
    const totalPremiacoesElement = document.getElementById('totalPremiacoesMM');
    const iconeInstituicaoElement = document.getElementById('iconeInstituicaoMM');

    // Função para carregar os municípios com base no estado selecionado
    estadoSelect.addEventListener('change', function() {
        const estado = estadoSelect.value;
        fetch(`https://obmep.onrender.com/api/listar-municipios?estado=${estado}`)
            .then(response => response.json())
            .then(data => {
                municipioSelect.innerHTML = '';
                data.municipio.forEach(m => {
                    const option = document.createElement('option');
                    option.value = m._id;
                    option.textContent = m._id;
                    municipioSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Erro ao buscar municípios:', error));
    });


    // Função para buscar a instituição mais destacada em um município
    function buscarInstituicaoMaisDestacada(municipio, nivel, edicao) {
        fetch(`https://obmep.onrender.com/api/buscarinstituicaomunicipio?municipio=${municipio}&nivel=${nivel}&edicao=${edicao}`)
            .then(response => response.json())
            .then(data => {
                nomeInstituicaoElement.textContent = data.instituicao || 'Nenhuma instituição encontrada';
                // Verifica se total_premiacoes é undefined e define como 0 se necessário
                const totalPremiacoes = data.total_premiacoes !== undefined ? data.total_premiacoes : 0;
                totalPremiacoesElement.textContent = `Total de Premiações: ${totalPremiacoes}`;
                // Aqui você pode alterar o ícone da instituição se tiver uma URL específica
                // iconeInstituicaoElement.src = 'URL do ícone específico';
            })
            .catch(error => console.error('Erro ao buscar instituição destacada:', error));
    }


    // Evento de submissão do formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const estado = estadoSelect.value;
        const municipio = municipioSelect.value;
        const nivel = nivelSelect.value;
        const edicao = edicaoSelect.value;

        // Validar se todos os campos estão selecionados
        if (!estado || !municipio || !nivel || !edicao) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Buscar a instituição destacada com os parâmetros selecionados
        buscarInstituicaoMaisDestacada(municipio, nivel, edicao);
    });

    // Carregar os municípios para o estado inicial selecionado
    if (estadoSelect.value) {
        estadoSelect.dispatchEvent(new Event('change'));
    }
});
