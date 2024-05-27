//DESCRIPTION:Convert Page Number Placeholder '#' into Text  
// A Jongware Script 11-Dec-2011  
  
var allPages = app.activeDocument.pages;  
for (iterate = 0; iterate < allPages.length; iterate++) {  
    customPageNumber(allPages[iterate]);  
}  
  
function customPageNumber(aPage) {  
    if (aPage.appliedMaster == null)  
        return;  
  
    pageSide = (aPage.side == PageSideOptions.RIGHT_HAND) ? 1 : 0;  
    masterFrame = findFrameContaining(aPage.appliedMaster, pageSide, '&');  
    if (masterFrame != null) {  
        frame = findByLabel(aPage.pageItems, "page number");  
        if (frame != null) {  
            frame.removeOverride();  
        }  
        frame = masterFrame.override(aPage);  
        frame.label = "page number";  
  
        placeholder = frame.contents.indexOf('&');  
        if (placeholder != -1) {  
            pageString = numberToText(Number(aPage.name));  
            pageString = pageString.substr(0, 1).toUpperCase() + pageString.substr(1);  
            frame.characters[placeholder].contents = pageString;  
            clearObjectStyle(frame, aPage.name % 2 === 0); // Passa true para páginas pares e false para ímpares
        }  
    }  
}  
  
function findFrameContaining(master, side, text) {  
    var masterPage;  
    var i;  
  
    if (master.pages.length > 1)  
        masterPage = master.pages[side];  
    else  
        masterPage = master.pages[0];  
    for (i = 0; i < masterPage.textFrames.length; i++) {  
        if (masterPage.textFrames[i].contents.indexOf(text) > -1)  
            return masterPage.textFrames[i];  
    }  
    // Not found? Perhaps on this Master's Master?  
    if (master.appliedMaster != null)  
        return findFrameContaining(master.appliedMaster, side, text);  
    return null;  
}  
  
// Needed because the very useful label lookup was  
// -- totally unnecessarily! -- removed in CS5+ ...  
function findByLabel(items, label) {  
    var i;  
    for (i = 0; i < items.length; i++) {  
        if (items[i].label == label)  
            return items[i];  
    }  
    return null;  
}  
  
function numberToText(number) {  
    var ones = ["zero", "um", "dois", "três", "quatro", "cinco",  
        "seis", "sete", "oito", "nove", "dez",  
        "onze", "doze", "treze", "quatorze", "quinze",  
        "dezesseis", "dezessete", "dezoito", "dezenove"];  
    var tens = ["zero", "dez", "vinte", "trinta", "quarenta", "cinquenta",  
        "sessenta", "setenta", "oitenta", "noventa"];  
    var cens = ["cem", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos",  
        "seiscentos", "setecentos", "oitocentos", "novecentos"];  
    var result = '';  
  
    if (number < 0)  
        return "ha ha";  
    if (number == 0)  
        return ones[0];  
    if (number == 100)  
        return cens[0];  
  
    if (number >= 1000) {  
        thousand = Math.floor(number / 1000);  
        result = numberToText(thousand) + " mil";  
        number = number - 1000 * thousand;  
        if (number > 0)  
            result = result + " ";  
    }  
  
    if (number > 100) {  
        hundred = Math.floor(number / 100);  
        result = result + cens[hundred];  
        number = number - 100 * hundred;  
        if (number != 0)  
            result = result + " e ";  
    }  
  
    if (number >= 20) {  
        ten = Math.floor(number / 10);  
        result = result + tens[ten];  
        number = number - 10 * ten;  
        if (number != 0)  
            result = result + " e ";  
    }  
    if (number != 0)  
        result = result + ones[number];  
    return result;  
}  
  
function clearObjectStyle(frame, isEvenPage) {  
    frame.fillColor = "Paper";  
    frame.strokeColor = "None";  
    frame.strokeWeight = 0;  
  
    var objectStyle = isEvenPage ? "RODAPE_PAGINACAO_EXTENSO_PAR_RECORTE" : "RODAPE_PAGINACAO_EXTENSO_IMPAR_RECORTE";  
  
    try {  
        frame.appliedObjectStyle = app.activeDocument.objectStyles.item(objectStyle);  
    } catch (e) {  
        alert("O estilo de objeto '" + objectStyle + "' não foi encontrado no documento.");  
    }  
}