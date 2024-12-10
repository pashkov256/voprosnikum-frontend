import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (tableRef: HTMLTableElement | null, fileName: string) => {
    try {
        if (tableRef) {
            // Добавьте задержку, если необходимо, перед обработкой
            await new Promise((resolve) => setTimeout(resolve, 100)); // Задержка 100мс

            const canvas = await html2canvas(tableRef, { scale: 2 }); // Увеличение масштаба для более качественного изображения
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 190; // Ширина изображений на странице
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            let pageCount = Math.floor(heightLeft / pageHeight);

            for (let i = 1; i <= pageCount; i++) {
                position = -((pageHeight * i) - heightLeft);
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            }

            pdf.save(fileName);
        }
    } catch (error) {
        console.error("Error generating PDF: ", error);
        alert("Произошла ошибка при генерации PDF. Пожалуйста, попробуйте снова.");
    }
};
