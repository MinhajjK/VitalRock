import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
    alert("Thank you for subscribing to our newsletter!");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="organic-footer">
      <Container className="organic-footer-content">
        <Row>
          {/* About Section */}
          <Col lg={3} md={6} className="organic-footer-section">
            <h4 className="organic-footer-title">
              <i className="fas fa-leaf"></i>
              VitalRock
            </h4>
            <p className="organic-footer-description">
              Your trusted source for 100% certified organic products. We
              believe in sustainable living and bringing nature's best to your
              doorstep.
            </p>
            <div className="organic-footer-certifications">
              <div className="organic-footer-cert-badge">
                <i className="fas fa-certificate"></i>
                <span>USDA Organic</span>
              </div>
              <div className="organic-footer-cert-badge">
                <i className="fas fa-leaf"></i>
                <span>Non-GMO</span>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} className="organic-footer-section">
            <h4 className="organic-footer-title">Quick Links</h4>
            <ul className="organic-footer-links">
              <li>
                <Link to="/" className="organic-footer-link">
                  <i className="fas fa-chevron-right"></i>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="organic-footer-link">
                  <i className="fas fa-chevron-right"></i>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="organic-footer-link">
                  <i className="fas fa-chevron-right"></i>
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/blog" className="organic-footer-link">
                  <i className="fas fa-chevron-right"></i>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="organic-footer-link">
                  <i className="fas fa-chevron-right"></i>
                  Contact
                </Link>
              </li>
            </ul>
          </Col>

          {/* Customer Service */}
          <Col lg={3} md={6} className="organic-footer-section">
            <h4 className="organic-footer-title">Customer Service</h4>
            <ul className="organic-footer-links">
              <li>
                <Link to="/faq" className="organic-footer-link">
                  <i className="fas fa-chevron-right"></i>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="organic-footer-link">
                  <i className="fas fa-chevron-right"></i>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="organic-footer-link">
                  <i className="fas fa-chevron-right"></i>
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="organic-footer-link">
                  <i className="fas fa-chevron-right"></i>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="organic-footer-link">
                  <i className="fas fa-chevron-right"></i>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </Col>

          {/* Contact & Newsletter */}
          <Col lg={4} md={6} className="organic-footer-section">
            <h4 className="organic-footer-title">Get In Touch</h4>
            <ul className="organic-footer-contact">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Organic Street, Green City, EC 12345</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <a href="mailto:info@vitalrock.com">info@vitalrock.com</a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="organic-newsletter">
              <h5 className="organic-newsletter-title">
                <i className="fas fa-paper-plane"></i> Newsletter
              </h5>
              <p className="organic-newsletter-description">
                Subscribe for exclusive organic deals & wellness tips!
              </p>
              <form
                className="organic-newsletter-form"
                onSubmit={handleNewsletterSubmit}
              >
                <input
                  type="email"
                  className="organic-newsletter-input"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="organic-newsletter-btn">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>

            {/* Social Media */}
            <div className="organic-footer-social">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="organic-social-link facebook"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="organic-social-link twitter"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="organic-social-link instagram"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="organic-social-link pinterest"
                aria-label="Pinterest"
              >
                <i className="fab fa-pinterest-p"></i>
              </a>
            </div>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <div className="organic-footer-bottom">
          <div className="organic-payment-methods">
            <div className="organic-payment-icon">
              <i className="fab fa-cc-visa"></i>
            </div>
            <div className="organic-payment-icon">
              <i className="fab fa-cc-mastercard"></i>
            </div>
            <div className="organic-payment-icon">
              <i className="fab fa-cc-amex"></i>
            </div>
            <div className="organic-payment-icon">
              <i className="fab fa-cc-paypal"></i>
            </div>
          </div>

          <div className="organic-footer-bottom-links">
            <Link to="/privacy" className="organic-footer-bottom-link">
              Privacy Policy
            </Link>
            <Link to="/terms" className="organic-footer-bottom-link">
              Terms of Service
            </Link>
            <Link to="/sitemap" className="organic-footer-bottom-link">
              Sitemap
            </Link>
            <Link to="/accessibility" className="organic-footer-bottom-link">
              Accessibility
            </Link>
          </div>

          <p className="organic-footer-copyright">
            &copy; {currentYear} <Link to="/">VitalRock Organic Store</Link>.
            All rights reserved. Made with{" "}
            <i className="fas fa-heart" style={{ color: "#ff6b6b" }}></i> for a
            healthier planet.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
