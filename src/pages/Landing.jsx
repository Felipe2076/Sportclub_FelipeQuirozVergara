import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'

const benefits = [
  { icon: '🏋️', title: 'Entrenamiento personalizado', desc: 'Supera tus límites con coaches expertos que diseñan rutinas para tu nivel y objetivo.' },
  { icon: '📋', title: 'Planes a tu medida', desc: 'Cada cuerpo es único, tu rutina también. Programas adaptados a tu disponibilidad y meta.' },
  { icon: '👥', title: 'Comunidad activa', desc: 'Entrena en equipo, crece como atleta. Motivación y apoyo de una comunidad que empuja hacia arriba.' },
  { icon: '🥗', title: 'Nutrición deportiva', desc: 'Combina ejercicio con alimentación inteligente. Planes nutricionales para potenciar tu rendimiento.' },
  { icon: '📱', title: 'Seguimiento digital', desc: 'Tu progreso siempre al alcance. Estadísticas, reservas y evolución desde cualquier dispositivo.' },
  { icon: '🏆', title: 'Metas reales', desc: 'Resultados que se ven y se sienten. Te acompañamos hasta alcanzar cada objetivo que te propongas.' },
]

const quotes = [
  { text: 'El dolor es temporal. Rendirse dura para siempre.', author: 'Lance Armstrong' },
  { text: 'No cuentes los días, haz que los días cuenten.', author: 'Muhammad Ali' },
  { text: 'El éxito no es la clave de la felicidad. La felicidad es la clave del éxito.', author: 'Albert Schweitzer' },
]

export default function Landing() {
  return (
    <div style={{ background: '#120e24', minHeight: '100vh' }}>
      {/* === NAVBAR === */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(18,14,36,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(240,192,64,0.08)', padding: '0.7rem 0',
      }}>
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <img src="/logo-icon.svg" alt="SportClub" height="32" />
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--gold)', letterSpacing: 1 }}>SPORTCLUB</span>
            </div>
            <div className="d-flex gap-2">
              <Link to="/login"><Button variant="" className="btn-gold btn-sm" style={{ fontSize: '0.8rem' }}>Iniciar sesión</Button></Link>
              <Link to="/register"><Button variant="" className="btn-outline-gold btn-sm" style={{ fontSize: '0.8rem' }}>Crear cuenta</Button></Link>
            </div>
          </div>
        </Container>
      </nav>

      {/* === HERO === */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        background: `linear-gradient(135deg, rgba(18,14,36,0.92), rgba(42,24,96,0.75)), url('/gym-interior.jpg')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        paddingTop: 80,
      }}>
        <Container>
          <Row className="align-items-center">
            <Col md={7}>
              <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.15, color: '#e8e0f4' }}>
                Tu mejor versión<br />
                <span style={{ color: 'var(--gold)' }}>comienza hoy</span>
              </h1>
              <p style={{ color: '#b8aad0', fontSize: '1.1rem', margin: '1.5rem 0', lineHeight: 1.6, maxWidth: 520 }}>
                SportClub es más que un gimnasio. Es una comunidad de atletas, coaches y 
                profesionales que trabajan juntos para transformar tu cuerpo y tu mente.
              </p>
              <div className="d-flex gap-3">
                <Link to="/register"><Button variant="" className="btn-gold" style={{ padding: '0.7rem 2rem' }}>Comienza ahora</Button></Link>
                <Link to="/login"><Button variant="" className="btn-outline-gold" style={{ padding: '0.7rem 2rem' }}>Ya soy miembro</Button></Link>
              </div>
              <div className="d-flex gap-4 mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span>🏆 +500 atletas</span>
                <span>📅 +50 clases/semana</span>
                <span>⭐ 4.9 calificación</span>
              </div>
            </Col>
            <Col md={5} className="text-center d-none d-md-block">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(240,192,64,0.15) 0%, transparent 70%)', borderRadius: '50%', transform: 'scale(1.5)' }} />
                <img src="/logo-icon.svg" alt="SportClub" style={{ width: '70%', opacity: 0.2, filter: 'drop-shadow(0 0 60px rgba(240,192,64,0.15))', position: 'relative' }} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* === CITA 1 === */}
      <section style={{ padding: '4rem 0', background: 'rgba(240,192,64,0.03)', borderTop: '1px solid rgba(240,192,64,0.06)', borderBottom: '1px solid rgba(240,192,64,0.06)' }}>
        <Container className="text-center">
          <p style={{ fontSize: '1.4rem', fontStyle: 'italic', color: '#c4b0db', maxWidth: 600, margin: '0 auto', lineHeight: 1.5 }}>
            "{quotes[0].text}"
          </p>
          <p style={{ color: 'var(--gold)', fontSize: '0.85rem', marginTop: '0.8rem', fontWeight: 600 }}>— {quotes[0].author}</p>
        </Container>
      </section>

      {/* === BENEFICIOS === */}
      <section style={{ padding: '5rem 0' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{ color: '#e8e0f4', fontSize: '2rem', fontWeight: 800 }}>¿Por qué SportClub?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>Todo lo que necesitas para alcanzar tu mejor versión</p>
          </div>
          <Row className="g-4">
            {benefits.map((b) => (
              <Col key={b.title} md={4}>
                <div className="glass-card p-4 h-100" style={{ cursor: 'default' }}>
                  <span style={{ fontSize: '2.2rem' }}>{b.icon}</span>
                  <h5 style={{ color: '#e8e0f4', margin: '0.8rem 0 0.4rem', fontWeight: 700, fontSize: '1rem' }}>{b.title}</h5>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{b.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* === CITA 2 + IMAGEN === */}
      <section style={{
        padding: '5rem 0',
        background: `linear-gradient(to right, rgba(18,14,36,0.9), rgba(42,24,96,0.7)), url('/two-women-training.jpg')`,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
      }}>
        <Container className="text-center">
          <p style={{ fontSize: '1.6rem', fontStyle: 'italic', color: '#e8e0f4', maxWidth: 650, margin: '0 auto', lineHeight: 1.5 }}>
            "{quotes[1].text}"
          </p>
          <p style={{ color: 'var(--gold)', fontSize: '0.9rem', marginTop: '1rem', fontWeight: 600 }}>— {quotes[1].author}</p>
        </Container>
      </section>

      {/* === SOBRE NOSOTROS === */}
      <section style={{ padding: '5rem 0' }}>
        <Container>
          <Row className="align-items-center g-5">
            <Col md={5}>
              <img src="/treadmills.jpg" alt="Instalaciones" style={{ width: '100%', borderRadius: 16, border: '1px solid rgba(240,192,64,0.1)' }} />
            </Col>
            <Col md={7}>
              <h2 style={{ color: '#e8e0f4', fontSize: '1.8rem', fontWeight: 800 }}>Nuestra visión</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginTop: '1rem' }}>
                En <strong style={{ color: 'var(--gold)' }}>SportClub</strong> creemos que el deporte transforma vidas. 
                No solo trabajamos el cuerpo, construimos disciplina, confianza y comunidad.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                Nuestros coaches certificados diseñan rutinas inteligentes, nuestra plataforma 
                digital te da control total de tu progreso, y nuestra comunidad te impulsa 
                a dar siempre un paso más.
              </p>
              <div className="d-flex gap-4 mt-3" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <div><span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.2rem' }}>10+</span><br />años de experiencia</div>
                <div><span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.2rem' }}>15</span><br />coaches certificados</div>
                <div><span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.2rem' }}>95%</span><br />satisfacción</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* === CITA 3 === */}
      <section style={{ padding: '4rem 0', background: 'rgba(240,192,64,0.02)', borderTop: '1px solid rgba(240,192,64,0.06)', borderBottom: '1px solid rgba(240,192,64,0.06)' }}>
        <Container className="text-center">
          <p style={{ fontSize: '1.3rem', fontStyle: 'italic', color: '#c4b0db', maxWidth: 600, margin: '0 auto', lineHeight: 1.5 }}>
            "{quotes[2].text}"
          </p>
          <p style={{ color: 'var(--gold)', fontSize: '0.85rem', marginTop: '0.8rem', fontWeight: 600 }}>— {quotes[2].author}</p>
        </Container>
      </section>

      {/* === CTA FINAL === */}
      <section style={{
        padding: '5rem 0',
        background: `linear-gradient(135deg, rgba(74,44,138,0.92), rgba(18,14,36,0.88)), url('/gym-interior.jpg')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <Container className="text-center">
          <h2 style={{ color: '#e8e0f4', fontSize: '2rem', fontWeight: 800 }}>¿Listo para empezar?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 500, margin: '1rem auto 2rem' }}>
            Únete a SportClub y descubre lo que realmente significa entrenar con propósito.
          </p>
          <Link to="/register"><Button variant="" className="btn-gold" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }}>Crear cuenta gratis</Button></Link>
        </Container>
      </section>

      {/* === FOOTER === */}
      <footer style={{ padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.04)', background: '#0e0a1e' }}>
        <Container>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <img src="/logo-icon.svg" alt="" height="24" />
              <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem' }}>SPORTCLUB</span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              &copy; {new Date().getFullYear()} SportClub. Todos los derechos reservados.
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}
