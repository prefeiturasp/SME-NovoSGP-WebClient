# language: pt
Funcionalidade: Login

Background

  Esquema do Cenário: Validar login para o cenário "<cenario>"
    Dado que eu acesso o sistema com a visualização "<device>"
    E informo os dados nos campos "<usuario>" e "<senha>"
    Quando clico no botão de acessar
    Entao o sistema realiza validacao necessaria "<mensagem>" para o cenario "<cenario>"

    Exemplos:
    | usuario  | senha    | device | mensagem                                                   | cenario                        |
    #| 7924488  | SENHA  | web    | teste                                               | Usuario valido                 |
    | 3256563  | SENHA    | web    | Usuário e/ou senha inválida                                | Usuario invalido               |
    | 2440221  | admin    | web    | Usuário e/ou senha inválida                                | Senha invalida                 |
    | 1111111  | senhainv | web    | Usuário e/ou senha inválida                                | Usuario inexistente            |
    |          | SENHA    | web    | Você precisa informar um usuário e senha para acessar o sistema. | Usuario em branco        |
    | 0720610  |          | web    | Você precisa informar um usuário e senha para acessar o sistema. | Senha em branco          |
    | 1111     | SENHA    | web    | O usuário deve conter no mínimo 5 caracteres.              | Usuario menor que 5 caracteres |
    | 7238711  | 123      | web    | A senha deve conter no mínimo 4 caracteres.                | Senha menor que 4 caracteres   |

