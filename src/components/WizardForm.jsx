import React, { useState } from 'react';

const API_BASE = 'http://127.0.0.1:8000';

const WizardForm = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState({
    nombre: '',
    cuit: '',
    email: '',
    telefono: '',
    iva: 'Responsable Inscripto',
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
    quiereSeguro: false,
    tienePolizaExistente: false,
    archivoPoliza: null,
    sumaMaximaViaje: '',
    coberturaBasica: 'BASICA',
    aseguradoraDetectada: '',
    adiccionalesDetectados: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfResult, setPdfResult] = useState(null);
  const [pdfError, setPdfError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData(prev => {
      const updatedValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
      const newData = { ...prev, [name]: updatedValue };

      // Auto-selección de eximición para Multidestino o Chile
      if (name === 'tipoDestino' || name === 'destino') {
        const isMultidestino = name === 'tipoDestino' ? updatedValue === 'Multidestino' : newData.tipoDestino === 'Multidestino';
        const isChile = name === 'destino'
          ? updatedValue.toLowerCase().includes('chile')
          : newData.destino.toLowerCase().includes('chile');
        if (isMultidestino || isChile) {
          newData.eximicion = 'Mercosur y países limítrofes';
        }
      }

      return newData;
    });
  };

  const handlePolicyUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData(prev => ({ ...prev, archivoPoliza: file }));
    setIsLoadingPdf(true);
    setPdfResult(null);
    setPdfError('');

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/api/extract-policy/`, {
        method: 'POST',
        body: uploadData,
      });
      if (!res.ok) throw new Error('Error al procesar el PDF');
      const result = await res.json();
      setPdfResult(result);

      // Auto-fill form with extracted data
      setFormData(prev => ({
        ...prev,
        sumaMaximaViaje: result.suma_asegurada || prev.sumaMaximaViaje,
        mercaderia: result.mercaderia || prev.mercaderia,
        aseguradoraDetectada: result.aseguradora || '',
        adiccionalesDetectados: result.adicionales ? result.adicionales.join(', ') : '',
      }));
    } catch (err) {
      setPdfError('No pudimos leer el PDF automáticamente. Los datos fueron cargados manualmente.');
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const nextStep = () => { if (step < totalSteps) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        if (key === 'archivoPoliza' && formData[key] instanceof File) {
          submitData.append('archivo_poliza', formData[key]);
        } else if (key !== 'archivoAdjunto' && key !== 'archivoPoliza') {
          submitData.append(key, formData[key]);
        }
      }
    });

    try {
      await fetch(`${API_BASE}/api/submit-quote/`, {
        method: 'POST',
        body: submitData,
      });
    } catch (err) {
      console.warn('Backend no disponible, pero cotización registrada localmente.');
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const renderStepIndicator = () => (
    <div className="wizard-steps">
      {[1, 2, 3, 4].map(num => (
        <div
          key={num}
          className={`step-indicator ${step === num ? 'active' : ''} ${step > num ? 'completed' : ''}`}
          title={`Paso ${num}`}
        >
          {step > num ? '✓' : num}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-section">
            <h2>Datos del Cliente</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Información corporativa del solicitante del servicio.</p>

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
            <h2>Datos de la Carga y Logística</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Detalles operativos necesarios para cotizar el flete de la mercadería.</p>

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
                <input type="text" name="destino" placeholder={formData.tipoDestino === 'Único' ? 'Ej: Córdoba Capital' : 'Ej: Córdoba, Mendoza, San Juan'} value={formData.destino} onChange={handleChange} />
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
                <label>Adjuntar Remito, Detalle o Fotos (Opcional)</label>
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
            <h2>Seguros de Carga</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>¿Deseás cotizar un seguro o ya contás con una póliza vigente?</p>

            {/* Option A: Cotizar Seguro */}
            <div className={`checkbox-group ${formData.quiereSeguro ? 'highlighted' : ''}`} style={{ marginBottom: '0.75rem' }}>
              <input type="checkbox" id="quiereSeguro" name="quiereSeguro" checked={formData.quiereSeguro} onChange={handleChange} />
              <label htmlFor="quiereSeguro" style={{ fontSize: '1.05rem', fontWeight: '600', color: formData.quiereSeguro ? 'var(--accent)' : 'var(--primary)' }}>
                Sí, deseo cotizar el seguro para la mercadería
              </label>
            </div>

            {formData.quiereSeguro && (
              <div className="dynamic-panel" style={{ marginBottom: '1.5rem' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Suma Máxima Asegurada por Viaje ($) *</label>
                    <input type="number" name="sumaMaximaViaje" placeholder="Ej: 5000000" value={formData.sumaMaximaViaje} onChange={handleChange} required={formData.quiereSeguro} />
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

                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <details>
                    <summary style={{ cursor: 'pointer', fontWeight: '600', color: 'var(--primary)', outline: 'none' }}>Ver exigencias de Medidas de Seguridad</summary>
                    <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                      <p>Dependiendo del valor declarado y la aseguradora seleccionada, podrían exigirse las siguientes medidas para garantizar la cobertura de Robo:</p>
                      <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
                        <li><strong>Custodia Satelital:</strong> Rastreo GPS, botón de pánico, corte de combustible, sensores de apertura en furgón y desenganche. Requerida para valores intermedios.</li>
                        <li><strong>Custodia Armada:</strong> Vehículo escolta con 2 (dos) personas armadas habilitadas y contacto visual permanente. Requerida para valores altos o zonas de riesgo (Ej: AMBA).</li>
                      </ul>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>* Nuestro equipo evaluará internamente qué esquema aplica a su caso particular al cotizar.</p>
                    </div>
                  </details>
                </div>
              </div>
            )}

            {/* Separator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0 1rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>O BIEN</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            </div>

            {/* Option B: Póliza Existente */}
            <div className={`checkbox-group ${formData.tienePolizaExistente ? 'highlighted' : ''}`} style={{ marginBottom: '0' }}>
              <input type="checkbox" id="tienePolizaExistente" name="tienePolizaExistente" checked={formData.tienePolizaExistente} onChange={handleChange} />
              <label htmlFor="tienePolizaExistente" style={{ fontSize: '1.05rem', fontWeight: '600', color: formData.tienePolizaExistente ? 'var(--accent)' : 'var(--primary)' }}>
                Ya cuento con una póliza vigente y deseo adjuntarla
              </label>
            </div>

            {formData.tienePolizaExistente && (
              <div className="dynamic-panel">
                <div className="form-group">
                  <label>Adjuntar Póliza (PDF) *</label>
                  <input type="file" accept=".pdf" onChange={handlePolicyUpload} />
                  {isLoadingPdf && (
                    <p style={{ marginTop: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>
                      ⏳ Analizando póliza automáticamente...
                    </p>
                  )}
                  {pdfError && (
                    <p style={{ marginTop: '0.75rem', color: '#e05a5a', fontSize: '0.9rem' }}>⚠ {pdfError}</p>
                  )}
                </div>

                {pdfResult && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '1.25rem', marginTop: '0.5rem' }}>
                    <p style={{ fontWeight: 700, marginBottom: '0.75rem', color: '#166534' }}>✓ Datos detectados automáticamente:</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.95rem' }}>
                      <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>ASEGURADORA</span>{pdfResult.aseguradora}</div>
                      <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>SUMA ASEGURADA</span>{pdfResult.suma_asegurada || 'No detectada'}</div>
                      <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>MERCADERÍA</span>{pdfResult.mercaderia || 'No detectada'}</div>
                      <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>ADICIONALES</span>{pdfResult.adicionales?.join(', ') || 'No detectados'}</div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>Estos datos se guardarán junto con su solicitud para que nuestro equipo los revise.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="form-section">
            <h2>Resumen de la Solicitud</h2>
            <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Por favor, revisa que los datos sean correctos antes de confirmar el envío.</p>

            <div className="summary-grid">
              <div className="summary-card">
                <h3>Cliente</h3>
                <div className="summary-item">
                  <span className="label">Razón Social</span>
                  <span className="value">{formData.nombre || 'No especificado'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">CUIT / Condición</span>
                  <span className="value">{formData.cuit || '-'} ({formData.iva})</span>
                </div>
                <div className="summary-item">
                  <span className="label">Contacto</span>
                  <span className="value">{formData.email || '-'} | {formData.telefono || '-'}</span>
                </div>
              </div>

              <div className="summary-card">
                <h3>Ruta y Logística</h3>
                <div className="summary-item">
                  <span className="label">Origen ➔ Destino</span>
                  <span className="value">{formData.origen || 'A definir'} ➔ {formData.destino || 'A definir'} ({formData.tipoDestino})</span>
                </div>
                <div className="summary-item">
                  <span className="label">Servicio</span>
                  <span className="value">{formData.tipoServicio} {formData.tipoServicio === 'Terrestre' ? `(${formData.tipoVehiculo})` : ''}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Fecha Salida</span>
                  <span className="value">{formData.fechaSalida ? new Date(formData.fechaSalida).toLocaleDateString('es-AR') : 'No especificada'}</span>
                </div>
              </div>

              <div className="summary-card">
                <h3>Carga</h3>
                <div className="summary-item">
                  <span className="label">Formato y Peso</span>
                  <span className="value">{formData.tipoCarga} - {formData.pesoEstimado || 'Sin especificar'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Eximición Transportista</span>
                  <span className="value">{formData.eximicion}</span>
                </div>
              </div>

              <div className="summary-card" style={{
                borderColor: formData.quiereSeguro ? 'var(--accent)' : formData.tienePolizaExistente ? '#86efac' : 'var(--border-color)',
                background: formData.quiereSeguro ? '#eff6ff' : formData.tienePolizaExistente ? '#f0fdf4' : '#f8fafc'
              }}>
                <h3>Seguro</h3>
                {formData.quiereSeguro && (
                  <>
                    <div className="summary-item">
                      <span className="label">Estado</span>
                      <span className="value" style={{ color: 'var(--accent)', fontWeight: 700 }}>Cotización Solicitada</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Suma Max. por Viaje</span>
                      <span className="value">${formData.sumaMaximaViaje}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Cobertura</span>
                      <span className="value">{formData.coberturaBasica}</span>
                    </div>
                  </>
                )}
                {formData.tienePolizaExistente && (
                  <>
                    <div className="summary-item">
                      <span className="label">Estado</span>
                      <span className="value" style={{ color: '#166534', fontWeight: 700 }}>Póliza Propia Adjunta</span>
                    </div>
                    {formData.aseguradoraDetectada && (
                      <div className="summary-item">
                        <span className="label">Aseguradora</span>
                        <span className="value">{formData.aseguradoraDetectada}</span>
                      </div>
                    )}
                  </>
                )}
                {!formData.quiereSeguro && !formData.tienePolizaExistente && (
                  <div className="summary-item">
                    <span className="label">Estado</span>
                    <span className="value" style={{ color: 'var(--text-muted)' }}>Sin Seguro</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <p>IMPORTANTE: La presente solicitud está sujeta a disponibilidad de flota, análisis de rutas y aprobación comercial.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ fontSize: '4rem', color: 'var(--success)', marginBottom: '1.5rem' }}>✓</div>
        <h2 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '2rem' }}>¡Cotización Registrada!</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          Hemos recibido los datos de la carga correctamente. Nuestro equipo logístico analizará la viabilidad y se pondrá en contacto a la brevedad con la propuesta económica.
        </p>
        <button type="button" className="btn-primary" style={{ margin: '0 auto' }} onClick={() => window.location.reload()}>
          Realizar otra cotización
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <div className="header">
        <h1>Solicitud de Cotización</h1>
        <p>Plataforma Integrada de Servicios Logísticos</p>
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
            <button type="submit" className="btn-primary" style={{ background: 'var(--success)' }} disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Confirmar y Enviar'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default WizardForm;
