import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { Base } from './colors';

const Header = styled.div`
  height: ${({ $altura }) => $altura};
  ${({ $border, $corBorda }) =>
    $border
      ? `
      border-top-width: 0px !important;
      border-bottom-width: 0px !important;
      border-left: 8px solid ${$corBorda} !important;`
      : null}
  &.expanded {
    border-bottom-width: 1px !important;
  }
`;

const Icon = styled.i`
  color: ${Base.CinzaBarras} !important;
`;

const Link = styled.a`
  padding: 0.7rem 0.8rem !important;
  margin-left: auto;

  &:hover {
    background: ${Base.CinzaFundo} !important;
    border-radius: 50% !important;
  }

  &[aria-expanded='true'] ${Icon} {
    color: ${Base.CinzaMako} !important;
    transform: rotate(180deg) !important;
  }
`;

const CardHeader = props => {
  const { id, indice, children, border, icon, show, onClick, configuracao } =
    props;

  const handleHeader = event => {
    event.preventDefault();

    const header = event.target.parentElement.parentElement.classList;
    if (!header.contains('expanded')) header.add('expanded');
    else header.remove('expanded');

    if (onClick) {
      setTimeout(() => {
        onClick();
      }, 100);
    }
  };

  return (
    <Header
      $altura={configuracao.altura}
      $border={border}
      $corBorda={configuracao.corBorda}
      id={id ? `${id}_HEADER` : ''}
      className={`card-header shadow-sm rounded bg-white d-flex align-items-center ${
        show ? 'expanded' : ''
      } ${icon ? 'py-3' : 'py-4'} fonte-16`}
    >
      {children}
      {icon ? (
        <Link
          className="text-decoration-none ms-auto"
          data-bs-toggle="collapse"
          href={`#${indice}`}
          id={`expandir-retrair-${indice}`}
          role="button"
          aria-expanded={show && true}
          aria-controls={`${indice}`}
          onClick={handleHeader}
        >
          <Icon className="fa fa-chevron-down" aria-hidden="true" />
        </Link>
      ) : null}
    </Header>
  );
};

CardHeader.propTypes = {
  id: PropTypes.string,
  indice: PropTypes.string,
  children: PropTypes.node,
  border: PropTypes.bool,
  icon: PropTypes.bool,
  show: PropTypes.bool,
  onClick: PropTypes.oneOfType([PropTypes.func]),
  configuracao: PropTypes.oneOfType([PropTypes.any]),
};

CardHeader.defaultProps = {
  id: '',
  indice: shortid.generate(),
  children: () => {},
  onClick: () => {},
  border: false,
  icon: false,
  show: false,
  configuracao: {
    altura: 'auto',
    corBorda: Base.AzulBordaCard,
  },
};

export default CardHeader;
