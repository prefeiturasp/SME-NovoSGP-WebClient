import RelatorioDinamicoNAAPAConteudo from './relatorioDinamicoNAAPAConteudo';
import RelatorioDinamicoNAAPAContextProvider from './relatorioDinamicoNAAPAContextProvider';

const RelatorioDinamicoNAAPA = () => (
  <RelatorioDinamicoNAAPAContextProvider>
    <RelatorioDinamicoNAAPAConteudo />
  </RelatorioDinamicoNAAPAContextProvider>
);

export default RelatorioDinamicoNAAPA;
