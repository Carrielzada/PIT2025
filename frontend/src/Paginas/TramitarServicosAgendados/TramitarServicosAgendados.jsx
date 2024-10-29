// o código não está perfeito, recomendação pessoal: refazer tudo, com calma.
// arquivo totalmente atualizado 28.10.2024 - 22:50
// backend funcional, falta alterar as camadas de /tramitar pra puxar do /realizaragserv ao invés de /servico
// amanhã refazer esse TramitarServicosAgendados.jsx

import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Form, Container, Table, Alert } from 'react-bootstrap';
import { FaListAlt, FaSave } from 'react-icons/fa';
import TramitarServicoService from '../../services/TramitarServicoService';
import RealizarAgServService from '../../services/RealizarAgServService';
import SecretariaService from '../../services/SecretariaService';
import { format } from 'date-fns';
import CaixaSelecaoTramitar from '../../Componentes/CaixaSelecaoTramitar';

const tramitarServicoService = new TramitarServicoService();
const realizarAgServService = new RealizarAgServService();
const secretariaService = new SecretariaService();

function TramitarServicosAgendados() {
  const [idTramitar, setIdTramitar] = useState('');
  const [msgMotivo, setMsgMotivo] = useState('');
  const [idAgendamento, setIdAgendamento] = useState('');
  const [idSecretaria, setIdSecretaria] = useState('');
  const [listaTramitacoes, setListaTramitacoes] = useState([]);
  const [listaAgendamentos, setListaAgendamentos] = useState([]);
  const [listaSecretarias, setListaSecretarias] = useState([]);
  const [sucessoMensagem, setSucessoMensagem] = useState('');
  const [erro, setErro] = useState('');

  function TramitarServAgendados() {
    const [tramitar, setTramitar] = useState({
      id: 0,
      msg_motivo: '',
      secretaria: { id: 0, nome_secretaria: '' 
         }
  });

  const carregarAgendamentos = async () => {
    try {
      const dados = await realizarAgServService.obterTodos();
      setListaAgendamentos(dados);
    } catch (error) {
      setErro('Erro ao carregar agendamentos.');
    }
  };

  const handleSelecaoSecretaria = (secretariaSelecionada) => {
    setAgendamento((prevAgendamento) => ({
      ...prevAgendamento,
      secretaria: { id: secretariaSelecionada.id, nome: secretariaSelecionada.nome_secretaria }
    }));
  };

  const listarTramitacoes = async () => {
    try {
      const dados = await tramitarServicoService.obterTodos();
      setListaTramitacoes(dados);
    } catch (error) {
      setErro('Erro ao listar tramitações.');
    }
  };

  const handleSalvarTramitacao = async () => {
    if (!idAgendamento || !idSecretaria || !msgMotivo) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await tramitarServicoService.adicionar({ idAgendamento, idSecretaria, msgMotivo });
      setSucessoMensagem('Tramitação salva com sucesso!');
      listarTramitacoes();
      limparCampos();
    } catch (error) {
      setErro('Erro ao salvar tramitação.');
    }
  };

  const limparCampos = () => {
    setIdTramitar('');
    setMsgMotivo('');
    setIdAgendamento('');
    setIdSecretaria('');
  };

  useEffect(() => {
    carregarAgendamentos();
    carregarSecretarias();
    listarTramitacoes();
  }, []);

  return (
    <div className="bg-white p-0 rounded shadow w-100" style={{ minHeight: '90vh' }}>
      <h2 className="text-center mb-4">
        <FaListAlt /> Tramitar Serviços Agendados
      </h2>

      <Container className="mt-2">
        <Card>
          <Card.Header as="h4">Nova Tramitação</Card.Header>
          <Card.Body>
            <Form>
              <Row className="align-items-center mb-3">
                <Col lg={4}>
                  <Form.Group>
                    <Form.Label>Agendamento de Serviço</Form.Label>
                    <Form.Select
                      value={idAgendamento}
                      onChange={(e) => setIdAgendamento(e.target.value)}
                    >
                      <option value="">Selecione um agendamento</option>
                      {listaAgendamentos.map((agendamento) => (
                        <option key={agendamento.agserv_id} value={agendamento.agserv_id}>
                          {agendamento.agserv_id} - {agendamento.agserv_nomeSolicitante}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={4}>
                  <Form.Group>
                    <Form.Label>Secretaria</Form.Label>
                    <CaixaSelecaoTramitar
                          enderecoFonteDados="http://localhost:3001/secretaria"
                          campoChave="id"
                          campoExibicao="nome_secretaria"
                          funcaoSelecao={handleSelecaoSecretaria}
                          localLista={listaSecretarias}
                          valorSelecionado={secretaria.id}
                        />
                  </Form.Group>
                </Col>
                <Col lg={4}>
                  <Form.Group>
                    <Form.Label>ID Tramitação</Form.Label>
                    <Form.Control
                      type="text"
                      value={idTramitar}
                      readOnly
                      placeholder="ID gerado automaticamente"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="align-items-center mb-3">
                <Col lg={12}>
                  <Form.Group>
                    <Form.Label>Mensagem</Form.Label>
                    <Form.Control
                      type="text"
                      value={msgMotivo}
                      onChange={(e) => setMsgMotivo(e.target.value)}
                      placeholder="Digite uma mensagem breve"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="align-items-center">
                <Col lg={2}>
                  <Button variant="primary" onClick={handleSalvarTramitacao} className="w-100">
                    <FaSave /> Salvar Tramitação
                  </Button>
                </Col>
              </Row>

              {sucessoMensagem && (
                <Alert variant="success" className="mt-3">
                  {sucessoMensagem}
                </Alert>
              )}
              {erro && (
                <Alert variant="danger" className="mt-3">
                  {erro}
                </Alert>
              )}
            </Form>
          </Card.Body>
        </Card>

        <Card className="mt-4">
          <Card.Header as="h5">Tramitações Realizadas</Card.Header>
          <Card.Body>
            {listaTramitacoes && listaTramitacoes.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID Tramitação</th>
                    <th>Nome do Solicitante</th>
                    <th>CPF Solicitante</th>
                    <th>Mensagem</th>
                    <th>ID Agendamento</th>
                    <th>Secretaria</th>
                    <th>Horário</th>
                  </tr>
                </thead>
                <tbody>
                  {listaTramitacoes.map((tramitacao) => (
                    <tr key={tramitacao.id}>
                      <td>{tramitacao.id}</td>
                      <td>{tramitacao.agserv_nomeSolicitante}</td>
                      <td>{tramitacao.agserv_cpfSolicitante}</td>
                      <td>{tramitacao.msg_motivo}</td>
                      <td>{tramitacao.id_servico}</td>
                      <td>{tramitacao.nome_secretaria}</td>
                      <td>{tramitacao.data_tramitacao ? format(new Date(tramitacao.data_tramitacao), 'HH:mm') : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center">Nenhuma tramitação para listar</div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
}
export default TramitarServicosAgendados;