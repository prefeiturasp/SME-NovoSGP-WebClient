const { default: styled } = require("styled-components");

export function InformacaoAnosAnteriores() {
const ShapeContainer = styled.div`
   display: flex;
   align-items: center;
   padding: 8px;
   border-radius: 4px;
   background: #F5F5F5;
   margin-top: 16px;
   margin-bottom: 18px;
   
   .font-bold {
      font-weight: bold;
      margin-right: 4px;
   }
`;
   return (
      <ShapeContainer>
         <span className="font-bold">Atenção:</span>Se o ano escolhido não tiver dados, exibiremos automaticamente o mais recente disponível.
      </ShapeContainer>
   )
}