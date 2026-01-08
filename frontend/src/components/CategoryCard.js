import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const CategoryCard = ({ category }) => {
  return (
    <Card className="my-3 p-3 rounded" style={{ minHeight: '300px' }}>
      {category.image && (
        <Card.Img
          src={category.image}
          variant="top"
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title as="div">
          <strong>{category.name}</strong>
        </Card.Title>
        <Card.Text as="div" className="flex-grow-1">
          <p>{category.description}</p>
        </Card.Text>
        <LinkContainer to={`/category/${category.slug || category._id}`}>
          <Button variant="primary" block>
            Shop {category.name}
          </Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  )
}

export default CategoryCard
