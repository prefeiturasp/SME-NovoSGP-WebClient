import { createGlobalStyle } from 'styled-components';
import ExclamacaoCampoErro from '~/recursos/ExclamacaoCampoErro.svg';
import { Base } from '../componentes/colors';

export default createGlobalStyle`

  @media screen and (min-width: 768px) {
    .ant-layout.ant-layout-has-sider .ant-layout {
      margin-left: 88px !important;
    }
  }


  *, *:before, *:after {
    box-sizing: border-box;
    margin: 0;
    outline: 0;
    padding: 0;
  }
  *:focus {
    box-shadow: none;
  }
  html, body, #root {
    font-family: 'Roboto', sans-serif !important;
    font-stretch: normal;
    height: 100%;
    letter-spacing: normal;
    line-height: normal;
    @media (max-width: 768px) {
      height: auto;

      #sider-menu-button-toggle {
        height: 140px !important;
      }
    }
  }
  body {
    -webkit-font-smoothing: antialiased;
    background: ${Base.CinzaFundo} !important;
    overflow-x: hidden;
  }
  button {
    cursor: pointer;
  }
  .fonte-10 {
    font-size: 10px !important;
  }
  .fonte-12 {
    font-size: 12px !important;
  }
  .fonte-13 {
    font-size: 13px !important;
  }
  .fonte-14 {
    font-size: 14px !important;
  }
  .fonte-16 {
    font-size: 16px !important;
  }

  .ant-calendar-picker-container {
    z-index: 9999 !important;
  }

  .ant-select-dropdown {
    z-index: 9999 !important;
  }

  .ant-modal, .ant-modal-wrap {
    z-index: 9999 !important;
  }

  .ant-dropdown {
    z-index: 10000 !important;
  }

  .ant-select-dropdown-menu-item:hover {
    background-color: ${Base.Roxo}  !important;
    color: #ffffff;
  }

  .ant-select-dropdown-menu-item-selected {
    background-color:  ${Base.Roxo}  !important;
    color: #ffffff !important;
  }

  /* Antd V5 Start */

  .ant-select-item-option:hover  {
    background-color:  ${Base.Roxo} !important;
  }

  .ant-select-item-option-active {
    background-color:  ${Base.Branco} !important;
  }

  .ant-select {
    width: 100%;
  }

  .ant-select-item:hover {
    color: #ffffff !important;
  }

  .ant-select-item {
    -webkit-transition: none !important;
    transition: none !important;
    border-radius: 0px !important;

    .anticon-check {
      color: white !important;
    }
  }

  .ant-select-item-option-selected {
    color: #ffffff !important;
    background-color:  ${Base.Roxo} !important;
  }

  .ant-select-selection {
    outline: none;
    display: block;
    user-select: none;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    transition: all .3s cubic-bezier(.645,.045,.355,1);
  }

  .ant-select-selection-item {
    font-weight: bold !important;
    color: rgba(0, 0, 0, 0.65);
  }

  .ant-select-disabled .ant-select-selection-item {
    color: rgba(0, 0, 0, 0.25) !important;
  }

  .ant-select-clear {
    top: 50% !important;
    font-size: 15px !important;
  }

  .ant-picker {
    height: 38px;
    width: 100%;
  }

  .ant-picker-dropdown  {
    z-index: 9999 !important;

    .ant-picker-cell {
      padding: 3px 0 !important;
    }
  }

  .ant-picker-cell-selected .ant-picker-cell-inner {
    background: #086397 !important;
    color: #ffffff;
  }

  .ant-picker-cell-inner {
    -webkit-transition: none;
    transition: none;
  }

  .ant-picker-cell-in-view:hover{
    .ant-picker-cell-inner {
      background: #086397 !important;
      color: #ffffff !important;
    }
  }

  .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner {
    ::before {
      border: 0 !important;
    }
    color: #bdbdbd;
    font-weight: 100;
  }

  .ant-picker-header-view button:hover {
    color: #086397 !important;
  }

  .ant-picker-dropdown .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner {
    background: #086397 !important;
    color: #ffffff !important;
  }

  .ant-picker-dropdown .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner {
    background: #086397 !important;
    color: #ffffff !important;
  }

  .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td.ant-table-cell-scrollbar {
    background: ${Base.CinzaTabela} !important;
  }

  .ant-pagination {
    display: flex;
    align-items: center !important;
    justify-content: center !important;
  }

  .ant-pagination-item {
    a {
      font-family: Roboto;
      font-style: normal;
      font-stretch: normal;
      font-weight: bold;
      letter-spacing: normal;
    }

    border-radius: 0 !important;
    height: 45px !important;
    line-height: 45px !important;
    margin: 0 !important;
    min-width: 45px !important;
    border: solid 1px ${Base.CinzaDesabilitado} !important;
  }

  .ant-pagination-prev {
    border-radius: 4px 0px 0px 4px !important;
    border-right: none !important;
    height: 45px !important;
    line-height: 40px  !important;
    margin: 0 !important;
    min-width: 45px !important;
    border: solid 1px ${Base.CinzaDesabilitado} !important;
  }

  .ant-pagination-next {
    border-radius: 0px 4px 4px 0px !important;
    border-left: none !important;
    height: 45px !important;
    line-height: 40px !important;
    margin: 0 !important;
    min-width: 45px !important;
    border: solid 1px ${Base.CinzaDesabilitado} !important;
  }

  .ant-pagination-item-active {
    background: ${Base.Roxo} !important;
    border-color: ${Base.Roxo} !important;
    color: ${Base.Branco} !important;
    font-size: 12px !important;
  }

  .ant-pagination-item-active a {
    color: ${Base.Branco} !important;
  }

  .ant-pagination-item-active:focus,
  .ant-pagination-item-active:hover {
    border-color: ${Base.Roxo} !important;
  }

  .ant-pagination-item-active:focus a,
  .ant-pagination-item-active:hover a {
    color: ${Base.Branco} !important;
  }

  .ant-pagination-options {
    margin-inline-start: 16px !important;

    .ant-select-selector {
      height: 38px !important;
      align-items: center !important;
    }
  }

  .ant-form-item-label {
    font-weight: 700;
  }

  .ant-segmented-item {
    margin-bottom: 0;
  }

  /* Antd V5 End */

  .ant-select-dropdown-menu-item  {
    -webkit-transition: none !important;
    transition: none !important;
  }

  .ant-select-selected-icon {
    color: white !important;
  }

  .ant-select .ant-select-clear {
    top: 45% !important;
    width: 20px !important;
    inset-inline-end: 8px !important;
  }

  /* Bootstrap 4 compatibility layer during incremental Bootstrap 5 migration */
  .row {
    margin-right: -15px;
    margin-left: -15px;
  }

  .row > .col,
  .row > [class*='col-'] {
    padding-right: 15px;
    padding-left: 15px;
  }

  .form-row {
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
  }

  .form-row > .col,
  .form-row > [class*='col-'] {
    padding-right: 15px;
    padding-left: 15px;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group > label,
  .form-group .col-form-label,
  .form-label {
    margin-bottom: 0.5rem;
  }

  .card-header {
    padding: 0.75rem 1.25rem;
  }

  .card-body {
    padding: 1.25rem;
  }

  .card-footer {
    padding: 0.75rem 1.25rem;
  }

  .table {
    width: 100%;
    margin-bottom: 1rem;
    color: #212529;
    border-collapse: collapse;
  }

  .table th,
  .table td {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
  }

  .table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
  }

  .badge-pill {
    border-radius: 10rem;
  }

  .font-weight-light {
    font-weight: 300 !important;
  }

  .font-weight-bold {
    font-weight: 700 !important;
  }

  .justify-content-left {
    justify-content: flex-start !important;
  }

  .text-left {
    text-align: left !important;
  }

  .text-right {
    text-align: right !important;
  }

  .float-left {
    float: left !important;
  }

  .float-right {
    float: right !important;
  }

  .btn-block {
    display: block;
    width: 100%;
  }

  .ml-auto {
    margin-left: auto !important;
  }

  .mr-auto {
    margin-right: auto !important;
  }

  .ml-0 { margin-left: 0 !important; }
  .ml-1 { margin-left: 0.25rem !important; }
  .ml-2 { margin-left: 0.5rem !important; }
  .ml-3 { margin-left: 1rem !important; }
  .ml-4 { margin-left: 1.5rem !important; }
  .ml-5 { margin-left: 3rem !important; }

  .mr-0 { margin-right: 0 !important; }
  .mr-1 { margin-right: 0.25rem !important; }
  .mr-2 { margin-right: 0.5rem !important; }
  .mr-3 { margin-right: 1rem !important; }
  .mr-4 { margin-right: 1.5rem !important; }
  .mr-5 { margin-right: 3rem !important; }

  .pl-0 { padding-left: 0 !important; }
  .pl-1 { padding-left: 0.25rem !important; }
  .pl-2 { padding-left: 0.5rem !important; }
  .pl-3 { padding-left: 1rem !important; }
  .pl-4 { padding-left: 1.5rem !important; }
  .pl-5 { padding-left: 3rem !important; }

  .pr-0 { padding-right: 0 !important; }
  .pr-1 { padding-right: 0.25rem !important; }
  .pr-2 { padding-right: 0.5rem !important; }
  .pr-3 { padding-right: 1rem !important; }
  .pr-4 { padding-right: 1.5rem !important; }
  .pr-5 { padding-right: 3rem !important; }

  .ml-n1 { margin-left: -0.25rem !important; }
  .ml-n2 { margin-left: -0.5rem !important; }
  .ml-n3 { margin-left: -1rem !important; }
  .ml-n4 { margin-left: -1.5rem !important; }
  .ml-n5 { margin-left: -3rem !important; }

  .mr-n1 { margin-right: -0.25rem !important; }
  .mr-n2 { margin-right: -0.5rem !important; }
  .mr-n3 { margin-right: -1rem !important; }
  .mr-n4 { margin-right: -1.5rem !important; }
  .mr-n5 { margin-right: -3rem !important; }

  .qa-ajuste-registro-poa form,
  .qa-ajuste-atribuicao-cj form,
  .qa-ajuste-atribuicao-esporadica form {
    padding-left: 0;
    padding-right: 0;
  }

  .qa-ajuste-registro-poa .row,
  .qa-ajuste-atribuicao-cj .row,
  .qa-ajuste-atribuicao-esporadica .row {
    margin-left: 0;
    margin-right: 0;
    align-items: flex-end;
  }

  .qa-ajuste-registro-poa .row > [class*='col-'],
  .qa-ajuste-atribuicao-cj .row > [class*='col-'],
  .qa-ajuste-atribuicao-esporadica .row > [class*='col-'] {
    padding-left: 8px;
    padding-right: 8px;
  }

  .qa-ajuste-registro-poa .row > [class*='col-']:first-child,
  .qa-ajuste-atribuicao-cj .row > [class*='col-']:first-child,
  .qa-ajuste-atribuicao-esporadica .row > [class*='col-']:first-child {
    padding-left: 0;
  }

  .qa-ajuste-registro-poa .row > [class*='col-']:last-child,
  .qa-ajuste-atribuicao-cj .row > [class*='col-']:last-child,
  .qa-ajuste-atribuicao-esporadica .row > [class*='col-']:last-child {
    padding-right: 0;
  }

  .qa-ajuste-plano-aee .ant-table-thead > tr > th {
    vertical-align: middle !important;
    line-height: 1.2;
  }

  .qa-ajuste-registro-itinerancia .row {
    margin-left: 0;
    margin-right: 0;
  }

  .qa-ajuste-registro-itinerancia .row > [class*='col-'] {
    padding-left: 8px;
    padding-right: 8px;
  }

  .qa-ajuste-registro-itinerancia .row > [class*='col-']:first-child {
    padding-left: 0;
  }

  .qa-ajuste-registro-itinerancia .row > [class*='col-']:last-child {
    padding-right: 0;
  }

  .desabilitar-elemento {
    pointer-events: none !important;
    opacity: 0.6 !important;
  }

  .ant-input-clear-icon span {
    color: rgba(0, 0, 0, 0.25) !important;
  }

  @media (max-width: 544px) {

    .hidden-xs-down{
      display: none !important;
    }

   }

  .p-l-5{
    padding-left: 5px !important;
  }

  .p-r-5{
    padding-right: 5px !important;
  }

  .m-r-10{
    margin-right: 10px !important;
  }

  .p-r-20{
    padding-right: 20px !important;
  }

  .p-r-11{
    padding-right: 11px !important;
  }

  .p-l-20{
    padding-left: 20px !important;
  }

  .p-b-20{
    padding-bottom: 20px !important;
  }

  .p-t-24{
    padding-top: 24px !important;
  }

  .p-t-20{
    padding-top: 20px !important;
  }

  .p-r-8{
    padding-right: 8px !important;
  }

  .p-l-8{
    padding-left: 8px !important;
  }

  .m-t-10{
    margin-top: 10px !important;
  }

  .m-b-10{
    margin-bottom: 10px !important;
  }

  .m-r-0{
    margin-right: 0px !important;
  }

  .m-l-0{
    margin-left: 0px !important;
  }

  .m-t-0{
    margin-top: 0px !important;
  }

  .m-b-0{
    margin-bottom: 0px !important;
  }

  .p-r-0{
    padding-right: 0px !important;
  }

  .p-l-0{
    padding-left: 0px !important;
  }

  .p-t-0{
    padding-top: 0px !important;
  }

  .p-b-0{
    padding-bottom: 0px !important;
  }

  .p-r-10{
    padding-right: 10px !important;
  }

  .p-l-10{
    padding-left: 10px !important;
  }

  .m-b-20{
    margin-bottom: 20px !important;
  }

  .border-vermelhoAlerta{
    border-color: ${Base.VermelhoAlerta} !important;
  }

  .border-2{
    border-width: 2px !important;
  }

  .border-radius-4{
    border-radius: 4px !important;
  }

  .mb-6 {
    margin-bottom: 6rem !important;
  }


  .texto-vermelho {
    color: #b40c02 !important;
  }


  .texto-vermelho-negrito {
    color: #b40c02 !important;
    font-weight: bold !important;
  }

  .cor-novo-registro-lista {
    font-weight: bold !important;
    color: #42474a !important;
  }

  .ant-modal-footer {
    border-top: 0px !important;
    display: flex !important;
    justify-content: flex-end !important;
  }

  form{
    width:100%;
  }

  .desabilitado{
    background: transparent !important;
    border-color: ${Base.CinzaDesabilitado} !important;
    color: ${Base.CinzaDesabilitado} !important;
    cursor: unset !important;
  }

  .form-control.is-invalid, .was-validated .form-control:invalid{
    background-image : url(${ExclamacaoCampoErro}) !important;
    background-size: auto !important;
  }

  .ck-editor__editable_inline {
    min-height: 180px !important;
    list-style-position: inside;
    color:black;
  }

  .erro{
    color: ${Base.Vermelho}
  }

  .secao-conteudo{
    padding-top: 16px;
  }

 ination-item-active a:hover{
    color:#1890ff
  }

  .ant-notification {
    z-index: 99999 !important;
    top: 85px !important;
    width: 30% !important;
  }

  .alerta-sucesso {
    color: #155724 !important;
    background-color: #d4edda !important;
    border: 1px solid #155724 !important;

    .ant-notification-notice-message {
      color: #155724 !important;
    }
  }

  .alerta-aviso {
    color: #856404 !important;
    background-color: #fff3cd !important;
    border: 1px solid #856404 !important;

    .ant-notification-notice-message {
      color: #856404 !important;
    }
  }

  .alerta-erro {
    color: #721c24 !important;
    background-color: #f8d7da !important;
    border:1px solid #721c24 !important;

    .ant-notification-notice-message {
      color: #721c24 !important;
    }
  }

  .ant-tooltip {
    z-index: 999999 !important;
  }

  .ant-time-picker-panel {
    z-index: 999999 !important;
  }

  .ant-tooltip-inner-286 {
    .ant-tooltip-inner {
      min-width: 286px !important;
    }
  }

  a:not([href]),
  a:not([href]):hover {
    color: inherit;
    text-decoration: none;
  }

`;
