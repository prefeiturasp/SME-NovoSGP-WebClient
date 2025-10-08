import React, { useState } from 'react';
import { Card } from 'antd';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function CardCollapseCustomized({
  titulo,
  children,
  show,
  onClick,
  configCabecalho = {},
}) {
  const [expanded, setExpanded] = useState(show);

  const toggle = () => {
    setExpanded(!expanded);
    if (onClick) onClick();
  };

  return (
    <Card
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '15px',
          }}
          onClick={toggle}
        >
          <span>{titulo}</span>
          {expanded ? (
            <FaChevronUp style={{ color: '#0076BE' }} />
          ) : (
            <FaChevronDown style={{ color: '#0076BE' }} />
          )}
        </div>
      }
      bordered
      style={{
        marginBottom: 12,
        borderRadius: 5,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
      }}
      headStyle={{
        backgroundColor: '#f5f5f5',
        padding: '8px 16px',
        height: configCabecalho?.altura || '44px',
      }}
      bodyStyle={{
        padding: expanded ? '16px' : '0',
        maxHeight: expanded ? '1000px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.4s ease, padding 0.4s ease',
      }}
    >
      {expanded && children}
    </Card>
  );
}
