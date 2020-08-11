// ============
// Puerto
//=============

process.env.PORT = process.env.PORT || 3000


// =======================
// Vencimiento del Token
//========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días

process.env.CADUCIDAD_TOKEN = 60 * 60 *  24 * 20

// =======================
// SEED de autenticación
// =======================

process.env.SEED = 'este-es-el-seed-desarrollo'

// =======================
// Google Client id
//========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '412244306992-h6h9gaqpfhuu7o9j9vj5vd5jakgltej8.apps.googleusercontent.com'