import styled from 'styled-components';

export const ContainerTabsDashboardFrequencia = styled.div`
  .scrolling-chart {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;

    ::-webkit-scrollbar-track {
      background-color: #f4f4f4 !important;
    }

    ::-webkit-scrollbar {
      width: 4px !important;
      background-color: rgba(229, 237, 244, 0.71) !important;
      border-radius: 2.5px !important;
    }

    ::-webkit-scrollbar-thumb {
      background: #a8a8a8 !important;
      border-radius: 3px !important;
    }
  }
`;
