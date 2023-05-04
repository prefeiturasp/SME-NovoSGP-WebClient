import { Field } from 'formik';
import { Jodit } from 'jodit';
import 'jodit/build/jodit.min.css';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { store } from '~/redux';
import { erro } from '~/servicos/alertas';
import { urlBase } from '~/servicos/variaveis';
import { Base } from '../colors';
import Label from '../label';

const Campo = styled.div`
  .campo-invalido {
    .jodit-container {
      border-color: #dc3545 !important;
    }
  }
  .jodit-status-bar :nth-child(2) {
    display: none;
  }
`;

let CHANGE_DEBOUNCE_FLAG;
const TAMANHO_MAXIMO_UPLOAD_MB = 10;

const JoditEditor = forwardRef((props, ref) => {
  const {
    value,
    onChange,
    tabIndex,
    desabilitar,
    height,
    label,
    name,
    id,
    form,
    temErro,
    mensagemErro,
    validarSeTemErro,
    permiteInserirArquivo,
    readonly,
    removerToolbar,
    iframeStyle,
    disablePlugins,
    permiteVideo,
    qtdMaxImg,
    imagensCentralizadas,
    valideClipboardHTML,
    labelRequired,
  } = props;

  const textArea = useRef(null);

  const [url] = useState(urlBase);
  const { token } = store.getState().usuario;

  const [validacaoComErro, setValidacaoComErro] = useState(false);

  const BOTOES_PADRAO = !removerToolbar
    ? `bold,ul,ol,outdent,indent,font,fontsize,brush,paragraph,${
        permiteInserirArquivo ? 'file,' : ''
      }table,link,align,undo,redo`
    : '';

  const changeHandler = valor => {
    if (onChange) {
      onChange(valor);
    }
  };

  const excedeuLimiteMaximo = arquivo => {
    return Math.ceil(arquivo.size / 1048576) > TAMANHO_MAXIMO_UPLOAD_MB;
  };

  const exibirMsgMaximoImg = reject => {
    const msg = `Você pode inserir apenas ${qtdMaxImg} ${
      qtdMaxImg > 1 ? 'imagens' : 'imagem'
    }`;
    erro(msg);
    if (reject) {
      reject(new Error(msg));
    }
  };

  const exibirMensagemError = (msg, reject) => {
    erro(msg);

    if (reject) {
      reject(new Error(msg));
    }
  };

  const verificaSeTemSvg = e => {
    const dadosColadoTexto = e?.clipboardData?.getData?.('text');
    const dadosColadoHTML = e?.clipboardData?.getData?.('text/html');

    const temTagSvg =
      dadosColadoHTML?.match(/<svg/g) || dadosColadoTexto?.match(/<svg/g);

    if (temTagSvg) {
      erro('Não é possivel inserir código HTML com SVG.');
    }

    return temTagSvg;
  };

  const verificaSePodeInserirArquivo = e => {
    const dadosColadoTexto = e?.clipboardData?.getData?.('text');

    const temImagemNosDadosColados = [...e?.clipboardData?.files].filter(item =>
      item.type.includes('image')
    );

    const temVideoNosDadosColados = [...e?.clipboardData?.files].filter(item =>
      item.type.includes('video')
    );

    const spgURL = url.replace('/api', '');
    const qtdElementoImg = temImagemNosDadosColados.length;
    const qtdElementoVideo = temVideoNosDadosColados.length;

    if (!permiteInserirArquivo && (qtdElementoImg || qtdElementoVideo)) {
      e.preventDefault();
      e.stopPropagation();
      erro('Não é possível inserir arquivo');

      return false;
    }

    if (qtdElementoImg) {
      const regex = new RegExp(`<img[^>]*src=".*?${spgURL}/temp/.*?"[^>]*>`);
      const temImagemPastaTemporaria = dadosColadoHTML?.match(regex) || [];

      if (temImagemPastaTemporaria.length) {
        erro('Não é possível inserir este arquivo');
        return false;
      }
    }

    if (qtdElementoImg && qtdMaxImg) {
      const qtdElementoImgAtual =
        textArea?.current?.editorDocument?.querySelectorAll?.('img');
      const totalImg = qtdElementoImg + qtdElementoImgAtual?.length;

      if (totalImg > qtdMaxImg || dadosColadoTexto === '') {
        if (dadosColadoTexto !== '') {
          exibirMsgMaximoImg();
        }

        e.preventDefault();
        e.stopPropagation();

        return false;
      }
    } else if (qtdElementoImg && dadosColadoTexto === '') {
      return false;
    }

    return true;
  };

  const config = {
    events: {
      afterRemoveNode: node => {
        if (node.nodeName === 'IMG') {
          // TODO Aqui chamar endpoint para remover a imagem no servidor!
        }
      },
      validarSeTemErro: () => {
        if (validarSeTemErro) {
          const texto = textArea?.current?.text?.trim();
          let valorParaValidar = '';

          if (
            !texto ||
            (permiteVideo && textArea.current.value.includes('<video')) ||
            textArea.current.value.includes('<img')
          ) {
            valorParaValidar = textArea.current.value;
          } else if (texto) {
            valorParaValidar = texto;
          }
          setValidacaoComErro(validarSeTemErro(valorParaValidar));
        }
      },
    },
    countHTMLChars: false,
    askBeforePasteHTML: valideClipboardHTML,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html',
    disablePlugins: ['image-properties', disablePlugins],
    language: 'pt_br',
    height,
    readonly: readonly || desabilitar,
    enableDragAndDropFileToEditor: true,
    uploader: {
      buildData: data => {
        return new Promise((resolve, reject) => {
          if (permiteInserirArquivo) {
            const arquivo = data.getAll('files[0]')[0];

            const tiposValidos = ['jpg', 'jpeg', 'png'];

            const ehImagem = arquivo.type.substring(0, 5) === 'image';
            const ehVideo = arquivo.type.substring(0, 5) === 'video';
            const ehValido = tiposValidos.some(x => arquivo.type.includes(x));

            if (excedeuLimiteMaximo(arquivo)) {
              const msg = `Tamanho máximo ${TAMANHO_MAXIMO_UPLOAD_MB}MB.`;
              exibirMensagemError(msg, reject);
            }

            if ((ehImagem && ehValido) || (ehVideo && permiteVideo)) {
              if (ehImagem && qtdMaxImg) {
                const quantidadeTotalImagens = (
                  textArea?.current?.value?.match(/<img/g) || []
                )?.length;

                if (quantidadeTotalImagens < qtdMaxImg) {
                  resolve(data);
                } else {
                  exibirMsgMaximoImg(reject);
                }
              } else {
                resolve(data);
              }
            } else {
              const formato = arquivo.type.split('/').pop().replace('+xml', '');

              const msg = `O formato .${formato} não é valido.`;

              exibirMensagemError(msg, reject);
            }
          } else {
            reject(new Error('Não é possível inserir arquivo'));
          }
        });
      },
      url: `${url}/v1/arquivos/upload`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      isSuccess: resp => resp,
      process: resp => {
        return {
          files: resp.data.files,
          path: resp.data.path,
          baseurl: resp.data.baseurl,
          error: resp.data.error,
          message: resp.data.message,
          contentType: resp.data.contentType,
        };
      },
      defaultHandlerSuccess: dados => {
        if (dados?.path) {
          if (dados.contentType.startsWith('video')) {
            textArea.current.selection.insertHTML(
              `<video width="600" height="240" controls><source src="${dados.path}"></video>`
            );
          } else {
            textArea.current.selection.insertHTML(
              `<img src="${
                dados.path
              }" style="max-width: 100%; max-height: 700px; object-fit: cover; object-position: bottom; ${
                imagensCentralizadas ? 'display: block; margin: auto;' : ''
              }"/>`
            );
          }
        }
      },
    },
    iframe: true,
    spellcheck: true,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    buttons: BOTOES_PADRAO,
    buttonsXS: BOTOES_PADRAO,
    buttonsMD: BOTOES_PADRAO,
    buttonsSM: BOTOES_PADRAO,
    placeholder: '',
    style: {
      font: '16px Arial',
      overflow: 'none',
    },
    iframeStyle: `${iframeStyle} img{max-width: 100%;max-height: 700px;object-fit: cover;}`,
  };

  const onChangePadrao = () => {
    const texto = textArea?.current?.text?.trim();
    const temImagemOuVideo =
      (permiteVideo && textArea?.current?.value?.includes('<video')) ||
      textArea?.current?.value?.includes('<img');

    if (validarSeTemErro) {
      let valorParaValidar = '';

      if (temImagemOuVideo) {
        valorParaValidar = textArea.current.value;
      } else if (texto) {
        valorParaValidar = texto;
      }

      setValidacaoComErro(validarSeTemErro(valorParaValidar, texto));
    }

    if (texto || temImagemOuVideo) {
      changeHandler(textArea.current.value);
    } else {
      changeHandler('');
    }
  };

  const onChangeComForm = () => {
    const texto = textArea?.current?.text?.trim();
    let valorAtual = '';

    if (
      texto ||
      (permiteVideo && textArea?.current?.value?.includes('<video')) ||
      textArea?.current?.value?.includes('<img')
    ) {
      valorAtual = textArea.current.value;
    }

    changeHandler(valorAtual);
    form.setFieldValue(name, valorAtual);
    form.setFieldTouched(name, true, true);
  };

  const bloquearTraducaoNavegador = () => {
    const isEdge = navigator?.userAgent?.indexOf?.('Edg') !== -1;
    if (isEdge && textArea?.current) {
      const elementTextArea =
        textArea?.current?.editorDocument?.getElementsByClassName('jodit')?.[0];

      const elementBodyTextArea = elementTextArea
        ? elementTextArea.getElementsByTagName('body')[0]
        : null;
      if (elementBodyTextArea) {
        const childrens = elementBodyTextArea?.children;

        if (childrens?.length) {
          for (let index = 0; index < childrens.length; index++) {
            childrens[index].className = 'notranslate';
          }
        }
      }
    }
  };

  const beforeOnChange = () => {
    bloquearTraducaoNavegador();

    if (textArea?.current?.editorIsActive) {
      if (CHANGE_DEBOUNCE_FLAG) clearTimeout(CHANGE_DEBOUNCE_FLAG);

      CHANGE_DEBOUNCE_FLAG = setTimeout(() => {
        if (form) {
          onChangeComForm();
        } else {
          onChangePadrao();
        }
      }, 300);
    }
  };

  useEffect(() => {
    const pegarElemento = elemento => document.getElementsByClassName(elemento);
    const aplicarDisplayNone = elemento => {
      if (elemento?.length) {
        elemento[0].style.cssText = 'display: none !important';
      }
    };

    const removerBotoes = () => {
      const botaoEditarImagem = pegarElemento('jodit-toolbar-button_pencil');
      const botaoSetas = pegarElemento('jodit-toolbar-button_valign');

      aplicarDisplayNone(botaoEditarImagem);
      aplicarDisplayNone(botaoSetas);
    };

    document.body.addEventListener('DOMSubtreeModified', removerBotoes);

    return () => {
      document.body.removeEventListener('DOMSubtreeModified', removerBotoes);
    };
  });

  useEffect(() => {
    return () => {
      if (textArea?.current?.destruct) {
        textArea.current.destruct();
      }
    };
  }, [textArea]);

  useEffect(() => {
    if (url) {
      const element = textArea.current || '';
      if (textArea?.current && config) {
        if (textArea?.current?.type === 'textarea') {
          textArea.current = Jodit.make(element, config);
          const elementTextArea =
            textArea?.current?.editorDocument?.getElementsByClassName(
              'jodit'
            )?.[0];

          if (elementTextArea?.style) {
            elementTextArea.style.cssText = 'overflow: auto;';
          }

          if (elementTextArea) {
            elementTextArea.translate = false;
            elementTextArea.className = `${elementTextArea.className} notranslate`;
          }

          if (ref) {
            if (typeof ref === 'function') {
              ref(textArea.current);
            } else {
              ref.current = textArea.current;
            }
          }

          textArea.current.events.on('beforePaste', e => {
            if (verificaSeTemSvg(e) || !verificaSePodeInserirArquivo(e)) {
              return false;
            }

            return true;
          });

          textArea.current.events.on('change', () => {
            beforeOnChange();
          });

          textArea.current.workplace.tabIndex = tabIndex;
        }
      }
    }
  }, [url]);

  useEffect(() => {
    if (textArea && textArea.current) {
      textArea.current.value = value;
      bloquearTraducaoNavegador();
    }
  }, [textArea, value]);

  useEffect(() => {
    if (config && textArea?.current && textArea?.current?.type !== 'textarea') {
      textArea.current.setReadOnly(desabilitar);
    }
  }, [desabilitar]);

  const possuiErro = () => {
    return (
      (form && form.errors[name] && form.touched[name]) ||
      temErro ||
      validacaoComErro
    );
  };

  const editorComValidacoes = () => {
    return (
      <Campo>
        <div
          className={validacaoComErro || possuiErro() ? 'campo-invalido' : ''}
        >
          <Field name={name} id={id} value={value}>
            {() => (
              <textarea ref={textArea} hidden={!textArea?.current?.isJodit} />
            )}
          </Field>
        </div>
      </Campo>
    );
  };

  const editorSemValidacoes = () => {
    return (
      <Campo>
        <div
          className={validacaoComErro || possuiErro() ? 'campo-invalido' : ''}
        >
          <textarea
            ref={textArea}
            id={id}
            hidden={!textArea?.current?.isJodit}
            value={value || undefined}
            onChange={e => e}
          />
        </div>
      </Campo>
    );
  };

  const obterErros = () => {
    return (form && form.touched[name] && form.errors[name]) ||
      temErro ||
      validacaoComErro ? (
      <span style={{ color: `${Base.Vermelho}` }}>
        {(form && form.errors[name]) || mensagemErro}
      </span>
    ) : (
      ''
    );
  };

  return (
    <>
      {label ? <Label text={label} isRequired={labelRequired} /> : ''}
      {form ? editorComValidacoes() : editorSemValidacoes()}
      {obterErros()}
    </>
  );
});

JoditEditor.propTypes = {
  value: PropTypes.string,
  tabIndex: PropTypes.number,
  onChange: PropTypes.func,
  desabilitar: PropTypes.bool,
  height: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  form: PropTypes.oneOfType([PropTypes.any]),
  temErro: PropTypes.bool,
  mensagemErro: PropTypes.string,
  validarSeTemErro: PropTypes.func,
  permiteInserirArquivo: PropTypes.bool,
  readonly: PropTypes.bool,
  removerToolbar: PropTypes.bool,
  iframeStyle: PropTypes.string,
  disablePlugins: PropTypes.string,
  permiteVideo: PropTypes.bool,
  qtdMaxImg: PropTypes.number,
  imagensCentralizadas: PropTypes.bool,
  valideClipboardHTML: PropTypes.bool,
  labelRequired: PropTypes.bool,
};

JoditEditor.defaultProps = {
  value: '',
  tabIndex: -1,
  onChange: null,
  desabilitar: false,
  height: 'auto',
  label: '',
  name: '',
  id: 'editor',
  form: null,
  temErro: false,
  mensagemErro: '',
  validarSeTemErro: null,
  permiteInserirArquivo: true,
  readonly: false,
  removerToolbar: false,
  iframeStyle: '',
  disablePlugins: '',
  permiteVideo: true,
  qtdMaxImg: null,
  imagensCentralizadas: false,
  valideClipboardHTML: false,
  labelRequired: false,
};

export default JoditEditor;
