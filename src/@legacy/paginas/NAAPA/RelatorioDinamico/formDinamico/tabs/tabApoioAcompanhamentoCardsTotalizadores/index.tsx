import { Base } from '@/@legacy/componentes';
import { ColorsCards } from '@/@legacy/componentes/colors';
import { TotalDeAtendimentoDto } from '@/core/dto/TotalDeAtendimentoDto';
import { Col, Divider, Row, Tooltip } from 'antd';
import React from 'react';
import { ContainerCardTotalizador, LabelCard, TitleCard } from '../styles';

type TabApoioAcompanhamentoCardsTotalizadoresProps = {
  totalDeAtendimento: TotalDeAtendimentoDto;
};

export const TabApoioAcompanhamentoCardsTotalizadores: React.FC<
  TabApoioAcompanhamentoCardsTotalizadoresProps
> = ({ totalDeAtendimento }) => {
  return (
    <Col xs={24}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6} style={{ minWidth: '315px' }}>
          <ContainerCardTotalizador color={Base.Roxo}>
            <LabelCard color={Base.Roxo}>Total de atendimentos</LabelCard>
            <Divider style={{ margin: '8px 0px', borderBlockStart: '1px solid #DADADA' }} />
            {totalDeAtendimento?.total || 0}
          </ContainerCardTotalizador>
        </Col>

        {totalDeAtendimento?.totalAtendimentoQuestoes?.length ? (
          <>
            {totalDeAtendimento.totalAtendimentoQuestoes.map((questao) => {
              return (
                <>
                  <Col xs={24}>
                    <TitleCard>{questao?.descricao}</TitleCard>
                  </Col>

                  {questao?.totalAtendimentoQuestaoPorRespostas?.map((item, index) => {
                    const color = ColorsCards[index];

                    return (
                      <Col xs={24} sm={12} md={6} key={index} style={{ minWidth: '315px' }}>
                        <ContainerCardTotalizador color={color}>
                          <Tooltip title={item.descricao}>
                            <LabelCard
                              color={color}
                              style={{
                                minHeight: '20%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.descricao}
                            </LabelCard>
                          </Tooltip>
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
