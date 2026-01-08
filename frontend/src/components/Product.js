import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Badge } from 'react-bootstrap'
import Rating from './Rating'
import CertificationBadge from './CertificationBadge'

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <div style={{ position: 'relative' }}>
        <Link to={`/product/${product._id}`}>
          <Card.Img src={product.image} variant='top' />
        </Link>
        {product.isFeatured && (
          <Badge
            variant="success"
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '0.7rem',
            }}
          >
            Featured
          </Badge>
        )}
        {product.isNewArrival && (
          <Badge
            variant="info"
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              fontSize: '0.7rem',
            }}
          >
            New
          </Badge>
        )}
      </div>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div' style={{ minHeight: '20px' }}>
          {product.isOrganic && (
            <Badge variant="success" className="mr-1 mb-1" style={{ fontSize: '0.7rem' }}>
              Organic
            </Badge>
          )}
          {product.isVegan && (
            <Badge variant="info" className="mr-1 mb-1" style={{ fontSize: '0.7rem' }}>
              Vegan
            </Badge>
          )}
          {product.isGlutenFree && (
            <Badge variant="warning" className="mr-1 mb-1" style={{ fontSize: '0.7rem' }}>
              Gluten-Free
            </Badge>
          )}
          {product.certifications &&
            product.certifications.length > 0 &&
            product.certifications.map((cert) => (
              <CertificationBadge
                key={cert._id || cert}
                certification={typeof cert === 'object' ? cert : null}
                size="sm"
              />
            ))}
        </Card.Text>

        {product.origin && (
          <Card.Text as='div' style={{ fontSize: '0.85rem', color: '#666' }}>
            <small>📍 {product.origin}</small>
          </Card.Text>
        )}

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h3'>
          ${product.price}
          {product.pricePerUnit > 0 && (
            <small className="text-muted" style={{ fontSize: '0.7rem', marginLeft: '5px' }}>
              / {product.weight}
              {product.unit}
            </small>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
