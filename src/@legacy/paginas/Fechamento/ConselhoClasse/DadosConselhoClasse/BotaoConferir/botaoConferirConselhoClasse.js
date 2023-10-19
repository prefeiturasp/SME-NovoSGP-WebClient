import { BIMESTRE_FINAL } from '@/@legacy/constantes';
import {
  SGP_BUTTON_PRINCIPAL_MODAL_BIMESTRES,
  SGP_BUTTON_PRINCIPAL_MODAL_INCONSISTENCIAS,
  SGP_BUTTON_SECUNDARIO_MODAL_BIMESTRES,
  SGP_BUTTON_SECUNDARIO_MODAL_INCONSISTENCIAS,
  SGP_BUTTON_CONFERIR_CONSELHO_CLASSE,
} from '@/@legacy/constantes/ids/button';
import { RadioGroupButtonCustomizado } from '@/@legacy/paginas/DiarioClasse/AcompanhamentoFrequencia/Componentes/ModalImpressao/modalImpressao.css';
import { erros, sucesso } from '@/@legacy/servicos';
import ServicoConselhoClasse from '@/@legacy/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Colors,
  DataTable,
  Label,
  Loader,
  ModalConteudoHtml,
} from '~/componentes';
import Button from '~/componentes/button';
import shortid from 'shortid';
import { Row } from 'antd';
import { setDadosInconsistenciasEstudantes } from '@/@legacy/redux/modulos/conselhoClasse/actions';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';

const BotaoConferirConselhoClasse = () => {
  const dispatch = useDispatch();

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const [exibirModalBimestres, setExibirModalBimestres] = useState(false);
  const [exibirModalInconsistencias, setExibirModalInconsistencias] =
    useState(false);
  const [bimestreSelecionado, setBimestreSelecionado] = useState();
  const [exibirLoader, setExibirLoader] = useState(false);
  const [dadosInconsistencias, setDadosInconsistencias] = useState([]);

  const opcoesBimestres = [
    {
      value: '1',
      label: '1º bimestre',
    },
    {
      value: '2',
      label: '2º bimestre',
    },
  ];

  if (
    Number(turmaSelecionada?.modalidade) !== ModalidadeEnum.EJA &&
    Number(turmaSelecionada?.modalidade) !== ModalidadeEnum.CELP
  ) {
    opcoesBimestres.push(
      {
        value: '3',
        label: '3º bimestre',
      },
      {
        value: '4',
        label: '4º bimestre',
      }
    );
  }

  opcoesBimestres.push({
    value: BIMESTRE_FINAL,
    label: 'Final',
  });

  const onClickConferir = async () => {
    setExibirLoader(true);

    ServicoConselhoClasse.conferirInconsistencias(
      turmaSelecionada?.id,
      bimestreSelecionado
    )
      .then(resposta => {
        if (resposta?.status === 200) {
          if (resposta?.data?.length) {
            setDadosInconsistencias(resposta.data);
            setExibirModalInconsistencias(true);
          } else {
            sucesso('Todos estudantes estão com conselho de classe registrado');
          }
        }
      })
      .catch(e => erros(e))
      .finally(() => {
        setExibirLoader(false);
        setExibirModalBimestres(false);
        setBimestreSelecionado();
      });
  };

  const onCloseModalConferir = () => {
    setExibirModalBimestres(false);
    setBimestreSelecionado();
  };

  const onCloseModalInconsistencias = () => {
    setExibirModalInconsistencias(false);
  };

  const onClickAtualizarInconsistencias = () => {
    dispatch(setDadosInconsistenciasEstudantes([...dadosInconsistencias]));
    setExibirModalInconsistencias(false);
  };

  return (
    <>
      <Button
        label="Conferir"
        color={Colors.Roxo}
        onClick={() => setExibirModalBimestres(true)}
        id={SGP_BUTTON_CONFERIR_CONSELHO_CLASSE}
      />

      {exibirModalBimestres ? (
        <ModalConteudoHtml
          titulo="Conferir"
          visivel={exibirModalBimestres}
          onClose={() => onCloseModalConferir()}
          onConfirmacaoSecundaria={() => onCloseModalConferir()}
          onConfirmacaoPrincipal={() => onClickConferir()}
          labelBotaoPrincipal="Conferir"
          labelBotaoSecundario="Cancelar"
          closable={!exibirLoader}
          fecharAoClicarFora={!exibirLoader}
          fecharAoClicarEsc={!exibirLoader}
          fontSizeTitulo="18"
          tipoFonte="bold"
          idBotaoPrincipal={SGP_BUTTON_PRINCIPAL_MODAL_BIMESTRES}
          idBotaoSecundario={SGP_BUTTON_SECUNDARIO_MODAL_BIMESTRES}
          loader={exibirLoader}
          desabilitarBotaoPrincipal={!bimestreSelecionado}
        >
          <Loader loading={exibirLoader} tip="Consultando inconsistências...">
            <RadioGroupButtonCustomizado
              label="Selecione o bimestre"
              opcoes={opcoesBimestres}
              valorInicial
              onChange={e => {
                setBimestreSelecionado(e.target.value);
              }}
              value={bimestreSelecionado}
            />
          </Loader>
        </ModalConteudoHtml>
      ) : (
        <></>
      )}

      {exibirModalInconsistencias && dadosInconsistencias?.length ? (
        <ModalConteudoHtml
          bodyStyle={{ maxHeight: '350px', overflow: 'auto' }}
          titulo="Problemas encontrados na validação"
          visivel
          onClose={() => onCloseModalInconsistencias(false)}
          onConfirmacaoSecundaria={() => onCloseModalInconsistencias(false)}
          onConfirmacaoPrincipal={() => onClickAtualizarInconsistencias()}
          labelBotaoPrincipal="Atualizar"
          labelBotaoSecundario="Cancelar"
          closable
          fontSizeTitulo="18"
          tipoFonte="bold"
          idBotaoPrincipal={SGP_BUTTON_PRINCIPAL_MODAL_INCONSISTENCIAS}
          idBotaoSecundario={SGP_BUTTON_SECUNDARIO_MODAL_INCONSISTENCIAS}
        >
          <Row gutter={[0, 16]}>
            <Label text="Em caso de ausência de recomendações ou notas não será gerado o boletim ou ata final de resultados." />
            <Label text="As informações dos seguintes alunos estão incompletas:" />
            {dadosInconsistencias.map(dadosEstudante => {
              const colunas = [
                {
                  title: dadosEstudante?.numeroChamada,
                  onCell: () => ({
                    colSpan: 0,
                  }),
                },
                {
                  title: `${dadosEstudante?.alunoNome} (${dadosEstudante?.alunoCodigo})`,
                  dataIndex: 'inconsistencias',
                  onCell: () => ({
                    colSpan: 2,
                  }),
                  render: inconsistencias => (
                    <ul style={{ marginLeft: '20px' }}>
                      {inconsistencias.map(inconsistencia => (
                        <li
                          style={{ whiteSpace: 'normal' }}
                          key={shortid.generate()}
                        >
                          {inconsistencia}
                        </li>
                      ))}
                    </ul>
                  ),
                },
              ];
              return (
                <DataTable
                  dataSource={[dadosEstudante]}
                  key={shortid.generate()}
                  columns={colunas}
                  pagination={false}
                  semHover
                />
              );
            })}
          </Row>
        </ModalConteudoHtml>
      ) : (
        <></>
      )}
    </>
  );
};

export default BotaoConferirConselhoClasse;
