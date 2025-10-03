import InformacoesEducacionais from './VisaoSmeDre/informacoesEducacionais';
import React from 'react';

export default function PainelEducacional() {
  return (
    <>
      <Cabecalho
        pagina="Painel de Informações Educacionais"
        style={{ marginBottom: '16px' }}
      >
        <BotaoVoltarPadrao onClick={aoClicarBotaoVoltar} />
      </Cabecalho>
      <CardEstilizado>
        <div className="col-md-12">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <InformacoesEducacionaisFiltros
                obterDreSelecionado={obterDreSelecionada}
                setAnoLetivo={obterAnoLetivoSelecionado}
                obterUeSelecionado={obterUeSelecionada}
                anoLetivo={anoLetivo}
              />
            </Col>
          </Row>
        </div>
      </CardEstilizado>
    </>
  );
}
