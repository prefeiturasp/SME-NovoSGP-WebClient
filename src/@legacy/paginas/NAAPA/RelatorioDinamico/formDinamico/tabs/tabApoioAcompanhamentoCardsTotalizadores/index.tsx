import { Base } from '@/@legacy/componentes';
import { ColorsCards } from '@/@legacy/componentes/colors';
import { TotalRegistroPorAtendimentoRelatorioDinamicoNAAPADTO } from '@/core/dto/TotalRegistroPorModalidadeRelatorioDinamicoNAAPADTO copy';
import { Col, Divider, Row } from 'antd';
import React from 'react';
import { ContainerCardTotalizador, LabelCard, TitleCard } from '../styles';

type TabApoioAcompanhamentoCardsTotalizadoresProps = {
  totalRegistroPorAtendimento: TotalRegistroPorAtendimentoRelatorioDinamicoNAAPADTO;
};

export const TabApoioAcompanhamentoCardsTotalizadores: React.FC<
  TabApoioAcompanhamentoCardsTotalizadoresProps
> = ({ totalRegistroPorAtendimento }) => {
  return (
    <Col xs={24}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <ContainerCardTotalizador color={Base.Roxo}>
            <LabelCard color={Base.Roxo}>Total de atendimentos</LabelCard>
            <Divider style={{ margin: '8px 0px', borderBlockStart: '1px solid #DADADA' }} />
            {totalRegistroPorAtendimento?.total || 0}
          </ContainerCardTotalizador>
        </Col>

        {totalRegistroPorAtendimento?.totalQuetoes?.length ? (
          <>
            {totalRegistroPorAtendimento.totalQuetoes.map((questao) => {
              return (
                <>
                  <Col xs={24}>
                    <TitleCard>{questao?.descricao}</TitleCard>
                  </Col>

                  {questao?.itens?.map((item, index) => {
                    const color = ColorsCards[index];

                    return (
                      <Col xs={24} sm={12} md={6} key={index}>
                        <ContainerCardTotalizador color={color}>
                          <LabelCard color={color}>{item.descricao}</LabelCard>
                          <Divider
                            style={{ margin: '8px 0px', borderBlockStart: '1px solid #DADADA' }}
                          />
                          {item?.total || 0}
                        </ContainerCardTotalizador>
                      </Col>
                    );
                  })}
                </>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </Row>
    </Col>
  );
};
