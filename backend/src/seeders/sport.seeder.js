// src/seeders/sport.seeder.js

const { Sport } = require('../models');

const sports = [
  { name: 'CrossFit', objective: 'Mejorar fuerza, resistencia y condición física general.', duration: 60, status: true },
  { name: 'Yoga', objective: 'Mejorar flexibilidad, equilibrio y bienestar mental.', duration: 45, status: true },
  { name: 'Spinning', objective: 'Aumentar la resistencia cardiovascular mediante ciclismo indoor.', duration: 50, status: true },
  { name: 'Entrenamiento Funcional', objective: 'Desarrollar movimientos funcionales para las actividades diarias.', duration: 60, status: true },
  { name: 'Pilates', objective: 'Fortalecer la zona media y mejorar la postura corporal.', duration: 45, status: true },
  { name: 'Boxeo', objective: 'Mejorar coordinación, resistencia y habilidades de defensa personal.', duration: 60, status: false },
  { name: 'Fútbol', objective: 'Desarrollar habilidades técnicas, tácticas y trabajo en equipo.', duration: 90, status: true },
  { name: 'Natación', objective: 'Mejorar capacidad cardiovascular, resistencia y técnica de nado.', duration: 60, status: true },
]

async function seedSports() {
  let created = 0
  for (const sport of sports) {
    const [, isNew] = await Sport.findOrCreate({
      where: { name: sport.name },
      defaults: sport
    })
    if (isNew) created++
  }
  if (created > 0) console.log(`Sports seeded: ${created} new.`)
  else console.log('Sports already seeded.')
}

module.exports = { seedSports }