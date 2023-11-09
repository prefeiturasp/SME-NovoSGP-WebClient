import BotaoVoltarPadrao from '@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_BUTTON_BUSCA_ATIVA_NOVO_REGISTRO_ACAO } from '@/@legacy/constantes/ids/button';
import { erros, verificaSomenteConsulta } from '@/@legacy/servicos';
import ServicoConselhoClasse from '@/@legacy/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import ButtonPrimary from '@/components/lib/button/primary';
import CardContent from '@/components/lib/card-content';
import HeaderPage from '@/components/lib/header-page';
import CardDetalhesCriancaEstudante from '@/components/sgp/card-detalhes-crianca-estudante';
import { AlunoReduzidoDto } from '@/core/dto/AlunoReduzidoDto';
import { ROUTES } from '@/core/enum/routes';
import estudanteService from '@/core/services/estudante-service';
import { Col, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const BuscaAtivaHistoricoRegistroAcoes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const usuario = useSelector((state: any) => state.usuario);
  const { permissoes } = usuario;
  const podeIncluir =
    permissoes?.[ROUTES.BUSCA_ATIVA_CONSULTA_CRIANCAS_ESTUDANTES_AUSENTES]?.podeIncluir;

  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(
      permissoes?.[ROUTES.BUSCA_ATIVA_CONSULTA_CRIANCAS_ESTUDANTES_AUSENTES],
    );

    setSomenteConsulta(soConsulta);
  }, [permissoes]);

  const anoLetivo = location?.state?.anoLetivo;
  const codigoAluno = location?.state?.codigoAluno;
  const codigoTurma = location?.state?.codigoTurma;

  const [dados, setDados] = useState<AlunoReduzidoDto | undefined>();

  const obterFrequenciaGlobalAluno = useCallback(async () => {
    const retorno = await ServicoConselhoClasse.obterFrequenciaAluno(
      codigoAluno,
      codigoTurma,
    ).catch((e) => erros(e));

    return retorno?.data;
  }, [codigoTurma, codigoAluno]);

  const obterDados = useCallback(async () => {
    setLoading(true);

    const resposta = await estudanteService.obterDadosEstudante({
      anoLetivo,
      codigoAluno,
      codigoTurma,
      carregarDadosResponsaveis: true,
    });

    if (resposta.sucesso) {
      const novaFreq = await obterFrequenciaGlobalAluno();
      resposta.dados.frequencia = novaFreq;

      setDados(resposta.dados);
    } else {
      setDados(undefined);
    }

    setLoading(false);
  }, [anoLetivo, codigoAluno, codigoTurma]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  const onClickVoltar = () => navigate(ROUTES.BUSCA_ATIVA_CONSULTA_CRIANCAS_ESTUDANTES_AUSENTES);

  return (
    <Col>
      <HeaderPage title="Registro de ações">
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
            </Col>
            <Col>
              <ButtonPrimary
                id={SGP_BUTTON_BUSCA_ATIVA_NOVO_REGISTRO_ACAO}
                disabled={!podeIncluir || somenteConsulta}
              >
                Novo registro de ação
              </ButtonPrimary>
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <CardContent>
        <Row gutter={24}>
          <Col xs={24}>
            <CardDetalhesCriancaEstudante dados={dados} loading={loading} />
          </Col>
        </Row>
      </CardContent>
    </Col>
  );
};

export default BuscaAtivaHistoricoRegistroAcoes;
