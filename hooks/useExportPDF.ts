import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const useExportPDF = () => {
    const [isExporting, setIsExporting] = useState(false);

    const exportPDF = async (elementId: string, fileName: string) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        setIsExporting(true);
        try {
            console.log('Starting Ultra-Stable Export for:', elementId);
            
            // Step 1: Preliminary measurements
            const totalWidth = element.offsetWidth;
            const totalHeight = element.scrollHeight;
            
            // Adjust scale based on total height to prevent GPU buffer overflow
            // If the element is > 8000px, we go down to scale 1.0 to stay under the 16kpx canvas limit
            let scale = 1.6;
            if (totalHeight > 8000) scale = 1.25;
            if (totalHeight > 12000) scale = 0.9;

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const contentWidth = pageWidth - (margin * 2);
            
            // Step 2: Slice and Dice
            // We use a safe slice height that fits well within memory
            const sliceHeight = 1500; 
            let currentY = 0;
            let pdfCursorY = margin;

            while (currentY < totalHeight) {
                const heightToCapture = Math.min(sliceHeight, totalHeight - currentY);
                
                // We use a focused html2canvas call
                // Note: html2canvas 'y' option is for the CROP coordinate, not the scroll coordinate
                const canvas = await html2canvas(element, {
                    scale: scale,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    x: 0,
                    y: currentY,
                    width: totalWidth,
                    height: heightToCapture,
                    // Critical: Ignore the background radial dots that might crash heavy renders
                    ignoreElements: (el) => el.classList.contains('fixed') || el.style.backgroundImage.includes('radial-gradient'),
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.85); // JPEG is much better for memory than PNG
                const imgHeightInMm = (canvas.height * contentWidth) / canvas.width;

                // Page management
                if (pdfCursorY + imgHeightInMm > pageHeight - margin) {
                    pdf.addPage();
                    pdfCursorY = margin;
                }

                pdf.addImage(imgData, 'JPEG', margin, pdfCursorY, contentWidth, imgHeightInMm, undefined, 'FAST');
                
                pdfCursorY += imgHeightInMm;
                currentY += heightToCapture;
                
                // Allow browser to GC between heavy canvas operations
                await new Promise(r => setTimeout(r, 100));
            }

            pdf.save(`${fileName.replace(/\s+/g, '_')}.pdf`);
            console.log('PDF Export Complete');
        } catch (error) {
            console.error('PDF Export Strategy Failed:', error);
            alert('PDF generation failed. The document is likely too large for your browser\'s RAM. \n\nPlease use Cmd+P (Mac) or Ctrl+P (Windows) and select "Save as PDF" for a high-quality capture.');
        } finally {
            setIsExporting(false);
        }
    };

    return { exportPDF, isExporting };
};
