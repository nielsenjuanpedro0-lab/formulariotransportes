import React, { useState } from 'react';
import { 
  User, 
  Truck, 
  ShieldCheck, 
  ClipboardCheck, 
  CheckCircle,
  MapPin,
  Calendar,
  Package,
  FileText,
  AlertCircle
} from 'lucide-react';

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
    setIsSubmitted(true);
  };

  const renderStepIndicator = () => {
    const steps = [
      { num: 1, icon: <User /> },
      { num: 2, icon: <Truck /> },
      { num: 3, icon: <ShieldCheck /> },
      { num: 4, icon: <ClipboardCheck /> }
    ];

    return (
      <div className="wizard-steps">
        {steps.map((s) => (
          <div 
            key={s.num} 
            className={`step-indicator ${step === s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}
            title={`Paso ${s.num}`}
          >
            {step > s.num ? <CheckCircle /> : s.icon}
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
            <h2><User size={28} /> Datos del Cliente</h2>
            <p style={{marginBottom: '2rem', color: 'var(--text-muted)'}}>Información corporativa del solicitante del servicio.</p>
            
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
            <h2><Truck size={28} /> Datos de la Carga y Logística</h2>
            <p style={{marginBottom: '2rem', color: 'var(--text-muted)'}}>Detalles operativos necesarios para cotizar el flete de la mercadería.</p>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha Estimada de Salida</label>
                <div style={{position: 'relative'}}>
                  <input type="date" name="fechaSalida" value={formData.fechaSalida} onChange={handleChange} />
                </div>
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
            <h2><ShieldCheck size={28} /> Seguros de Carga (Opcional)</h2>
            <p style={{marginBottom: '2rem', color: 'var(--text-muted)'}}>¿Deseas asegurar la mercadería durante el trayecto para mayor tranquilidad?</p>

            <div className={`checkbox-group ${formData.quiereSeguro ? 'highlighted' : ''}`} style={{ marginBottom: '0' }}>
              <input type="checkbox" id="quiereSeguro" name="quiereSeguro" checked={formData.quiereSeguro} onChange={handleChange} />
              <label htmlFor="quiereSeguro" style={{fontSize: '1.05rem', fontWeight: '600', color: formData.quiereSeguro ? 'var(--accent)' : 'var(--primary)'}}>Sí, deseo cotizar el seguro para la mercadería</label>
            </div>

            {formData.quiereSeguro && (
              <div className="dynamic-panel">
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
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="form-section">
            <h2><ClipboardCheck size={28} /> Resumen de la Solicitud</h2>
            <p style={{marginBottom: '1rem', color: 'var(--text-muted)'}}>Por favor, revisa que los datos sean correctos antes de confirmar el envío.</p>
            
            <div className="summary-grid">
              
              <div className="summary-card">
                <h3><User size={20}/> Cliente</h3>
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
                <h3><MapPin size={20}/> Ruta y Logística</h3>
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
                <h3><Package size={20}/> Carga</h3>
                <div className="summary-item">
                  <span className="label">Formato y Peso</span>
                  <span className="value">{formData.tipoCarga} - {formData.pesoEstimado || 'Sin especificar'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Eximición Transportista</span>
                  <span className="value">{formData.eximicion}</span>
                </div>
                {formData.archivoAdjunto && (
                  <div className="summary-item">
                    <span className="label">Archivo Adjunto</span>
                    <span className="value">{formData.archivoAdjunto.name}</span>
                  </div>
                )}
              </div>

              <div className="summary-card" style={{ borderColor: formData.quiereSeguro ? 'var(--accent)' : 'var(--border-color)', background: formData.quiereSeguro ? '#eff6ff' : '#f8fafc' }}>
                <h3 style={{ color: formData.quiereSeguro ? 'var(--accent)' : 'var(--primary)' }}><ShieldCheck size={20}/> Seguro Opcional</h3>
                <div className="summary-item">
                  <span className="label">Estado</span>
                  <span className="value" style={{ fontWeight: 700, color: formData.quiereSeguro ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {formData.quiereSeguro ? 'Solicitado' : 'No Solicitado'}
                  </span>
                </div>
                {formData.quiereSeguro && (
                  <>
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
              </div>

            </div>
            
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <AlertCircle size={16} />
              <p>La presente solicitud está sujeta a disponibilidad de flota, análisis de rutas y aprobación comercial.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem 2rem', animation: 'fadeInDown 0.5s ease-out' }}>
        <CheckCircle size={80} color="var(--success)" style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '2rem' }}>¡Cotización Solicitada!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
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
        <h1><Truck size={36} color="var(--accent)" /> Solicitud de Cotización</h1>
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
            <button type="button" className="btn-primary" onClick={nextStep}>
              Siguiente
            </button>
          ) : (
            <button type="submit" className="btn-primary" style={{ background: 'var(--success)'}}>
              <CheckCircle size={20} /> Confirmar y Enviar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default WizardForm;
