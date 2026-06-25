import { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const initialForm = { name: '', email: '', password: '', role: 'User' }

export default function UserFormModal({ show, handleClose, handleSave, selectedUser }) {
  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        password: '',
        role: selectedUser.role || 'User',
      })
    } else {
      setFormData(initialForm)
    }
  }, [selectedUser, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    handleSave(formData)
  }

  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="bg-dark text-light">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title style={{ fontSize: '0.95rem', fontWeight: 700 }}>
          {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              size="sm"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              size="sm"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="juan@correo.com"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Contraseña{' '}
              {selectedUser && (
                <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.7rem' }}>
                  (dejar vacío para mantener)
                </span>
              )}
            </Form.Label>
            <Form.Control
              size="sm"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={selectedUser ? 'Nueva contraseña' : 'Mínimo 8 caracteres'}
              required={!selectedUser}
            />
          </Form.Group>

          <Form.Group className="mb-0">
            <Form.Label>Rol</Form.Label>
            <Form.Select size="sm" name="role" value={formData.role} onChange={handleChange}>
              <option value="User">Atleta</option>
              <option value="Coach">Coach</option>
              <option value="Admin">Admin</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant=""
            size="sm"
            style={{ color: 'var(--text-secondary)', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button variant="" size="sm" className="btn-gold" type="submit" style={{ fontSize: '0.8rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
