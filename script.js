// Crear usuario Sami automáticamente
const admin = { user: "Sami", pass: "123", role: "admin" };
const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios") || "[]");

if (!usuariosGuardados.some(u => u.user === "Sami")) {
  localStorage.setItem("usuarios", JSON.stringify([admin]));
}

function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const found = usuarios.find(u => u.user === user && u.pass === pass);
  const errorBox = document.getElementById("error");

  if (!found) {
    errorBox.textContent = "Credenciales incorrectas. Intente nuevamente.";
    return;
  }

  errorBox.textContent = "";
  localStorage.setItem("auth", JSON.stringify(found));
  window.location.href = "dashboard.html";
}


// --- LOGOUT ---
function logout() {
  localStorage.removeItem("auth");
  window.location.href = "index.html";
}

// --- GUARDAR REGISTRO ---
function guardarRegistro() {
  const data = {
    fecha: new Date().toLocaleString(),
    pm25: parseFloat(pm25.value) || 0,
    co: parseFloat(co.value) || 0,
    ventilacion: parseInt(ventilacion.value),
    extractor: parseInt(extractor.value),
    ventanas: parseFloat(ventanas.value) || 0,
    combustible: parseInt(combustible.value),
    horasCocina: parseFloat(horasCocina.value) || 0,
    tabaquismo: parseInt(tabaquismo.value),
    horasHumo: parseFloat(horasHumo.value) || 0,
    fumadores: parseInt(fumadores.value) || 0
  };
  localStorage.setItem("datosIoT", JSON.stringify(data));
  alert("✅ Datos registrados correctamente.");
  window.location.href = "resultados.html";
}

// --- RESULTADOS PREDICTIVOS ---
function mostrarResultados() {
  const cont = document.getElementById("resultados");
  const data = JSON.parse(localStorage.getItem("datosIoT") || "{}");
  if (!data.pm25) {
    cont.innerHTML = "<p>No hay datos registrados.</p>";
    return;
  }

  let score = 0;
  if (data.pm25 > 50) score++;
  if (data.co > 9) score++;
  if (data.ventilacion === 0) score++;
  if (data.extractor === 0) score++;
  if (data.ventanas < 30) score++;
  if (data.combustible === 1) score++;
  if (data.horasCocina > 4) score++;
  if (data.tabaquismo === 1) score++;
  if (data.horasHumo > 5) score++;
  if (data.fumadores >= 2) score++;

  let nivel = "Bajo", color = "#16a34a", texto = "Condiciones saludables.";
  if (score >= 5 && score < 8) {
    nivel = "Moderado"; color = "#f97316";
    texto = "Riesgo medio. Mejore ventilación y reduzca exposición al humo.";
  } else if (score >= 8) {
    nivel = "Alto"; color = "#dc2626";
    texto = "⚠ Riesgo alto. Se recomienda intervención médica preventiva.";
  }

  cont.innerHTML = `
    <div class="result-card glass fadeIn">
      <h2 style="color:${color};">Resultado Predictivo</h2>
      <p><strong>Fecha:</strong> ${data.fecha}</p>
      <p><strong>PM2.5:</strong> ${data.pm25} µg/m³ | <strong>CO:</strong> ${data.co} ppm</p>
      <p><strong>Ventilación:</strong> ${data.ventilacion} | <strong>Extractor:</strong> ${data.extractor}</p>
      <p><strong>Combustible:</strong> ${data.combustible} | <strong>Fumadores:</strong> ${data.fumadores}</p>
      <h3 style="color:${color};font-size:1.6rem;">Nivel de Riesgo: ${nivel}</h3>
      <p>${texto}</p>
    </div>
  `;
}
