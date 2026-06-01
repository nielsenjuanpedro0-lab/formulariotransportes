import React, { useState } from 'react';

const WizardForm = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState({
    // Step 1
    nombre: '',
    cuit: '',
    email: '',
    telefono: '',
    actividad: '',
    iva: 'Responsable Inscripto',
    
    // Step 2 - Transport Logistics
    fechaSalida: '',
    origen: '',
    tipoDestino: 'Único',
    destino: '',
    tipoServicio: 'Terrestre',
    tipoVehiculo: 'Semi-remolque (Sider/Barandas)',
    eximicion: 'Territorio de Argentina',
    tipoCarga: 'Pallets',
    pesoEstimado: '',
    mercaderia: '',
    archivoAdjunto: null,
    
    // Step 3
    quiereSeguro: false,
    sumaMaximaViaje: '',
    coberturaBasica: 'BASICA',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    
    // Simular envío o preparar un mailto (En un futuro conectar con EmailJS)
    const asunto = `Nueva Solicitud de Cotización - ${formData.nombre}`;
    const cuerpo = `
    DATOS DEL CLIENTE:
    - Nombre: ${formData.nombre} (${formData.iva})
    - CUIT: ${formData.cuit}
    - Email: ${formData.email}
    - Teléfono: ${formData.telefono}

    LOGÍSTICA:
    - Ruta: ${formData.origen} a ${formData.destino} (${formData.tipoDestino})
    - Fecha Estimada: ${formData.fechaSalida || 'No especificada'}
    - Servicio: ${formData.tipoServicio}
    - Vehículo sugerido: ${formData.tipoVehiculo}
    - Carga: ${formData.tipoCarga} (${formData.pesoEstimado})
    - Mercadería: ${formData.mercaderia}
    - Eximición: ${formData.eximicion}

    SEGURO:
    - Solicitado: ${formData.quiereSeguro ? 'SÍ' : 'NO'}
    ${formData.quiereSeguro ? `- Suma Max x Viaje: $${formData.sumaMaximaViaje} \n    - Cobertura: ${formData.coberturaBasica}` : ''}
    `;

    // Muestra modal interno en lugar de alerta nativa
    setIsSubmitted(true);
    
    // Opcional: abre el gestor de correo
    // window.location.href = `mailto:cotizaciones@tuempresa.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  };

  const renderStepIndicator = () => {
    return (
      <div className="wizard-steps">
        {[1, 2, 3, 4].map(num => (
          <div key={num} className={`step-indicator ${step === num ? 'active' : ''} ${step > num ? 'completed' : ''}`}>
            {step > num ? '✓' : num}
          </div>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="form-section">
            <h2>Paso 1: Datos del Cliente</h2>
            <p style={{marginBottom: '1.5rem', color: 'var(--text-muted)'}}>Información del solicitante del servicio.</p>
            
            <div className="form-group">
              <label>Nombre(s) y Apellido(s) / Razón Social *</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>DNI / CUIT *</label>
                <input type="text" name="cuit" value={formData.cuit} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Condición frente al IVA</label>
                <select name="iva" value={formData.iva} onChange={handleChange}>
                  <option>Consumidor Final</option>
                  <option>Exento</option>
                  <option>Monotributo</option>
                  <option>Responsable Inscripto</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email de Contacto</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-section">
            <h2>Paso 2: Datos de la Carga y Logística</h2>
            <p style={{marginBottom: '1.5rem', color: 'var(--text-muted)'}}>Detalles necesarios para cotizar el flete/transporte de la mercadería.</p>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha Estimada de Salida</label>
                <input type="date" name="fechaSalida" value={formData.fechaSalida} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Localidad de Origen (Carga) *</label>
                <input type="text" name="origen" placeholder="Ej: Rosario, Santa Fe" value={formData.origen} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Destino</label>
                <select name="tipoDestino" value={formData.tipoDestino} onChange={handleChange}>
                  <option value="Único">Destino Único</option>
                  <option value="Multidestino">Multidestino</option>
                </select>
              </div>
              <div className="form-group">
                <label>Localidad(es) de Destino</label>
                <input type="text" name="destino" placeholder={formData.tipoDestino === 'Único' ? "Ej: Córdoba Capital" : "Ej: Córdoba, Mendoza, San Juan"} value={formData.destino} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Servicio</label>
                <select name="tipoServicio" value={formData.tipoServicio} onChange={handleChange}>
                  <option value="Terrestre">Terrestre</option>
                  <option value="Marítimo">Marítimo</option>
                  <option value="Aéreo">Aéreo</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tipo de Vehículo Sugerido</label>
                <select name="tipoVehiculo" value={formData.tipoVehiculo} onChange={handleChange} disabled={formData.tipoServicio !== 'Terrestre'} style={{ opacity: formData.tipoServicio !== 'Terrestre' ? 0.5 : 1 }}>
                  <option value="Semi-remolque (Sider/Barandas)">Semi-remolque (Sider/Barandas)</option>
                  <option value="Chasis / Balancín">Chasis / Balancín</option>
                  <option value="Furgón Cerrado">Furgón Cerrado</option>
                  <option value="Refrigerado / Térmico">Refrigerado / Térmico</option>
                  <option value="Plataforma / Carretón">Plataforma / Carretón</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Formato de la Carga</label>
                <select name="tipoCarga" value={formData.tipoCarga} onChange={handleChange}>
                  <option value="Pallets">Pallets</option>
                  <option value="Cajas / Bultos Sueltos">Cajas / Bultos Sueltos</option>
                  <option value="A Granel">A Granel</option>
                  <option value="Maquinaria / Pesada">Maquinaria / Carga Pesada</option>
                  <option value="Contenedor">Contenedor</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Peso Estimado (Kg o Toneladas)</label>
                <input type="text" name="pesoEstimado" placeholder="Ej: 15.000 Kg" value={formData.pesoEstimado} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ámbito de Eximición del Transportista</label>
                <select name="eximicion" value={formData.eximicion} onChange={handleChange}>
                  <option value="Territorio de Argentina">Solo Territorio de Argentina</option>
                  <option value="Mercosur y países limítrofes">Mercosur y países limítrofes</option>
                </select>
              </div>
              <div className="form-group">
                <label>Adjuntar Remito, Detalle de Carga o Fotos (Opcional)</label>
                <input type="file" name="archivoAdjunto" onChange={handleChange} accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png" />
              </div>
            </div>

            <div className="form-group">
              <label>Descripción de la Mercadería</label>
              <textarea name="mercaderia" rows="2" placeholder="¿Qué tipo de mercadería es? ¿Requiere frío, es frágil, es peligrosa?" value={formData.mercaderia} onChange={handleChange}></textarea>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-section">
            <h2>Paso 3: Seguros (Opcional)</h2>
            <p style={{marginBottom: '1.5rem', color: 'var(--text-muted)'}}>¿Deseas asegurar la carga durante el trayecto?</p>

            <div className={`checkbox-group ${formData.quiereSeguro ? 'highlighted' : ''}`} style={{ marginBottom: '0' }}>
              <input type="checkbox" id="quiereSeguro" name="quiereSeguro" checked={formData.quiereSeguro} onChange={handleChange} />
              <label htmlFor="quiereSeguro" style={{fontSize: '1.05rem', fontWeight: '600', color: formData.quiereSeguro ? 'var(--accent)' : 'inherit'}}>Sí, deseo cotizar el seguro para la mercadería</label>
            </div>

            {formData.quiereSeguro && (
              <div className="dynamic-panel">
                <div className="form-group">
                  <label>Suma Máxima Asegurada por Viaje ($) *</label>
                  <input type="number" name="sumaMaximaViaje" placeholder="Requerido para cotizar el seguro" value={formData.sumaMaximaViaje} onChange={handleChange} required={formData.quiereSeguro} />
                </div>
                
                <div className="form-group">
                  <label>Cobertura Principal de Transporte</label>
                  <select name="coberturaBasica" value={formData.coberturaBasica} onChange={handleChange}>
                    <option value="BASICA">Básica</option>
                    <option value="BASICA + ROBO">Básica + Robo</option>
                    <option value="TODO RIESGO">Todo Riesgo</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="form-section">
            <h2>Paso 4: Resumen de la Solicitud</h2>
            <p style={{marginBottom: '1.5rem', color: 'var(--text-muted)'}}>Por favor, revisa que los datos sean correctos antes de enviar.</p>
            
            <div className="summary-box">
              <p><strong>Cliente:</strong> {formData.nombre || 'No especificado'} ({formData.iva})</p>
              <p><strong>Fecha Salida:</strong> {formData.fechaSalida ? new Date(formData.fechaSalida).toLocaleDateString() : 'No especificada'}</p>
              <p><strong>Ruta:</strong> {formData.origen || 'A definir'} ➔ {formData.destino || 'A definir'} ({formData.tipoDestino})</p>
              <p><strong>Servicio:</strong> {formData.tipoServicio} {formData.tipoServicio === 'Terrestre' ? `- Vehículo: ${formData.tipoVehiculo}` : ''}</p>
              <p><strong>Carga:</strong> {formData.tipoCarga} - {formData.pesoEstimado || 'Peso no especificado'}</p>
              <p><strong>Eximición:</strong> {formData.eximicion}</p>
              {formData.archivoAdjunto && <p><strong>Archivo:</strong> {formData.archivoAdjunto.name}</p>}
              
              <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />
              
              <p><strong>Seguro Opcional:</strong> <span style={{color: formData.quiereSeguro ? 'var(--accent)' : 'var(--text-muted)', fontWeight: '600'}}>{formData.quiereSeguro ? 'Sí, solicitado' : 'No solicitado'}</span></p>
              
              {formData.quiereSeguro && (
                <>
                  <p><strong>Suma Max por Viaje:</strong> ${formData.sumaMaximaViaje}</p>
                  <p><strong>Cobertura Base:</strong> {formData.coberturaBasica}</p>
                </>
              )}
            </div>
            
            <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <p>IMPORTANTE: La presente solicitud está sujeta a disponibilidad de flota y aprobación comercial.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', animation: 'fadeInDown 0.5s ease-out' }}>
        <div style={{ fontSize: '4rem', color: 'var(--success)', marginBottom: '1rem' }}>✓</div>
        <h2 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '2rem' }}>¡Solicitud Enviada!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
          Hemos recibido los datos correctamente. Nuestro equipo logístico analizará la información y se pondrá en contacto a la brevedad con la cotización.
        </p>
        <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
          Realizar otra cotización
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <div className="header">
        <h1>Solicitud de Cotización</h1>
        <p>Servicios de Logística y Transporte</p>
      </div>

      {renderStepIndicator()}

      <form onSubmit={handleSubmit}>
        {renderStepContent()}

        <div className="actions">
          {step > 1 ? (
            <button type="button" className="btn-secondary" onClick={prevStep}>Atrás</button>
          ) : <div></div>}
          
          {step < totalSteps ? (
            <button type="button" className="btn-primary" onClick={nextStep}>Siguiente</button>
          ) : (
            <button type="submit" className="btn-primary" style={{ background: 'var(--success)'}}>Enviar Solicitud</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default WizardForm;
