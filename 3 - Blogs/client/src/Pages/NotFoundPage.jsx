
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa'

function NotFoundPage() {
  return (
    <>
      <section class="error-container">
        <FaExclamationTriangle class="fa fa-exclamation-triangle error-icon"></FaExclamationTriangle>
        <h1 class="error-title">404 Not Found</h1>
        <p class="error-message">This page does not exist</p>
        <a href="/" class="error-button">Go Back</a>
      </section>
    </>
  )
}

export default NotFoundPage