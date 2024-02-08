import { Base } from '@/@legacy/componentes';
import { ColorsCards } from '@/@legacy/componentes/colors';
import { TotalRegistroPorModalidadeRelatorioDinamicoNAAPADTO } from '@/core/dto/TotalRegistroPorModalidadeRelatorioDinamicoNAAPADTO';
import { ModalidadeEnumDisplay } from '@/core/enum/modalidade-enum';
import { Col, Divider, Row } from 'antd';
import React from 'react';
import { ContainerCardTotalizador, LabelCard, TitleCard } from '../styles';

type TabEncaminhamentoCardsTotalizadoresProps = {
  totalRegistroPorModalidadesAno: TotalRegistroPorModalidadeRelatorioDinamicoNAAPADTO[];
  totalEncaminhamentos: number;
  exibirCardsPorModalidade: boolean;
  exibirCardsPorAno: boolean;
};

export const TabEncaminhamentoCardsTotalizadores: React.FC<
  TabEncaminhamentoCardsTotalizadoresProps
> = ({
  totalEncaminhamentos,
  totalRegistroPorModalidadesAno,
  exibirCardsPorModalidade,
  exibirCardsPorAno,
}) => {
  return (
    <Col xs={24}>
      <Row gutter={[16, 16]}>
        {totalEncaminhamentos ? (
          <>
            <Col xs={24} sm={12} md={6}>
              <ContainerCardTotalizador color={Base.Roxo}>
                <LabelCard color={Base.Roxo}>Total de encaminhamentos</LabelCard>
                <Divider style={{ margin: '8px 0px', borderBlockStart: '1px solid #DADADA' }} />
                {totalEncaminhamentos || 0}
              </ContainerCardTotalizador>
            </Col>
          </>
        ) : (
          <></>
        )}
        {exibirCardsPorModalidade && totalRegistroPorModalidadesAno?.length ? (
          <>
            <Col xs={24}>
              <TitleCard>Total por modalidade</TitleCard>
            </Col>
            {totalRegistroPorModalidadesAno?.map((item, index) => {
              const color = ColorsCards[index];
              return (
                <Col xs={24} sm={12} md={6} key={index}>
                  <ContainerCardTotalizador color={color}>
                    <LabelCard color={color}>{ModalidadeEnumDisplay[item.modalidade]}</LabelCard>
                    <Divider style={{ margin: '8px 0px', borderBlockStart: '1px solid #DADADA' }} />
                    {item?.total || 0}
                  </ContainerCardTotalizador>
                </Col>
              );
            })}
          </>
        ) : (
          <></>
        )}

        {exibirCardsPorAno && totalRegistroPorModalidadesAno?.length ? (
          <>
            <Col xs={24}>
              <TitleCard>Total por ano</TitleCard>
            </Col>
            {totalRegistroPorModalidadesAno?.map((item, index) => {
              const color = ColorsCards[index];
              return (
                <Col xs={24} sm={12} md={6} key={index}>
                  <ContainerCardTotalizador color={color}>
                    <LabelCard color={color}>{item.descricaoAno}</LabelCard>
                    <Divider style={{ margin: '8px 0px', borderBlockStart: '1px solid #DADADA' }} />
                    {item?.total || 0}
                  </ContainerCardTotalizador>
                </Col>
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
