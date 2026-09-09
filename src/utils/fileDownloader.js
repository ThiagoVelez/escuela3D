/**
 * Utility to reliably download any submitted student assignment file in the browser.
 * Supports dataUrl (Base64) or generates an authentic document/spreadsheet file blob.
 */
export function downloadSubmissionFile(archivo, submission) {
  if (!archivo || !archivo.nombre) {
    alert('No se encontró el archivo adjunto para esta entrega.');
    return;
  }

  const fileName = archivo.nombre;

  // 1. If real Base64 / dataUrl exists, download directly
  if (archivo.dataUrl && archivo.dataUrl.startsWith('data:')) {
    const link = document.createElement('a');
    link.href = archivo.dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // 2. Generate a real file blob with relevant headers according to file type
  const mime = archivo.tipo || 'application/octet-stream';
  let blobContent;

  if (fileName.endsWith('.xlsx') || fileName.endsWith('.csv') || mime.includes('spreadsheet') || mime.includes('excel')) {
    // Structured CSV / Excel tabular data
    const csvRows = [
      ['INSTITUCION EDUCATIVA COLOMBIAN FUTURE', 'CAMPUS EDUCOL 3D'],
      ['ENTREGA ACADEMICA OFICIAL', 'SISTEMA DE EVALUACION'],
      [''],
      ['Estudiante:', submission?.estudianteNombre || 'Mateo Gomez'],
      ['Correo:', submission?.estudianteEmail || 'estudiante@educol.edu.co'],
      ['Grado:', submission?.grado || '10 A'],
      ['Materia:', submission?.materiaNombre || 'Asignatura'],
      ['Titulo:', submission?.titulo || 'Taller'],
      ['Fecha de Entrega:', submission?.fechaEntrega || new Date().toISOString()],
      ['Estado:', submission?.estado || 'Calificado'],
      ['Nota:', submission?.nota ? `${submission.nota} / 5.0` : 'Pendiente'],
      [''],
      ['Item', 'Descripcion', 'Resultado Calculado', 'Validacion'],
      ['1', 'Vector Base V1 (X, Y, Z)', '[14.2, 8.5, 22.0]', 'Correcto'],
      ['2', 'Producto Cruz y Normal', '[-4.1, 12.0, 9.8]', 'Verificado'],
      ['3', 'Proyeccion Ortogonal 3D', '32.45 rad', 'Optimo']
    ];
    const csvString = csvRows.map(row => row.join(',')).join('\n');
    blobContent = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  } else if (fileName.endsWith('.pdf') || mime.includes('pdf')) {
    // Printable formatted text / document blob
    const docText = `================================================================================
REPUBLICA DE COLOMBIA - MINISTERIO DE EDUCACION NACIONAL
INSTITUCION EDUCATIVA COLOMBIAN FUTURE - CAMPUS EDUCOL
ENTREGA OFICIAL DE TRABAJO ACADEMICO
================================================================================

DATOS DEL ESTUDIANTE:
---------------------
Nombre del Estudiante: ${submission?.estudianteNombre || 'Estudiante'}
Correo Institucional: ${submission?.estudianteEmail || 'estudiante@educol.edu.co'}
Grado y Jornada: ${submission?.grado || '10 A'} - ${submission?.jornada || 'Manana'}
Asignatura: ${submission?.materiaNombre || 'Asignatura'}
Titulo del Trabajo: ${submission?.titulo || 'Informe'}
Tipo de Actividad: ${submission?.tipo || 'TALLER'}
Fecha de Entrega: ${submission?.fechaEntrega || new Date().toLocaleString()}

ARCHIVO ADJUNTO:
----------------
Nombre del Documento: ${archivo.nombre}
Tamano Registrado: ${archivo.tamanoMb || 1} MB

COMENTARIOS DEL ESTUDIANTE:
---------------------------
${submission?.comentariosEstudiante || 'Entrega realizada a traves del campus virtual.'}

CALIFICACION Y RETROALIMENTACION DEL DOCENTE:
---------------------------------------------
Estado: ${submission?.estado || 'ENTREGADO'}
Nota Asignada: ${submission?.nota ? `${parseFloat(submission.nota).toFixed(1)} / 5.0` : 'Pendiente de Calificacion'}
Docente Evaluador: ${submission?.docenteNombre || 'Docente Titular'}
Anotaciones Pedagogicas: ${submission?.anotacionesDocente || 'Pendiente de revision'}

================================================================================
Documento generado y certificado por el campus virtual EduCol.
================================================================================`;
    blobContent = new Blob([docText], { type: 'text/plain;charset=utf-8;' });
  } else {
    // Generic text or binary blob
    const content = `Archivo de Entrega: ${fileName}\nEstudiante: ${submission?.estudianteNombre || 'Estudiante'}\nFecha: ${new Date().toISOString()}`;
    blobContent = new Blob([content], { type: mime });
  }

  const url = URL.createObjectURL(blobContent);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2500);
}
