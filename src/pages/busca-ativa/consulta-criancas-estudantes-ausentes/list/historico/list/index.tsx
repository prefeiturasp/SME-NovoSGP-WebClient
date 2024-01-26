import { FiltroRegistrosAcaoCriancasEstudantesAusentesDto } from '@/core/dto/FiltroRegistrosAcaoCriancasEstudantesAusentesDto';
import { RegistroAcaoBuscaAtivaCriancaEstudanteAusenteDto } from '@/core/dto/RegistroAcaoBuscaAtivaCriancaEstudanteAusenteDto';
import { RegistroAcaoBuscaAtivaRespostaDto } from '@/core/dto/RegistroAcaoBuscaAtivaRespostaDto';
import { ROUTES } from '@/core/enum/routes';
import { URL_API_BUSCA_ATIVA } from '@/core/services/busca-ativa-service';
import { formatarData } from '@/core/utils/functions';
import { Col, Row, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ListaPaginada } from '~/componentes';
import { SGP_TABLE_BUSCA_ATIVA_HISTORICO_REGISTRO_ACOES } from '~/constantes/ids/table';

const BuscaAtivaHistoricoRegistroAcoesList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [filtro, setFiltro] = useState<FiltroRegistrosAcaoCriancasEstudantesAusentesDto>();

  const dadosRouteState: RegistroAcaoBuscaAtivaRespostaDto = location.state;

  const turmaId = dadosRouteState?.turmaId;
  const codigoAluno = dadosRouteState?.aluno?.codigoAluno;

  useEffect(() => {
    if (codigoAluno && turmaId) {
      setFiltro({ codigoAluno, turmaId });
    } else {
      setFiltro({});
    }
  }, [codigoAluno, turmaId]);

  const columns: ColumnsType<RegistroAcaoBuscaAtivaCriancaEstudanteAusenteDto> = [
    {
      title: 'Data do contato',
      dataIndex: 'dataRegistro',
      render: (dataRegistro: string) => (dataRegistro ? formatarData(dataRegistro) : ''),
    },
    {
      title: 'Usuario',
      dataIndex: 'usuario',
    },
  ];

  const onClickEditar = (row: RegistroAcaoBuscaAtivaCriancaEstudanteAusenteDto) =>
    navigate(`${ROUTES.BUSCA_ATIVA_HISTORICO_REGISTRO_ACOES}/${row.id}`, {
      replace: true,
      state: dadosRouteState,
    });

  return (
    <Row gutter={[8, 8]}>
      <Col xs={24}>
        <Typography.Text style={{ fontSize: 16 }} strong>
          Histórico de registros
        </Typography.Text>
      </Col>
      <Col xs={24}>
        <ListaPaginada
          url={`${URL_API_BUSCA_ATIVA}/criancas-estudantes/ausentes/registros-acao`}
          id={SGP_TABLE_BUSCA_ATIVA_HISTORICO_REGISTRO_ACOES}
          colunas={columns}
          filtro={filtro}
          filtroEhValido={!!filtro?.codigoAluno && !!filtro?.turmaId}
          onClick={onClickEditar}
        />
      </Col>
    </Row>
  );
};

export default BuscaAtivaHistoricoRegistroAcoesList;
