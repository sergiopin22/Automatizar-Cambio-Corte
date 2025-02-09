const express = require('express');
const { PDFDocument, rgb } = require('pdf-lib');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'POST',
}));

app.post('/generate-pdf', async (req, res) => {
  try {
    const { 
      name, 
      aNumber, 
      streetAddress, 
      city, 
      state, 
      postalCode, 
      currentCourt, 
      newCourt, 
      oplaOffice, 
      reason, 
      judgeName, 
      hearingDate, 
      motionDate 
    } = req.body;
    
    console.log('Datos recibidos:', req.body);

    const formattedMotionDate = formatDate(motionDate);
    const formattedHearingDate = formatDate(hearingDate);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    page.drawText('Moción de Cambio de Corte', { x: 50, y: 750, size: 20, color: rgb(0, 0, 0) });
    page.drawText(`Nombre Completo: ${name}`, { x: 50, y: 700, size: 12 });
    page.drawText(`Número A: ${aNumber}`, { x: 50, y: 680, size: 12 });
    page.drawText(`Dirección: ${streetAddress}, ${city}, ${state} ${postalCode}`, { x: 50, y: 660, size: 12 });
    page.drawText(`Corte Actual: ${currentCourt}`, { x: 50, y: 640, size: 12 });
    page.drawText(`Nueva Corte: ${newCourt}`, { x: 50, y: 620, size: 12 });
    page.drawText(`Oficina de OPLA: ${oplaOffice}`, { x: 50, y: 600, size: 12 });
    page.drawText(`Razón del Cambio: ${reason}`, { x: 50, y: 580, size: 12 });
    page.drawText(`Fecha de la Moción: ${formattedMotionDate}`, { x: 50, y: 560, size: 12 });
    page.drawText(`Nombre del Juez: ${judgeName}`, { x: 50, y: 540, size: 12 });
    page.drawText(`Fecha de Audiencia: ${formattedHearingDate}`, { x: 50, y: 520, size: 12 });

    const pdfBytes = await PDFDocument.save(pdfDoc);
    const desktopPath = 'C:/Users/SERGIOALEJANDROPINZO/Desktop/motion-test.pdf';
    fs.writeFileSync(desktopPath, pdfBytes);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=motion.pdf');
    res.end(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    res.status(500).send('Error al generar el PDF');
  }
});

function formatDate(dateString) {
  if (!dateString) return 'Fecha no válida';
  
  const [year, month, day] = dateString.split('-');
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = months[parseInt(month, 10) - 1];
  return `${monthName} ${parseInt(day, 10)}, ${year}`;
}

app.listen(5000, () => {
  console.log('Servidor corriendo en http://localhost:5000');
});
