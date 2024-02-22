const ejs = require('ejs');
const pdf = require('html-pdf');
const fs = require('fs');
module.exports ={

    downloadPdf : (req,res,orders,startDate,endDate,totalSales)=>{
    const template = fs.readFileSync('utility/template.ejs', 'utf-8');
    
    const html = ejs.render(template, { orders, startDate, endDate, totalSales });
    
    const pdfOptions = {
        format: 'Letter',
        orientation: 'portrait',
    };
    
    pdf.create(html, pdfOptions).toFile(`public/SRpdf/sales-report-${startDate}-${endDate}.pdf`, (err, response) => {
        if (err) return console.log(err);
        res.status(200).download(response.filename);
    });
    }
}