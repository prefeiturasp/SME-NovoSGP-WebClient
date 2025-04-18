import { Paginacao } from '@/@legacy/componentes-sgp';
import ObservacoesUsuario from '@/@legacy/componentes-sgp/ObservacoesUsuario/observacoesUsuario';
import { useEffect, useState } from 'react';
import { confirmar, erros, sucesso } from '@/@legacy/servicos';
import ServicoNAAPA from '@/@legacy/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setDadosObservacoesUsuario } from '@/@legacy/redux/modulos/observacoesUsuario/actions';

export const ObservacoesPaginado = () => {
  const dispatch = useDispatch();
  const { id: encaminhamentoNAAPAId } = useParams();

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [numeroRegistros, setNumeroRegistros] = useState(1);
  const [numeroRegistrosPagina, setNumeroRegistrosPagina] = useState(10);

  const obterObservacoes = async (numeroPagina, numeroRegistros) => {
    const resposta = await ServicoNAAPA.obterObservacoesPaginado(
      encaminhamentoNAAPAId,
      numeroPagina,
      numeroRegistros
    ).catch(e => erros(e));

    if (resposta?.data?.items) {
      dispatch(setDadosObservacoesUsuario(resposta.data.items));
      setNumeroRegistros(resposta.data.totalRegistros);
    } else {
      dispatch(setDadosObservacoesUsuario([]));
    }
  };

  const salvarEditarObservacao = async obs => {
    const params = {
      id: obs?.id || 0,
      observacao: obs?.observacao || '',
      encaminhamentoNAAPAId: Number(encaminhamentoNAAPAId),
    };

    return ServicoNAAPA.salvarEditarObservacao(params)
      .then(resultado => {
        if (resultado?.status === 200) {
          const msg = `Observação ${
            obs.id ? 'alterada' : 'inserida'
          } com sucesso.`;
          sucesso(msg);
          obterObservacoes(paginaAtual, numeroRegistrosPagina);
        }

        return resultado;
      })
      .catch(e => {
        erros(e);
        return e;
      });
  };

  const excluirObservacao = async obs => {
    const confirmado = await confirmar(
      'Excluir',
      '',
      'Você tem certeza que deseja excluir este registro?'
    );

    if (confirmado) {
      const resultado = await ServicoNAAPA.excluirObservacao(obs?.id).catch(
        e => {
          erros(e);
        }
      );

      if (resultado?.status === 200) {
        sucesso('Registro excluído com sucesso');
        obterObservacoes(paginaAtual, numeroRegistrosPagina);
      }
    }
  };

  const onChangePaginacao = async pagina => {
    setPaginaAtual(pagina);
    obterObservacoes(pagina, numeroRegistrosPagina);
  };

  const onChangeNumeroLinhas = async (paginaAtual, numeroLinhas) => {
    setNumeroRegistros(numeroLinhas);
    setNumeroRegistrosPagina(numeroLinhas);
    obterObservacoes(paginaAtual, numeroLinhas);
  };

  useEffect(() => {
    if (encaminhamentoNAAPAId) {
      obterObservacoes(paginaAtual, numeroRegistrosPagina);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encaminhamentoNAAPAId]);

  return (
    <>
      <ObservacoesUsuario
        esconderLabel
        verificaProprietario
        esconderCaixaExterna={true}
        mostrarBotaoNotificar={false}
        usarLocalizadorFuncionario={false}
        obterUsuariosNotificadosDiarioBordo={false}
        excluirObservacao={obs => excluirObservacao(obs)}
        salvarObservacao={obs => salvarEditarObservacao(obs)}
        editarObservacao={obs => salvarEditarObservacao(obs)}
      />

      <Paginacao
        mostrarNumeroLinhas
        locale={{ items_per_page: '' }}
        pageSize={numeroRegistrosPagina}
        numeroRegistros={numeroRegistros}
        onChangePaginacao={onChangePaginacao}
        onChangeNumeroLinhas={onChangeNumeroLinhas}
        pageSizeOptions={['10', '20', '50', '100']}
      />
    </>
  );
};
