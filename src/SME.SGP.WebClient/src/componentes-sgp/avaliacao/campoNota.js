// import PropTypes from 'prop-types';
// import React, { useEffect, useState } from 'react';
// import CampoTexto from '~/componentes/campoTexto';
// import { arredondarNota } from '~/utils';
// import TooltipStatusGsa from './tooltipStatusGsa';

// import LabelAusenteCellTable from '~/paginas/DiarioClasse/Listao/operacoes/listaoTabs/tabListaoAvaliacoes/componentes/labelAusenteCellTable';

// const CampoNota = props => {
//   const {
//     nota,
//     onChangeNotaConceito,
//     desabilitarCampo,
//     name,
//     dadosArredondamento,
//   } = props;

//   const [notaValorAtual, setNotaValorAtual] = useState();
//   // const [notaAlterada, setNotaAlterada] = useState(false);

//   // const validaSeTeveAlteracao = useCallback((notaOriginal, notaNova) => {
//   //   if (
//   //     notaOriginal !== undefined &&
//   //     notaOriginal != null &&
//   //     notaOriginal.trim() !== ''
//   //   ) {
//   //     setNotaAlterada(
//   //       Number(notaNova).toFixed(1) !== Number(notaOriginal).toFixed(1)
//   //     );
//   //   }
//   // }, []);

//   // const removerCaracteresInvalidos = texto => {
//   //   return texto.replace(/[^0-9,.]+/g, '');
//   // };

//   // const editouCampo = (notaOriginal, notaNova) => {
//   //   notaOriginal = removerCaracteresInvalidos(String(notaOriginal));
//   //   notaNova = removerCaracteresInvalidos(String(notaNova));
//   //   if (notaOriginal === '' && notaNova === '') {
//   //     return false;
//   //   }
//   //   return notaOriginal !== notaNova;
//   // };

//   useEffect(() => {
//     setNotaValorAtual(String(nota.notaConceito).replace('.', ','));
//     // validaSeTeveAlteracao(nota.notaOriginal, nota.notaConceito);
//   }, [nota.notaConceito]);

//   const setarValorNovo = valorNovo => {
//     if (!desabilitarCampo && nota.podeEditar) {
//       // validaSeTeveAlteracao(nota.notaOriginal, notaArredondada);
//       onChangeNotaConceito(valorNovo);
//       setNotaValorAtual(valorNovo);
//     }
//   };

//   const onBlur = valorNovo => {
//     if (!desabilitarCampo && nota.podeEditar) {
//       let notaArredondada = valorNovo;

//       if (valorNovo) {
//         notaArredondada = arredondarNota(valorNovo, dadosArredondamento);
//       }

//       // validaSeTeveAlteracao(nota.notaOriginal, notaArredondada);
//       onChangeNotaConceito(notaArredondada);
//       setNotaValorAtual(notaArredondada);
//     }
//   };

//   // const valorInvalido = valorNovo => {
//   //   const regexValorInvalido = /[^0-9,.]+/g;
//   //   return regexValorInvalido.test(String(valorNovo));
//   // };

//   // const apertarTecla = e => {
//   //   const teclaEscolhida = converterAcaoTecla(e.keyCode);
//   //   if (teclaEscolhida === 0 && !notaValorAtual) {
//   //     setarValorNovo(0);
//   //   }
//   // };

//   return (
//     <div
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//       }}
//     >
//       {/* <CampoTexto
//         name={name}
//         onChange={valorNovo => {
//           let valorEnviado = null;
//           if (valorNovo) {
//             const invalido = valorInvalido(valorNovo);
//             if (!invalido && editouCampo(notaValorAtual, valorNovo)) {
//               valorEnviado = valorNovo;
//             }
//           }
//           const valorCampo = valorNovo > 0 ? valorNovo : null;
//           setarValorNovo(valorEnviado || valorCampo);
//         }}
//         value={notaValorAtual}
//         //maxlength={3}
//         placeholder="Nota"
//         classNameCampo={`${nota.ausente ? 'aluno-ausente-notas' : ''}`}
//         desabilitado={desabilitarCampo || !nota.podeEditar}
//         className={`${notaAlterada ? 'border-registro-alterado' : ''}`}
//         somenteNumero
//       /> */}

//       <CampoTexto
//         id={name}
//         addMaskNota
//         maxLength={3}
//         allowClear={false}
//         placeholder="Nota"
//         value={String(notaValorAtual).replace('.', ',')}
//         onBlur={e => onBlur(e.target.value)}
//         desabilitado={desabilitarCampo || !nota.podeEditar}
//         onChange={(_, novaNota) => {
//           setarValorNovo(novaNota);
//         }}
//       />
//       {/* {nota?.ausente ? <TooltipEstudanteAusente /> : ''} */}
//       {nota?.ausente && <LabelAusenteCellTable />}
//       {nota?.statusGsa ? <TooltipStatusGsa /> : ''}
//     </div>
//   );
// };

// CampoNota.defaultProps = {
//   nota: '',
//   onChangeNotaConceito: () => {},
//   desabilitarCampo: false,
//   name: '',
//   dadosArredondamento: null,
// };

// CampoNota.propTypes = {
//   nota: PropTypes.oneOfType([PropTypes.any]),
//   dadosArredondamento: PropTypes.oneOfType([PropTypes.any]),
//   onChangeNotaConceito: PropTypes.func,
//   desabilitarCampo: PropTypes.bool,
//   name: PropTypes.string,
// };

// export default CampoNota;
