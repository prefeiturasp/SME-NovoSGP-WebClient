import React from 'react';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';

import { JoditEditor } from '~/componentes';

const ConteudoCollapse = props => {
  const { planejamento, reflexoesReplanejamento } = props;

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col sm={24}>
          <JoditEditor
            id="editor-planejamento"
            name="planejamento"
            label="planejamento"
            value={planejamento}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col sm={24}>
          <JoditEditor
            valideClipboardHTML={false}
            id="editor-reflexoesReplanejamento"
            name="reflexoesReplanejamento"
            label="Reflexões e replanejamentos"
            value={reflexoesReplanejamento}
          />
        </Col>
      </Row>
    </>
  );
};

ConteudoCollapse.propTypes = {
  planejamento: PropTypes.string,
  reflexoesReplanejamento: PropTypes.string,
};

ConteudoCollapse.defaultProps = {
  planejamento: '',
  reflexoesReplanejamento: '',
};

export default ConteudoCollapse;
