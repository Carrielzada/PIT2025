import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Form, Container, Table, Alert } from 'react-bootstrap';
import { FaListAlt, FaSave } from 'react-icons/fa';
import RealizarAgServService from '../../services/RealizarAgServService';
import TramitarServicoService from '../../services/TramitarServicoService';
import SecretariaService from '../../services/SecretariaService';
import CaixaSelecaoTramitar from '../../Componentes/CaixaSelecaoTramitar'; // Custom component

const realizarAgServService = new RealizarAgServService();
const tramitarServicoService = new TramitarServicoService();
const secretariaService = new SecretariaService();

function TramitarServicosAgendados() {
  const [msgMotivo, setMsgMotivo] = useState('');
  const [idAgendamento, setIdAgendamento] = useState('');
  const [idSecretaria, setIdSecretaria] = useState('');
  const [listaAgendamentos, setListaAgendamentos] = useState([]);
  const [listaSecretarias, setListaSecretarias] = useState([]);
  const [sucessoMensagem, setSucessoMensagem] = useState('');
  const [erro, setErro] = useState('');

  // Carregar agendamentos do backend
  const carregarAgendamentos = async () => {
    try {
      const dados = await realizarAgServService.obterTodos();
      setListaAgendamentos(dados);
    } catch (error) {
      setErro('Erro ao carregar agendamentos.');
    }
  };

  // Carregar secretarias do backend
  const carregarSecretarias = async () => {
    try {
      const dados = await secretariaService.obterTodos();
      setListaSecretarias(dados);
    } catch (error) {
      setErro('Erro ao carregar secretarias.');
    }
  };

  // Função para salvar tramitação
  const handleSalvarTramitacao = async () => {
    if (!idAgendamento || !idSecretaria || !msgMotivo) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }
    try {
      await tramitarServicoService.adicionar({ 
        id_servico: idAgendamento, 
        id_secretaria: idSecretaria, 
        msg_motivo: msgMotivo 
      });
      setSucessoMensagem('Tramitação salva com sucesso!');
      limparCampos();
    } catch (error) {
      setErro('Erro ao salvar tramitação.');
    }
  };

  // Limpar campos do formulário
  const limparCampos = () => {
    setIdAgendamento('');
    setIdSecretaria('');
    setMsgMotivo('');
  };

  // Carregar dados iniciais ao montar o componente
  useEffect(() => {
    carregarAgendamentos();
    carregarSecretarias();
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
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Agendamento de Serviço</Form.Label>
                    <Form.Select
                      value={idAgendamento}
                      onChange={(e) => setIdAgendamento(e.target.value)}
                    >
                      <option value="">Selecione um agendamento</option>
                      {listaAgendamentos.map((ag) => (
                        <option key={ag.agserv_id} value={ag.agserv_id}>
                          {ag.agserv_nomeSolicitante} - {ag.agserv_descricao}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>Secretaria</Form.Label>
                    <CaixaSelecaoTramitar
                      enderecoFonteDados="http://localhost:3001/secretaria"
                      campoChave="id"
                      campoExibicao="nome_secretaria"
                      funcaoSelecao={(id) => setIdSecretaria(id)}
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

              <Row>
                <Col lg={2}>
                  <Button 
                    variant="primary" 
                    onClick={handleSalvarTramitacao} 
                    className="w-100"
                  >
                    <FaSave /> Salvar Tramitação
                  </Button>
                </Col>
              </Row>

              {sucessoMensagem && <Alert variant="success" className="mt-3">{sucessoMensagem}</Alert>}
              {erro && <Alert variant="danger" className="mt-3">{erro}</Alert>}
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default TramitarServicosAgendados;
