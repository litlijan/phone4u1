const ejs = require('ejs');
const pdf = require('html-pdf');
const fs = require('fs');
const Orders = require('../model/order');
module.exports ={
   

    downloadPdf : (req,res,startDate,endDate,newArray)=>{
    const template = fs.readFileSync('utility/template.ejs', 'utf-8');
    
    
    const html = ejs.render(template, { startDate, endDate,newArray });
    
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