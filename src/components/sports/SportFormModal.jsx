import { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const initialForm = { name: '', objective: '', duration: '' }

export default function SportFormModal({ show, handleClose, handleSave, selectedSport }) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (selectedSport) {
      setFormData({
        name: selectedSport.name || '',
        objective: selectedSport.objective || '',
        duration: selectedSport.duration?.toString() || '',
      })
    } else {
      setFormData(initialForm)
    }
    setErrors({})
  }, [selectedSport, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!formData.name.trim() || formData.name.trim().length < 3) errs.name = 'El nombre debe tener al menos 3 caracteres.'
    if (!formData.objective.trim() || formData.objective.trim().length < 5) errs.objective = 'El objetivo debe tener al menos 5 caracteres.'
    if (!formData.duration || Number(formData.duration) < 1) errs.duration = 'La duracion debe ser un numero mayor a 0.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    handleSave({
      name: formData.name.trim(),
      objective: formData.objective.trim(),
      duration: parseInt(formData.duration, 10),
    })
  }

  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="bg-dark text-light">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title style={{ fontSize: '0.95rem', fontWeight: 700 }}>
          {selectedSport ? 'Editar Deporte' : 'Nuevo Deporte'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del deporte</Form.Label>
            <Form.Control
              size="sm"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. CrossFit"
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Objetivo</Form.Label>
            <Form.Control
              size="sm"
              as="textarea"
              rows={3}
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              placeholder="Describe el objetivo principal del deporte"
              isInvalid={!!errors.objective}
            />
            <Form.Control.Feedback type="invalid">{errors.objective}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-0">
            <Form.Label>Duracion (minutos)</Form.Label>
            <Form.Control
              size="sm"
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Ej. 60"
              min="1"
              isInvalid={!!errors.duration}
            />
            <Form.Control.Feedback type="invalid">{errors.duration}</Form.Control.Feedback>
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
