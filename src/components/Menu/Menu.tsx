import React from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

type Props = {}

const Menu = (props: Props) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="p-1">
    <Container>
      <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link>
            {' '}
            <Link className="text-decoration-none text-white" to="/">
              Home
            </Link>
          </Nav.Link>
          <Nav.Link>
            {' '}
            <Link className="text-decoration-none text-white" to="/about">
              About
            </Link>
          </Nav.Link>
          <Nav.Link>
            {' '}
            <Link className="text-decoration-none text-white" to="/contact">
              Contact Us
            </Link>
          </Nav.Link>
        </Nav>
        <Nav className="gap-2">
          <Nav.Link className="btn btn-primary" href="#">Login</Nav.Link>
          <Nav.Link eventKey={2} className="btn btn-light text-black" href="#">
            Sign up
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}
export default Menu;