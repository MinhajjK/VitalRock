import React from 'react'
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap'

const CertificationBadge = ({ certification, size = 'sm' }) => {
  if (!certification) return null

  const tooltip = (
    <Tooltip id={`tooltip-${certification._id}`}>
      <strong>{certification.name}</strong>
      <br />
      {certification.description}
      <br />
      <small>Issued by: {certification.issuingAuthority}</small>
    </Tooltip>
  )

  return (
    <OverlayTrigger placement="top" overlay={tooltip}>
      <Badge
        variant={
          certification.type === 'Organic'
            ? 'success'
            : certification.type === 'Fair Trade'
            ? 'warning'
            : certification.type === 'Vegan'
            ? 'info'
            : 'secondary'
        }
        className="mr-1 mb-1"
        style={{ fontSize: size === 'sm' ? '0.7rem' : '0.85rem' }}
      >
        {certification.logo ? (
          <img
            src={certification.logo}
            alt={certification.name}
            style={{
              width: size === 'sm' ? '12px' : '16px',
              height: size === 'sm' ? '12px' : '16px',
              marginRight: '4px',
            }}
          />
        ) : null}
        {certification.name}
      </Badge>
    </OverlayTrigger>
  )
}

export default CertificationBadge
