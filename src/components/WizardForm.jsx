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
    origen: '',
    destino: '',
    tipoCarga: 'Pallets',
    pesoEstimado: '',
    tipoServicio: 'Terrestre',
    eximicion: 'Territorio de Argentina',
    mercaderia: '',
    
    // Step 3
    quiereSeguro: false,
    sumaMaximaViaje: '',
    coberturaBasica: 'BASICA',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    alert("Solicitud procesada con éxito. Nos pondremos en contacto a la brevedad.");
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
                <label>Localidad de Origen (Carga) *</label>
                <input type="text" name="origen" placeholder="Ej: Rosario, Santa Fe" value={formData.origen} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Localidad de Destino o Multidestino *</label>
                <input type="text" name="destino" placeholder="Ej: Córdoba Capital o Varios destinos" value={formData.destino} onChange={handleChange} required />
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
                <label>Ámbito de Eximición del Transportista</label>
                <select name="eximicion" value={formData.eximicion} onChange={handleChange}>
                  <option value="Territorio de Argentina">Solo Territorio de Argentina</option>
                  <option value="Mercosur y países limítrofes">Mercosur y países limítrofes</option>
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

            <div className="form-group checkbox-group" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', border: '1px solid var(--accent)' }}>
              <input type="checkbox" id="quiereSeguro" name="quiereSeguro" checked={formData.quiereSeguro} onChange={handleChange} />
              <label htmlFor="quiereSeguro" style={{margin:0, cursor:'pointer', fontSize: '1.1rem', color: 'var(--accent)', fontWeight: 'bold'}}>Sí, deseo cotizar el seguro para la mercadería</label>
            </div>

            {formData.quiereSeguro && (
              <div className="dynamic-panel" style={{ marginTop: '0', animation: 'fadeIn 0.3s ease-out' }}>
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
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <p><strong>Cliente:</strong> {formData.nombre || 'No especificado'} ({formData.iva})</p>
              <p><strong>Ruta:</strong> {formData.origen || 'A definir'} ➔ {formData.destino || 'A definir'}</p>
              <p><strong>Servicio:</strong> {formData.tipoServicio}</p>
              <p><strong>Carga:</strong> {formData.tipoCarga} - {formData.pesoEstimado || 'Peso no especificado'}</p>
              <p><strong>Eximición Transportista:</strong> {formData.eximicion}</p>
              
              <hr style={{ borderColor: 'var(--glass-border)', margin: '1rem 0' }} />
              
              <p><strong>Seguro Opcional:</strong> <span style={{color: formData.quiereSeguro ? 'var(--accent)' : 'var(--text-muted)'}}>{formData.quiereSeguro ? 'Sí, solicitado' : 'No solicitado'}</span></p>
              
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
